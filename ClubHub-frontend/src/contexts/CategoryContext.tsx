import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Category = "over19" | "sub19" | "sub17" | "sub15" | "sub13";

export const CATEGORY_LABELS: Record<Category, string> = {
  over19: "Seniores",
  sub19: "Sub-19",
  sub17: "Sub-17",
  sub15: "Sub-15",
  sub13: "Sub-13",
};

const STORAGE_KEY = "selectedCategory";

interface CategoryContextValue {
  selectedCategory: Category;
  setSelectedCategory: (c: Category) => Promise<void>;
  /** true enquanto a troca de categoria ainda não terminou de carregar */
  isCategoryChanging: boolean;
  /** Chamado por quem sabe que os dados já estão prontos */
  acknowledgeCategoryChange: () => void;
}

const CategoryContext = createContext<CategoryContextValue>({
  selectedCategory: "over19",
  setSelectedCategory: async () => {},
  isCategoryChanging: false,
  acknowledgeCategoryChange: () => {},
});

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [selectedCategory, setSelectedCategoryState] =
    useState<Category>("over19");
  const [isCategoryChanging, setIsCategoryChanging] = useState(false);
  const minTimeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingHide = useRef(false);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored) setSelectedCategoryState(stored as Category);
      isFirstLoad.current = false;
    });
  }, []);

  const setSelectedCategory = async (category: Category) => {
    if (category === selectedCategory) return;

    // Activa overlay com tempo mínimo de 350ms (evita flash se os dados vierem do cache)
    pendingHide.current = false;
    setIsCategoryChanging(true);

    minTimeRef.current = setTimeout(() => {
      minTimeRef.current = null;
      if (pendingHide.current) {
        setIsCategoryChanging(false);
        pendingHide.current = false;
      }
    }, 350);

    setSelectedCategoryState(category);
    await AsyncStorage.setItem(STORAGE_KEY, category);
  };

  const acknowledgeCategoryChange = () => {
    if (!isCategoryChanging) return;
    if (minTimeRef.current) {
      // Ainda no tempo mínimo - agenda o hide para quando ele acabar
      pendingHide.current = true;
    } else {
      setIsCategoryChanging(false);
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        selectedCategory,
        setSelectedCategory,
        isCategoryChanging,
        acknowledgeCategoryChange,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategory() {
  return useContext(CategoryContext);
}
