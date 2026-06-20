import { publicApi } from "./api";
import { CategoryConfig } from "../models/Category";

export const HelperService = {
  getAllCategoriesAvailable: async (): Promise<CategoryConfig[]> => {
    const { data } = await publicApi.get("/helper/categories");
    return data;
  },
};
