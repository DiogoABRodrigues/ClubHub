import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
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
}

const CategoryContext = createContext<CategoryContextValue>({
  selectedCategory: "over19",
  setSelectedCategory: async () => {},
});

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [selectedCategory, setSelectedCategoryState] = useState<Category>("over19");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored) setSelectedCategoryState(stored as Category);
    });
  }, []);

  const setSelectedCategory = async (category: Category) => {
    setSelectedCategoryState(category);
    await AsyncStorage.setItem(STORAGE_KEY, category);
  };

  return (
    <CategoryContext.Provider value={{ selectedCategory, setSelectedCategory }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategory() {
  return useContext(CategoryContext);
}