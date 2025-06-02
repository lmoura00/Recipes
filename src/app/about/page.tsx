import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const About = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sobre o App</Text>
      <Text style={styles.text}>Receitas APP</Text>
      <Text style={styles.text}>Versão: 1.0</Text>
      <Text style={styles.text}>
        Desenvolvido por:{" "}
        <Text style={{ fontWeight: "bold" }}>Lucas de Moura</Text>
      </Text>
      <Text style={styles.text1}>
        Este aplicativo foi criado para demonstrar o uso do Expo Router e React
        Native.
      </Text>
      <Text style={styles.text1}>
        Ele permite que os usuários visualizem receitas, detalhes e informações
        adicionais.
      </Text>
      <TouchableOpacity onPress={() => router.back()} style={styles.buttonBack}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  text1: {
    fontSize: 18,
    textAlign: "justify",
    paddingHorizontal: 20,
    color: "#555",
    lineHeight: 24,
    textAlignVertical: "center",
    fontStyle: "italic",
    fontWeight: "300",
    letterSpacing: 0.5,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  buttonBack: {
    backgroundColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    position: "absolute",
    top: 40,
    left: 20,
  },
  buttonText: {
    color: "#222",
    fontSize: 16,
    fontWeight: "bold",
  },
});
export default About;
