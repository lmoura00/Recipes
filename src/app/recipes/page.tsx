import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import { translate } from "../../utils/translations";
import { translateWithGoogleAPI } from "../../utils/googleTranslate";

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
  total: number;
  skip: number;
  limit: number;
};

const PAGE_LIMIT = 20;

const COLORS = {
  primaryBackground: "#20C997",
  textPrimary: "#FFFFFF",
  textSecondary: "#E0E0E0",
  accentOrange: "#FF8C00",
  white: "#FFFFFF",
  darkGrey: "#333",
  mediumGrey: "#555",
  lightGrey: "#888",
  veryLightGrey: "#f0f0f0",
  superLightGrey: "#f8fafc",
  errorRed: "#D32F2F",
  borderColor: "#ddd",
  lightBlue: "#e6f0fa"
};

const RecipesPage = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const router = useRouter();
  const params = useLocalSearchParams<{ cuisine?: string }>();

  const [apiError, setApiError] = useState<string | null>(null);
  const [filterOptionsError, setFilterOptionsError] = useState<string | null>(null);

  const [skipNum, setSkipNum] = useState(0);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [hasMoreToLoad, setHasMoreToLoad] = useState(true);

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
    ? `Receitas: ${translate(activeCuisine).charAt(0).toUpperCase() + translate(activeCuisine).slice(1).replace('-', ' ')}`
    : "Receitas";

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(search);
      setRecipes([]); 
      setSkipNum(0);
      setHasMoreToLoad(true);
    }, 500); 

    return () => {
      clearTimeout(handler);
    };
  }, [search]);
  
  useEffect(() => {
    const fetchFilterOptions = async () => {
      setFilterOptionsError(null);
      try {
        const cuisineTagsRes = await axios.get<string[]>('https://dummyjson.com/recipes/tags');
        const uniqueCuisines = [...new Set([...(params.cuisine ? [params.cuisine] : []), ...cuisineTagsRes.data])];
        setAvailableCuisines(['Todas', ...uniqueCuisines.sort()]);
        
        const recipesForMealTypes = await axios.get<RecipesResponseFromAPI>('https://dummyjson.com/recipes?limit=100&select=mealType,difficulty');
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
        setFilterOptionsError("Não foi possível carregar opções de filtro.");
        if (availableCuisines.length <= 1) setAvailableCuisines(['Todas', ...(params.cuisine ? [params.cuisine] : [])]);
        if (availableMealTypes.length <= 1) setAvailableMealTypes(['Todos']);
      }
    };
    fetchFilterOptions();
  }, [params.cuisine]);

  const fetchData = useCallback(async (isInitialLoad = false) => {
    if (!isInitialLoad && loadingMore) return;
    if (isInitialLoad) {
      setLoading(true);
      setSkipNum(0);
      setRecipes([]);
      setHasMoreToLoad(true);
    } else {
      setLoadingMore(true);
    }
    setApiError(null);
    
    let currentSkip = isInitialLoad ? 0 : skipNum;
    let url = "";

    if (debouncedSearchTerm) {
      url = `https://dummyjson.com/recipes/search?q=${encodeURIComponent(debouncedSearchTerm)}&limit=${PAGE_LIMIT}&skip=${currentSkip}`;
    } else if (activeCuisine && activeCuisine !== 'Todas') {
      url = `https://dummyjson.com/recipes/tag/${activeCuisine.toLowerCase().replace(' ', '-') }?limit=${PAGE_LIMIT}&skip=${currentSkip}`;
    } else {
      url = `https://dummyjson.com/recipes?limit=${PAGE_LIMIT}&skip=${currentSkip}`;
    }

    try {
      const response = await axios.get<RecipesResponseFromAPI>(url);
      let fetchedRecipes = response.data.recipes || [];

      if (fetchedRecipes.length > 0 && !debouncedSearchTerm) {
        const namesToTranslate = fetchedRecipes.map(r => r.name);
        const translatedNames = await translateWithGoogleAPI(namesToTranslate, 'pt') as string[];

        if (translatedNames.length === namesToTranslate.length) {
            fetchedRecipes = fetchedRecipes.map((recipe, index) => ({
                ...recipe,
                name: translatedNames[index] || recipe.name,
            }));
        }
      }
      
      setRecipes(prev => isInitialLoad ? fetchedRecipes : [...prev, ...fetchedRecipes]);
      setTotalRecipes(response.data.total || 0);
      setSkipNum(currentSkip + fetchedRecipes.length);
      if (fetchedRecipes.length === 0 || (isInitialLoad ? fetchedRecipes.length : recipes.length + fetchedRecipes.length) >= (response.data.total || 0) ) {
        setHasMoreToLoad(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setApiError("Não foi possível carregar as receitas. Verifique sua conexão.");
      setHasMoreToLoad(false);
    } finally {
      if (isInitialLoad) setLoading(false);
      setLoadingMore(false);
    }
  }, [activeCuisine, debouncedSearchTerm, skipNum, loadingMore, recipes.length]);


  useEffect(() => {
    fetchData(true);
  }, [activeCuisine, debouncedSearchTerm]);


  const clientSideFilteredRecipes = useMemo(() => {
    let recipesToFilter = [...recipes];

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
    return recipesToFilter;
  }, [recipes, activeMealType, activeDifficulty]);

  const handleApplyFilters = () => {
    if (activeCuisine !== tempSelectedCuisine) {
        setActiveCuisine(tempSelectedCuisine); 
    }
    setActiveMealType(tempSelectedMealType);
    setActiveDifficulty(tempSelectedDifficulty);
    setIsFilterModalVisible(false);
  };

  const handleClearFilters = () => {
    const initialCuisine = params.cuisine || 'Todas';
    setTempSelectedCuisine(initialCuisine); 
    setTempSelectedMealType('Todos');
    setTempSelectedDifficulty('Todas');
    
    if (activeCuisine !== initialCuisine) {
        setActiveCuisine(initialCuisine);
    }
    setActiveMealType('Todos');
    setActiveDifficulty('Todos');
    setSearch(""); 
    setIsFilterModalVisible(false);
  };
  
  const openFilterModal = () => {
    setTempSelectedCuisine(activeCuisine);
    setTempSelectedMealType(activeMealType);
    setTempSelectedDifficulty(activeDifficulty);
    setIsFilterModalVisible(true);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMoreToLoad) {
       fetchData(false);
    }
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

  const renderListFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.listFooter}>
        <ActivityIndicator size="small" color={COLORS.accentOrange} />
      </View>
    );
  };

  const renderEmptyOrError = () => {
    if (apiError) {
        return (
            <View style={styles.centeredMessageContainer}>
                <Ionicons name="cloud-offline-outline" size={60} color={COLORS.mediumGrey} style={{marginBottom: 15}} />
                <Text style={styles.errorText}>{apiError}</Text>
                <TouchableOpacity onPress={() => fetchData(true)} style={styles.retryButton}>
                    <Text style={styles.retryButtonText}>Tentar Novamente</Text>
                </TouchableOpacity>
            </View>
        );
    }
    if (!loading && clientSideFilteredRecipes.length === 0) {
      return (
        <View style={styles.centeredMessageContainer}>
          <Text style={styles.emptyText}>
            Nenhuma receita encontrada com estes critérios.
          </Text>
          {(search || (activeCuisine && activeCuisine !== 'Todas') || (activeMealType && activeMealType !== 'Todos') || (activeDifficulty && activeDifficulty !== 'Todas')) && 
            <Text style={styles.emptySubtitleText}>Tente buscar por outros termos ou ajustar os filtros.</Text>
          }
        </View>
      );
    }
    return null;
  }
  
  const renderFilterOption = (item: string, selectedValue: string | null, setter: (value: string) => void, keyPrefix: string) => {
    const displayValue = item === 'Todas' || item === 'Todos' 
        ? item 
        : translate(item); 

    return (
        <TouchableOpacity
        key={`${keyPrefix}-${item}`}
        style={[styles.filterOption, item === selectedValue && styles.filterOptionSelected]}
        onPress={() => setter(item)}
        >
        <Text style={[styles.filterOptionText, item === selectedValue && styles.filterOptionTextSelected]}>
            {displayValue.charAt(0).toUpperCase() + displayValue.slice(1).replace('-', ' ')}
        </Text>
        </TouchableOpacity>
    );
  };


  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryBackground} />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.canGoBack() ? router.back() : router.push('/')}
          style={styles.headerIconButton}
        >
          <Entypo name="chevron-left" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{pageTitle}</Text>
        <TouchableOpacity
          onPress={() => router.push("/about/page")}
          style={styles.headerIconButton}
        >
          <AntDesign name="infocirlceo" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchFilterContainer}>
        <View style={styles.searchContainer}>
          <AntDesign name="search1" size={20} color={COLORS.lightGrey} style={styles.searchIcon} />
          <TextInput
            placeholder="Buscar receitas..."
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholderTextColor={COLORS.lightGrey}
          />
        </View>
        <TouchableOpacity onPress={openFilterModal} style={styles.filterAccessButton}>
            <Ionicons name="filter" size={22} color={COLORS.accentOrange} />
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

      {loading && recipes.length === 0 ? (
        <View style={styles.centeredMessageContainer}>
          <ActivityIndicator size="large" color={COLORS.accentOrange} />
          <Text style={styles.loadingText}>Carregando Receitas...</Text>
        </View>
      ) : (
        <FlatList
          data={clientSideFilteredRecipes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderRecipeItem}
          contentContainerStyle={styles.listContentContainer}
          ListEmptyComponent={renderEmptyOrError}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderListFooter}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) + 10 : 50,
    paddingBottom: 12,
    paddingHorizontal: 10,
    backgroundColor: COLORS.primaryBackground,
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
    color: COLORS.textPrimary,
    marginHorizontal: 5,
  },
  searchFilterContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.veryLightGrey,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.veryLightGrey,
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
    color: COLORS.darkGrey,
    height: "100%",
  },
  filterAccessButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.accentOrange,
  },
  filterAccessButtonText: {
    marginLeft: 6,
    color: COLORS.accentOrange,
    fontWeight: '600',
    fontSize: 15,
  },
  centeredMessageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: COLORS.superLightGrey,
  },
  loadingText: {
    fontSize: 18,
    color: COLORS.accentOrange,
    marginTop: 15,
    fontWeight: "500",
  },
  errorText: {
    fontSize: 17,
    color: COLORS.errorRed,
    textAlign: 'center',
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: COLORS.accentOrange,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    elevation: 2,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.darkGrey,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 8,
  },
  emptySubtitleText: {
    fontSize: 14,
    color: COLORS.mediumGrey,
    textAlign: "center",
  },
  listContentContainer: {
    paddingTop: 10,
    paddingBottom: 20,
    flexGrow: 1,
    backgroundColor: COLORS.superLightGrey,
  },
  listFooter: {
    paddingVertical: 20,
    alignItems: 'center',
    backgroundColor: COLORS.superLightGrey,
  },
  recipeItem: {
    backgroundColor: COLORS.white,
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
    backgroundColor: COLORS.textSecondary,
  },
  recipeTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  recipeName: {
    fontSize: 17,
    fontWeight: "600",
    color: COLORS.darkGrey,
    marginBottom: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
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
    color: COLORS.darkGrey,
    marginBottom: 20,
    textAlign: 'center',
  },
  filterGroupTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primaryBackground,
    marginTop: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.veryLightGrey,
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
    backgroundColor: COLORS.veryLightGrey,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  filterOptionSelected: {
    backgroundColor: COLORS.accentOrange,
    borderColor: COLORS.accentOrange,
  },
  filterOptionText: {
    fontSize: 15,
    color: COLORS.darkGrey,
  },
  filterOptionTextSelected: {
    color: COLORS.white,
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.veryLightGrey,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  applyButton: {
    backgroundColor: COLORS.accentOrange,
    marginLeft: 10,
  },
  applyButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  clearButton: {
    backgroundColor: COLORS.veryLightGrey,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  clearButtonText: {
    color: COLORS.mediumGrey,
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