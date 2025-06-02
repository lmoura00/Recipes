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
  }, []);

  if (!data) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Entypo
          name="back"
          size={24}
          color="blue"
          onPress={() => router.back()}
          style={styles.buttonBack}
        />

        <Text style={styles.title}>{data.name}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={{ uri: data.image }} style={styles.image} />
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Informações</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <FontAwesome5 name="weight-hanging" size={16} color="black" />
            <Text>Calorias: {data.caloriesPerServing}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Ionicons name="timer" size={16} color="black" />
            <Text>Tempo de preparo: {data.prepTimeMinutes} min</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <MaterialCommunityIcons name="chef-hat" size={16} color="black" />
            <Text>Cozinha: {data.cuisine}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <MaterialCommunityIcons
              name="toaster-oven"
              size={16}
              color="black"
            />
            <Text>Tempo de cozimento: {data.cookTimeMinutes} min</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <MaterialCommunityIcons
              name="account-group"
              size={16}
              color="black"
            />
            <Text>Porções: {data.servings}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <FontAwesome5 name="utensils" size={16} color="black" />
            <Text>Tipo de comida: {data.mealType.join(", ")}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <FontAwesome5 name="dumbbell" size={16} color="black" />

            <Text>Dificuldade: {data.difficulty}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <FontAwesome5 name="hashtag" size={16} color="black" />

            <Text>Tags: {data.tags.join(", ")}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Ingredientes</Text>
          {data.ingredients.map((item, idx) => (
            <Text key={idx} style={styles.listItem}>
              • {item}
            </Text>
          ))}
        </View>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Instruções</Text>
          {data.instructions.map((item, idx) => (
            <Text key={idx} style={styles.listItem}>
              {idx + 1}. {item}
            </Text>
          ))}
        </View>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Avaliações</Text>
          <Text>Avaliação: {data.rating} ⭐</Text>
          <Text>Quantidade de avaliações: {data.reviewCount}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  scrollContent: {
    padding: 20,
    paddingTop: 80,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    alignSelf: "center",
    position: "absolute",
    top: 40,
    left: "20%",
    right: 0,
    color: "#333",
    width:"80%",
  
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    marginBottom: 20,
    marginTop: 60,
    resizeMode: "cover",
    backgroundColor: "#eee",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#007BFF",
  },
  listItem: {
    fontSize: 16,
    marginBottom: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonBack: {
    borderRadius: 5,
    width: "auto",
    alignSelf: "flex-start",
    paddingVertical: 10,
 
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: "#f0f0f0",
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: "auto",
    paddingBottom: 30,
  },
});

export default Home;
