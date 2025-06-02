import React, { useState, useEffect, useMemo } from "react";
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
  Modal,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";

type Recipe = {
  id: number;
  name: string;
  image: string;
  ingredients: string[];
  cuisine: string;
  mealType: string[];
  difficulty: string;
  tags?: string[];
};

type RecipesResponseFromAPI = {
  recipes: Recipe[];
  total?: number;
  skip?: number;
  limit?: number;
};

const RecipesPage = () => {
  const [allFetchedRecipes, setAllFetchedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const params = useLocalSearchParams<{ cuisine?: string }>();

  const [availableCuisines, setAvailableCuisines] = useState<string[]>(['Todas']);
  const [availableMealTypes, setAvailableMealTypes] = useState<string[]>(['Todos']);
  const hardcodedDifficulties = useMemo(() => ['Todas', 'Easy', 'Medium', 'Hard'], []);

  const [tempSelectedCuisine, setTempSelectedCuisine] = useState<string | null>(params.cuisine || 'Todas');
  const [tempSelectedMealType, setTempSelectedMealType] = useState<string | null>('Todos');
  const [tempSelectedDifficulty, setTempSelectedDifficulty] = useState<string | null>('Todas');

  const [activeCuisine, setActiveCuisine] = useState<string | null>(params.cuisine || 'Todas');
  const [activeMealType, setActiveMealType] = useState<string | null>('Todos');
  const [activeDifficulty, setActiveDifficulty] = useState<string | null>('Todas');
  
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const pageTitle = activeCuisine && activeCuisine !== 'Todas'
    ? `Receitas: ${activeCuisine.charAt(0).toUpperCase() + activeCuisine.slice(1).replace('-', ' ')}`
    : "Receitas";

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const cuisineTagsRes = await axios.get<string[]>('https://dummyjson.com/recipes/tags');
        const uniqueCuisines = [...new Set([...(params.cuisine ? [params.cuisine] : []), ...cuisineTagsRes.data])];
        setAvailableCuisines(['Todas', ...uniqueCuisines.sort()]);
        
        const recipesForMealTypes = await axios.get<RecipesResponseFromAPI>('https://dummyjson.com/recipes?limit=50&select=mealType');
        const allMealTypesFromRecipes: string[] = [];
        recipesForMealTypes.data.recipes.forEach(recipe => {
          if (recipe.mealType) {
            recipe.mealType.forEach(mt => {
              const capitalizedMt = mt.charAt(0).toUpperCase() + mt.slice(1);
              if (!allMealTypesFromRecipes.includes(capitalizedMt)) {
                allMealTypesFromRecipes.push(capitalizedMt);
              }
            });
          }
        });
        setAvailableMealTypes(['Todos', ...allMealTypesFromRecipes.sort()]);

      } catch (error) {
        console.error("Falha ao buscar opções de filtro:", error);
        if (availableCuisines.length <= 1) setAvailableCuisines(['Todas', ...(params.cuisine ? [params.cuisine] : [])]);
        if (availableMealTypes.length <= 1) setAvailableMealTypes(['Todos']);
      }
    };
    fetchFilterOptions();
  }, [params.cuisine]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setAllFetchedRecipes([]);
      let url = "https://dummyjson.com/recipes?limit=100"; 
      
      if (activeCuisine && activeCuisine !== 'Todas') {
        url = `https://dummyjson.com/recipes/tag/${activeCuisine.toLowerCase().replace(' ', '-') }?limit=100`;
      }

      try {
        const response = await axios.get<RecipesResponseFromAPI>(url);
        setAllFetchedRecipes(response.data.recipes || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setAllFetchedRecipes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeCuisine]);

  const filteredRecipes = useMemo(() => {
    let recipesToFilter = [...allFetchedRecipes];

    if (activeMealType && activeMealType !== 'Todos') {
      recipesToFilter = recipesToFilter.filter(
        (recipe) => recipe.mealType && recipe.mealType.map(mt => mt.toLowerCase()).includes(activeMealType.toLowerCase())
      );
    }
    if (activeDifficulty && activeDifficulty !== 'Todas') {
      recipesToFilter = recipesToFilter.filter(
        (recipe) => recipe.difficulty.toLowerCase() === activeDifficulty.toLowerCase()
      );
    }

    if (search) {
      const searchTerm = search.toLowerCase();
      recipesToFilter = recipesToFilter.filter((recipe) => {
        const nameMatch = recipe.name.toLowerCase().includes(searchTerm);
        const ingredientsMatch =
          recipe.ingredients &&
          Array.isArray(recipe.ingredients) &&
          recipe.ingredients.some((ingredient) =>
            ingredient.toLowerCase().includes(searchTerm)
          );
        return nameMatch || ingredientsMatch;
      });
    }
    return recipesToFilter;
  }, [allFetchedRecipes, search, activeMealType, activeDifficulty]);

  const handleApplyFilters = () => {
    setActiveCuisine(tempSelectedCuisine);
    setActiveMealType(tempSelectedMealType);
    setActiveDifficulty(tempSelectedDifficulty);
    setIsFilterModalVisible(false);
  };

  const handleClearFilters = () => {
    const initialCuisine = params.cuisine || 'Todas';
    setTempSelectedCuisine(initialCuisine); 
    setTempSelectedMealType('Todos');
    setTempSelectedDifficulty('Todas');
    setActiveCuisine(initialCuisine);
    setActiveMealType('Todos');
    setActiveDifficulty('Todos');
    setIsFilterModalVisible(false);
  };
  
  const openFilterModal = () => {
    setTempSelectedCuisine(activeCuisine);
    setTempSelectedMealType(activeMealType);
    setTempSelectedDifficulty(activeDifficulty);
    setIsFilterModalVisible(true);
  };

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
        Nenhuma receita encontrada com estes critérios.
      </Text>
      {(search || (activeCuisine && activeCuisine !== 'Todas') || (activeMealType && activeMealType !== 'Todos') || (activeDifficulty && activeDifficulty !== 'Todas')) && 
        <Text style={styles.emptySubtitleText}>Tente buscar por outros termos ou ajustar os filtros.</Text>
      }
    </View>
  );
  
  const renderFilterOption = (item: string, selectedValue: string | null, setter: (value: string) => void, keyPrefix: string) => (
    <TouchableOpacity
      key={`${keyPrefix}-${item}`}
      style={[styles.filterOption, item === selectedValue && styles.filterOptionSelected]}
      onPress={() => setter(item)}
    >
      <Text style={[styles.filterOptionText, item === selectedValue && styles.filterOptionTextSelected]}>
        {item.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </Text>
    </TouchableOpacity>
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

      <View style={styles.searchFilterContainer}>
        <View style={styles.searchContainer}>
          <AntDesign name="search1" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            placeholder="Nome ou ingrediente..."
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#888"
          />
        </View>
        <TouchableOpacity onPress={openFilterModal} style={styles.filterAccessButton}>
            <Ionicons name="filter" size={22} color="#007BFF" />
            <Text style={styles.filterAccessButtonText}>Filtros</Text>
        </TouchableOpacity>
      </View>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={isFilterModalVisible}
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1} 
            onPressOut={() => setIsFilterModalVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalContent} onPress={() => {}}> 
            <Text style={styles.modalTitle}>Aplicar Filtros</Text>
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScrollContent}>
              <Text style={styles.filterGroupTitle}>Área Culinária / Tags</Text>
              <View style={styles.filterOptionsContainer}>
                {availableCuisines.map(cuisine => renderFilterOption(cuisine, tempSelectedCuisine, setTempSelectedCuisine, 'cuisine'))}
              </View>

              <Text style={styles.filterGroupTitle}>Tipo de Refeição</Text>
              <View style={styles.filterOptionsContainer}>
                {availableMealTypes.map(mealType => renderFilterOption(mealType, tempSelectedMealType, setTempSelectedMealType, 'mealType'))}
              </View>

              <Text style={styles.filterGroupTitle}>Dificuldade</Text>
              <View style={styles.filterOptionsContainer}>
                {hardcodedDifficulties.map(difficulty => renderFilterOption(difficulty, tempSelectedDifficulty, setTempSelectedDifficulty, 'difficulty'))}
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalButton, styles.clearButton]} onPress={handleClearFilters}>
                <Text style={styles.clearButtonText}>Limpar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.applyButton]} onPress={handleApplyFilters}>
                <Text style={styles.applyButtonText}>Aplicar</Text>
              </TouchableOpacity>
            </View>
             <TouchableOpacity style={styles.closeModalButton} onPress={() => setIsFilterModalVisible(false)}>
                <AntDesign name="closecircleo" size={28} color="#ccc" />
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

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
  searchFilterContainer: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 48,
    flex: 1,
    marginRight: 10,
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
  filterAccessButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#e6f0fa',
    borderRadius: 20,
  },
  filterAccessButtonText: {
    marginLeft: 6,
    color: '#007BFF',
    fontWeight: '600',
    fontSize: 15,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalScrollContent: {
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  filterGroupTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007BFF',
    marginTop: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  filterOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterOptionSelected: {
    backgroundColor: '#007BFF',
    borderColor: '#0056b3',
  },
  filterOptionText: {
    fontSize: 15,
    color: '#333',
  },
  filterOptionTextSelected: {
    color: '#fff',
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  applyButton: {
    backgroundColor: '#007BFF',
    marginLeft: 10,
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  clearButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  clearButtonText: {
    color: '#555',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeModalButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  }
});

export default RecipesPage;