import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useFavorites } from "../../context/FavoritesContext";

interface RecipesResponse {
  id: number;
  name: string;
  caloriesPerServing: number;
  cookTimeMinutes: number;
  cuisine: string;
  difficulty: string;
  image: string;
  ingredients: string[];
  instructions: string[];
  mealType: string[];
  prepTimeMinutes: number;
  rating: number;
  reviewCount: number;
  servings: number;
  tags: string[];
  userId: number;
}

const Home = () => {
  const { id: recipeIdParam } = useLocalSearchParams<{ id: string }>();
  const recipeId = Number(recipeIdParam);

  const [data, setData] = useState<RecipesResponse | null>(null);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();
  const { addFavorite, removeFavorite, isFavorite, loadingFavorites } = useFavorites();

  const fetchData = async () => {
    if (!recipeId) {
      setIsLoadingPage(false);
      setApiError("ID da receita inválido.");
      return;
    }
    setIsLoadingPage(true);
    setApiError(null);
    try {
      const response = await axios.get(
        `https://dummyjson.com/recipes/${recipeId}`
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData(null);
      setApiError("Não foi possível carregar os detalhes da receita. Verifique sua conexão e tente novamente.");
    } finally {
      setIsLoadingPage(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [recipeId]);

  if (isLoadingPage || loadingFavorites) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (apiError && !data) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="cloud-offline-outline" size={60} color="#777" style={{marginBottom: 15}} />
        <Text style={styles.errorText}>{apiError}</Text>
        <TouchableOpacity onPress={fetchData} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backButtonError, {marginTop: 10}]}>
            <Text style={styles.backButtonErrorText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Receita não encontrada.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButtonError}>
            <Text style={styles.backButtonErrorText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentRecipeIsFavorite = isFavorite(data.id);

  const toggleFavorite = () => {
    if (currentRecipeIsFavorite) {
      removeFavorite(data.id);
    } else {
      addFavorite(data.id);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerIconButton}
        >
          <Entypo name="chevron-left" size={28} color="#007BFF" />
        </TouchableOpacity>
        <Text style={styles.headerMainTitle} numberOfLines={2}>
          {data.name}
        </Text>
        <TouchableOpacity
          onPress={toggleFavorite}
          style={styles.headerIconButton}
        >
          <Ionicons
            name={currentRecipeIsFavorite ? "heart" : "heart-outline"}
            size={28}
            color={currentRecipeIsFavorite ? "#FF453A" : "#007BFF"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={{ uri: data.image }} style={styles.image} />

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="timer-outline" size={20} color="#007BFF" />
            <Text style={styles.infoValueText}>
              {data.prepTimeMinutes + data.cookTimeMinutes} min
            </Text>
            <Text style={styles.infoLabel}>Total</Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons
              name="account-group"
              size={20}
              color="#007BFF"
            />
            <Text style={styles.infoValueText}>{data.servings}</Text>
            <Text style={styles.infoLabel}>Porções</Text>
          </View>
          <View style={styles.infoItem}>
            <FontAwesome5 name="star" size={20} color="#FFD700" />
            <Text style={styles.infoValueText}>{data.rating}</Text>
            <Text style={styles.infoLabel}>Avaliação</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Detalhes</Text>
          <View style={styles.detailRow}>
            <FontAwesome5 name="weight-hanging" size={16} color="#007BFF" />
            <Text style={styles.detailText}>
              Calorias: {data.caloriesPerServing}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="chef-hat" size={16} color="#007BFF" />
            <Text style={styles.detailText}>Cozinha: {data.cuisine}</Text>
          </View>
          <View style={styles.detailRow}>
            <FontAwesome5 name="dumbbell" size={16} color="#007BFF" />
            <Text style={styles.detailText}>Dificuldade: {data.difficulty}</Text>
          </View>
          <View style={styles.detailRow}>
            <FontAwesome5 name="utensils" size={16} color="#007BFF" />
            <Text style={styles.detailText}>
              Tipo: {data.mealType.join(", ")}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <FontAwesome5 name="hashtag" size={16} color="#007BFF" />
            <Text style={styles.detailText}>Tags: {data.tags.join(", ")}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Ingredientes</Text>
          {data.ingredients.map((item, idx) => (
            <View key={idx} style={styles.ingredientRow}>
              <View style={styles.bullet} />
              <Text style={styles.listItem}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Instruções</Text>
          {data.instructions.map((item, idx) => (
            <View key={idx} style={styles.instructionRow}>
              <View style={styles.stepCircle}>
                <Text style={styles.stepNumber}>{idx + 1}</Text>
              </View>
              <Text style={styles.listItem}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Avaliações</Text>
          <View style={styles.detailRow}>
            <FontAwesome5 name="star" size={16} color="#FFD700" />
            <Text style={styles.detailText}>Nota: {data.rating} / 5</Text>
          </View>
          <View style={styles.detailRow}>
            <AntDesign name="user" size={16} color="#007BFF" />
            <Text style={styles.detailText}>Total: {data.reviewCount}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#f8fafc",
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 10,
    color: "#007BFF",
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
    color: "#D32F2F",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    elevation: 2,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButtonError: {
    borderColor: "#777",
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  backButtonErrorText: {
    color: "#555",
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) + 10 : 50,
    paddingBottom: 12,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    elevation: 2,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  headerIconButton: {
    padding: 6,
    borderRadius: 20,
  },
  headerMainTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginHorizontal: 5,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    marginBottom: 20,
    backgroundColor: "#eee",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 1,
  },
  infoItem: {
    alignItems: "center",
    flex: 1,
  },
  infoValueText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007BFF",
    marginTop: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#007BFF",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  detailText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 8,
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#007BFF",
    marginRight: 10,
  },
  instructionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#007BFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    marginTop: 2,
  },
  stepNumber: {
    color: "#fff",
    fontWeight: "bold",
  },
  listItem: {
    fontSize: 16,
    color: "#444",
    flex: 1,
    flexWrap: "wrap",
  },
});

export default Home;