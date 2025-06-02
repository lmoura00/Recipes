import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import Entypo from '@expo/vector-icons/Entypo';
import { useFavorites } from '../../context/FavoritesContext';

type Recipe = {
  id: number;
  name: string;
  image: string;
  ingredients: string[];
};

type RecipesResponseFromAPI = {
  recipes: Recipe[];
  total?: number;
  skip?: number;
  limit?: number;
};

const FavoritesPage = () => {
  const router = useRouter();
  const { favoriteRecipeIds, loadingFavorites } = useFavorites();
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [loadingAllRecipes, setLoadingAllRecipes] = useState(true);

  useEffect(() => {
    const fetchAllRecipes = async () => {
      try {
        setLoadingAllRecipes(true);
        const response = await axios.get<RecipesResponseFromAPI>(
          'https://dummyjson.com/recipes?limit=100'
        );
        setAllRecipes(response.data.recipes || []);
      } catch (error) {
        console.error('Error fetching all recipes:', error);
        setAllRecipes([]);
      } finally {
        setLoadingAllRecipes(false);
      }
    };
    if (!loadingFavorites) {
        fetchAllRecipes();
    }
  }, [loadingFavorites]);

  const displayedFavoriteRecipes = useMemo(() => {
    if (loadingFavorites || loadingAllRecipes || !allRecipes.length || !favoriteRecipeIds.length) {
      return [];
    }
    return allRecipes.filter(recipe => favoriteRecipeIds.includes(recipe.id));
  }, [allRecipes, favoriteRecipeIds, loadingFavorites, loadingAllRecipes]);

  const renderRecipeItem = ({ item }: { item: Recipe }) => (
    <TouchableOpacity
      onPress={() => router.push(`/recipes/${item.id}`)}
      style={styles.recipeItem}
    >
      <Image source={{ uri: item.image }} style={styles.recipeImage} />
      <View style={styles.recipeTextContainer}>
        <Text style={styles.recipeName} numberOfLines={2}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyListComponent = () => (
    <View style={styles.centeredMessageContainer}>
      <Text style={styles.emptyText}>
        Você ainda não marcou nenhuma receita como favorita.
      </Text>
      <TouchableOpacity onPress={() => router.push('/recipes/page')} style={styles.exploreButton}>
        <Text style={styles.exploreButtonText}>Explorar Receitas</Text>
      </TouchableOpacity>
    </View>
  );

  if (loadingAllRecipes || loadingFavorites) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
         <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.headerIconButton}>
              <Entypo name="chevron-left" size={28} color="#007BFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Meus Favoritos</Text>
            <View style={styles.headerIconPlaceholder} />
        </View>
        <View style={styles.centeredMessageContainer}>
            <ActivityIndicator size="large" color="#007BFF" />
            <Text style={styles.loadingText}>Carregando Favoritos...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIconButton}>
          <Entypo name="chevron-left" size={28} color="#007BFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus Favoritos</Text>
        <View style={styles.headerIconPlaceholder} />
      </View>

      <FlatList
        data={displayedFavoriteRecipes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRecipeItem}
        contentContainerStyle={styles.listContentContainer}
        ListEmptyComponent={renderEmptyListComponent}
      />
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
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    zIndex: 1,
  },
  headerIconButton: {
    padding: 6,
    borderRadius: 20,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  headerIconPlaceholder: {
    width: 28 + 12,
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
  exploreButton: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    elevation: 2,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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

export default FavoritesPage;