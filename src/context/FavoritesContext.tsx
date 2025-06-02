import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_STORAGE_KEY = "@MeuAppReceitas:Favoritos";

interface FavoritesContextType {
  favoriteRecipeIds: number[];
  addFavorite: (id: number) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  loadingFavorites: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favoriteRecipeIds, setFavoriteRecipeIds] = useState<number[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);

  useEffect(() => {
    const loadFavoritesFromStorage = async () => {
      try {
        setLoadingFavorites(true);
        const storedFavorites = await AsyncStorage.getItem(
          FAVORITES_STORAGE_KEY
        );
        if (storedFavorites !== null) {
          setFavoriteRecipeIds(JSON.parse(storedFavorites));
        }
      } catch (e) {
        console.error("Falha ao carregar favoritos do AsyncStorage", e);
      } finally {
        setLoadingFavorites(false);
      }
    };
    loadFavoritesFromStorage();
  }, []);

  const saveFavoritesToStorage = async (ids: number[]) => {
    try {
      await AsyncStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(ids)
      );
    } catch (e) {
      console.error("Falha ao salvar favoritos no AsyncStorage", e);
    }
  };

  const addFavorite = (id: number) => {
    setFavoriteRecipeIds((prevIds) => {
      if (prevIds.includes(id)) return prevIds; // Já é favorito
      const newIds = [...prevIds, id];
      saveFavoritesToStorage(newIds);
      return newIds;
    });
  };

  const removeFavorite = (id: number) => {
    setFavoriteRecipeIds((prevIds) => {
      const newIds = prevIds.filter((favId) => favId !== id);
      saveFavoritesToStorage(newIds);
      return newIds;
    });
  };

  const isFavorite = (id: number) => {
    return favoriteRecipeIds.includes(id);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favoriteRecipeIds,
        addFavorite,
        removeFavorite,
        isFavorite,
        loadingFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites deve ser usado dentro de um FavoritesProvider");
  }
  return context;
};