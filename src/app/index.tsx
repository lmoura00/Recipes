import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { Link, useRouter } from "expo-router";
import LottieView from "lottie-react-native";

const Index = () => {
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  return (
    <View style={styles.container}>
      <LottieView
        autoPlay
        style={{
          width: "100%",
          height: 300,
          alignSelf: "center",
        }}
        source={require("../assets/recipes.json")}
      />
      <Text style={styles.title}>Receitas APP</Text>

      <Text style={styles.text}>Seja bem vindo(a) ao seu app de receitas</Text>
      <TouchableOpacity
        onPress={() => router.push("/recipes/page")}
        style={styles.buttonReceitas}
      >
        <LottieView
          autoPlay
          style={{
            width: "100%",
            height: 100,
            alignSelf: "center",
          }}
          source={require("../assets/panela.json")}
        />
        <Text style={{ fontSize: 18, marginTop: 10 }}>Ver as receitas...</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push("/about/page")}
        style={styles.buttonSobre}
      >
        <Text style={{ fontSize: 18, marginTop: 10 }}>Sobre o App</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  buttonReceitas: {
    padding: 10,
    width: "100%" as const,
    borderColor: "#ccc",
    flexDirection: "column" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    backgroundColor: "#f9f9f9",
  },
  buttonSobre: {
    padding: 10,
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
  text: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center" as const,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center" as const,
    fontWeight: "bold" as const,
  },
};

export default Index;
