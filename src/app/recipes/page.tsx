import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
} from "react-native";
import { Link, useRouter } from "expo-router";
import axios from "axios";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";

type Recipe = {
  id: number;
  name: string;
  image: string;
};

type RecipesResponse = {
  recipes: Recipe[];
};

const RecipesPage = () => {
  const [data, setData] = useState<RecipesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://dummyjson.com/recipes");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  if (loading) {
    return <Text>Carregando...</Text>;
  }
  if (!data) {
    return <Text>Sem dados disponíveis</Text>;
  }
  const router = useRouter();

  const filteredRecipes = data.recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Receitas APP</Text>
      <TextInput
        placeholder="Pesquisar..."
        style={styles.input}
        value={search}
        onChangeText={setSearch}
      />
  
        <Entypo
          name="back"
          size={24}
          color="black"
          onPress={() => router.back()}
          style={styles.buttonBack}
        />

      <TouchableOpacity
        style={{
          marginBottom: 10,
          position: "absolute",
          top: 5,
          right: 10,
        }}
        onPress={() => router.push("/about/page")}
      >
        <AntDesign name="infocirlceo" size={24} color="black" />
      </TouchableOpacity>
      <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/recipes/${item.id}`)}
            style={styles.button}
          >
            <Text style={{ fontSize: 18 }}>{item.name}</Text>
            <Image source={{ uri: item.image }} style={styles.image} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = {
  button: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    backgroundColor: "#f9f9f9",
  },
  image: {
    width: 100,
    height: 100,
    marginLeft: 10,
    borderRadius: 8,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center" as const,
    fontWeight: "bold" as const,
    
  },
  buttonText: {
    color: "#222",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonBack: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    position: "absolute" as const,
    top: 0,
    left: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
  },
};

export default RecipesPage;
