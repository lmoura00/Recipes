import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from '@expo/vector-icons/AntDesign';
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
  const { id } = useLocalSearchParams();
  const [data, setData] = useState<RecipesResponse | null>(null);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://dummyjson.com/recipes/${id}`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id]);

  if (!data) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header com botão de voltar e título */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.buttonBack}>
          <Entypo name="chevron-left" size={28} color="#007BFF" />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={2}>{data.name}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={{ uri: data.image }} style={styles.image} />
        {/* Informações principais */}
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="timer-outline" size={20} color="#007BFF" />
            <Text style={styles.infoText}>{data.prepTimeMinutes + data.cookTimeMinutes} min</Text>
            <Text style={styles.infoLabel}>Total</Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="account-group" size={20} color="#007BFF" />
            <Text style={styles.infoText}>{data.servings}</Text>
            <Text style={styles.infoLabel}>Porções</Text>
          </View>
          <View style={styles.infoItem}>
            <FontAwesome5 name="star" size={20} color="#FFD700" />
            <Text style={styles.infoText}>{data.rating}</Text>
            <Text style={styles.infoLabel}>Avaliação</Text>
          </View>
        </View>
        {/* Card de informações */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Detalhes</Text>
          <View style={styles.detailRow}>
            <FontAwesome5 name="weight-hanging" size={16} color="#007BFF" />
            <Text style={styles.detailText}>Calorias: {data.caloriesPerServing}</Text>
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
            <Text style={styles.detailText}>Tipo: {data.mealType.join(", ")}</Text>
          </View>
          <View style={styles.detailRow}>
            <FontAwesome5 name="hashtag" size={16} color="#007BFF" />
            <Text style={styles.detailText}>Tags: {data.tags.join(", ")}</Text>
          </View>
        </View>
        {/* Ingredientes */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Ingredientes</Text>
          {data.ingredients.map((item, idx) => (
            <View key={idx} style={styles.ingredientRow}>
              <View style={styles.bullet} />
              <Text style={styles.listItem}>{item}</Text>
            </View>
          ))}
        </View>
        {/* Instruções */}
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
        {/* Avaliações */}
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
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 40,
    color: "#007BFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    elevation: 2,
    zIndex: 10,
  },
  buttonBack: {
    marginRight: 10,
    padding: 6,
    borderRadius: 20,
    backgroundColor: "#e6f0fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
    flex: 1,
    textAlign: "center",
    marginRight: 40,
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
  infoText: {
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
