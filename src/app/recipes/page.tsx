import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  StyleSheet,
  Platform,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";

type Recipe = {
  id: number;
  name: string;
  image: string;
  ingredients: string[];
  cuisine?: string;
  tags?: string[];
};

type RecipesResponseFromAPI = {
  recipes: Recipe[];
  total?: number;
  skip?: number;
  limit?: number;
};

const RecipesPage = () => {
  const [data, setData] = useState<RecipesResponseFromAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const params = useLocalSearchParams<{ cuisine?: string; tag?: string }>();
  const cuisineFilter = params.cuisine;

  const pageTitle = cuisineFilter
    ? `Receitas: ${cuisineFilter.charAt(0).toUpperCase() + cuisineFilter.slice(1).replace('-', ' ')}`
    : "Receitas APP";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setData(null);
      let url = "https://dummyjson.com/recipes";
      if (cuisineFilter) {
        url = `https://dummyjson.com/recipes/category/${cuisineFilter}`;
      }

      try {
        const response = await axios.get<RecipesResponseFromAPI>(url);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData({ recipes: [] });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [cuisineFilter]);

  const filteredRecipes = data?.recipes.filter((recipe) => {
    const searchTerm = search.toLowerCase();
    const nameMatch = recipe.name.toLowerCase().includes(searchTerm);

    const ingredientsMatch =
      recipe.ingredients &&
      Array.isArray(recipe.ingredients) &&
      recipe.ingredients.some((ingredient) =>
        ingredient.toLowerCase().includes(searchTerm)
      );
    
    let matches = nameMatch || ingredientsMatch;

    return matches;
  });

  const renderRecipeItem = ({ item }: { item: Recipe }) => (
    <TouchableOpacity
      onPress={() => router.push(`/recipes/${item.id}`)}
      style={styles.recipeItem}
    >
      <Image source={{ uri: item.image }} style={styles.recipeImage} />
      <View style={styles.recipeTextContainer}>
        <Text style={styles.recipeName} numberOfLines={2}>
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyListComponent = () => (
    <View style={styles.centeredMessageContainer}>
      <Text style={styles.emptyText}>
        {search || cuisineFilter ? "Nenhuma receita encontrada com estes critérios." : "Nenhuma receita disponível."}
      </Text>
      {search && <Text style={styles.emptySubtitleText}>Tente buscar por outros termos.</Text>}
      {!search && !cuisineFilter && <Text style={styles.emptySubtitleText}>Volte mais tarde para novas receitas!</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.canGoBack() ? router.back() : router.push('/')}
          style={styles.headerIconButton}
        >
          <Entypo name="chevron-left" size={28} color="#007BFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{pageTitle}</Text>
        <TouchableOpacity
          onPress={() => router.push("/about/page")}
          style={styles.headerIconButton}
        >
          <AntDesign name="infocirlceo" size={24} color="#007BFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchOuterContainer}>
        <View style={styles.searchContainer}>
          <AntDesign
            name="search1"
            size={20}
            color="#888"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Nome ou ingrediente..."
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#888"
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.centeredMessageContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.loadingText}>Carregando Receitas...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredRecipes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderRecipeItem}
          contentContainerStyle={styles.listContentContainer}
          ListEmptyComponent={renderEmptyListComponent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) + 10 : 50,
    paddingBottom: 12,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    zIndex: 10,
  },
  headerIconButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginHorizontal: 5,
  },
  searchOuterContainer: {
    backgroundColor: "#fff",
    paddingBottom: 10,
    paddingTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    marginHorizontal: 15,
    paddingHorizontal: 15,
    height: 48,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    height: "100%",
  },
  centeredMessageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    color: "#007BFF",
    marginTop: 15,
    fontWeight: "500",
  },
  emptyText: {
    fontSize: 18,
    color: "#444",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 8,
  },
  emptySubtitleText: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
  },
  listContentContainer: {
    paddingTop: 10,
    paddingBottom: 20,
    flexGrow: 1,
  },
  recipeItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 15,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
  },
  recipeImage: {
    width: 75,
    height: 75,
    borderRadius: 10,
    marginRight: 15,
    backgroundColor: "#e0e0e0",
  },
  recipeTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  recipeName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
});

export default RecipesPage;