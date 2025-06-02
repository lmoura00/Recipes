import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import LottieView from "lottie-react-native";

const About = () => {
  const router = useRouter();

  const openLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log(`Don't know how to open this URL: ${url}`);
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
        <Text style={styles.headerTitle}>Sobre o App</Text>
        <View style={styles.headerIconPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <LottieView
          autoPlay
          loop
          style={styles.heroLottie}
          source={require("../../assets/coding.json")}
        />
        <Text style={styles.appName}>Receitas APP</Text>
        <Text style={styles.appVersion}>Versão 1.0</Text>

        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            Desenvolvido por:{" "}
            <Text style={styles.developerName}>Lucas de Moura</Text>
          </Text>
        </View>

        <View style={styles.descriptionSection}>
          <Text style={styles.descriptionParagraph}>
            Este aplicativo foi criado para demonstrar o uso do Expo Router e
            React Native.
          </Text>
          <Text style={styles.descriptionParagraph}>
            Ele permite que os usuários visualizem receitas, detalhes e
            informações adicionais.
          </Text>
        </View>

        <View style={styles.socialLinksSection}>
          <Text style={styles.socialLinksTitle}>Conecte-se</Text>
          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity
              style={[styles.socialButton, styles.linkedinButton]}
              onPress={() =>
                openLink("https://www.linkedin.com/in/lucas-moura-610579194/")
              }
            >
              <FontAwesome name="linkedin-square" size={22} color="#fff" />
              <Text style={styles.socialButtonText}>LinkedIn</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialButton, styles.instagramButton]}
              onPress={() =>
                openLink("https://www.instagram.com/lucas.m.galvao_/")
              }
            >
              <FontAwesome name="instagram" size={22} color="#fff" />
              <Text style={styles.socialButtonText}>Instagram</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialButton, styles.whatsappButton]}
              onPress={() =>
                openLink("https://wa.me/+5586981019840")
              }
            >
              <FontAwesome name="whatsapp" size={22} color="#fff" />
              <Text style={styles.socialButtonText}>WhatsApp</Text>
            </TouchableOpacity>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? ((StatusBar.currentHeight ?? 0)) : 50,
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
  scrollContentContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 40,
  },
  heroLottie: {
    width: "90%",
    maxWidth: 280,
    height: 230,
    marginBottom: 20,
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 5,
    textAlign: "center",
  },
  appVersion: {
    fontSize: 16,
    color: "#7f8c8d",
    marginBottom: 25,
    textAlign: "center",
  },
  infoSection: {
    marginBottom: 20,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 17,
    color: "#34495e",
    textAlign: "center",
    lineHeight: 24,
  },
  developerName: {
    fontWeight: "bold",
    color: "#007BFF",
  },
  descriptionSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  descriptionParagraph: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 12,
    maxWidth: 600,
  },
  socialLinksSection: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  socialLinksTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  socialButtonsContainer: {
    width: '100%',
    maxWidth: 380,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  socialButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  linkedinButton: {
    backgroundColor: '#0077B5',
  },
  instagramButton: {
    backgroundColor: '#E1306C',
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
});

export default About;