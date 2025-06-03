import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const Index = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={Platform.OS === "ios" ? "dark-content" : "dark-content"}
        backgroundColor="#f8fafc"
      />
      <View style={styles.contentContainer}>
        <View style={styles.heroSection}>
          <LottieView
            autoPlay
            loop
            style={styles.heroLottie}
            source={require("../assets/recipes.json")}
          />
          <Text style={styles.title}>Receitas APP</Text>
          <Text style={styles.subtitle}>
            Seja bem-vindo(a) ao seu app de receitas!
          </Text>
        </View>

        <View style={styles.actionsSection}>
          <TouchableOpacity
            onPress={() => router.push("/recipes/page")}
            style={styles.primaryButton}
          >
            <LottieView
              autoPlay
              loop={true}
              style={styles.buttonLottie}
              source={require("../assets/panela.json")}
            />
            <Text style={styles.primaryButtonText}>Explorar Receitas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/favorites/page')}
            style={styles.favoritesButton}
          >
            <Ionicons name="heart" size={22} color="#fff" />
            <Text style={styles.favoritesButtonText}>Meus Favoritos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/about/page")}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>Sobre o App</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) : 0,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  heroSection: {
    alignItems: "center",
    width: "100%",
  },
  heroLottie: {
    width: "90%",
    maxWidth: 300,
    height: 250,
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 17,
    color: "#7f8c8d",
    textAlign: "center",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  actionsSection: {
    width: "100%",
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    width: "95%",
    maxWidth: 400,
    marginBottom: 16,
    flexDirection: "column",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonLottie: {
    width: 70,
    height: 70,
    marginBottom: 8,
  },
  primaryButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
  favoritesButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    width: "95%",
    maxWidth: 400,
    marginBottom: 16,
    flexDirection: "row",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  favoritesButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
    marginLeft: 10,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#007BFF",
    alignItems: "center",
    justifyContent: "center",
    width: "95%",
    maxWidth: 400,
  },
  secondaryButtonText: {
    fontSize: 16,
    color: "#007BFF",
    fontWeight: "600",
  },
});

export default Index;