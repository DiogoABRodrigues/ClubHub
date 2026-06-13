import { api } from "./api";
import { CategoryConfig } from "../models/Category";

export const HelperService = {
  getAllCategoriesAvailable: async (): Promise<CategoryConfig[]> => {
    const { data } = await api.get("/helper/categories");
    return data;
  },
};
