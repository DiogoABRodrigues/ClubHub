import { HelperService } from "../services/HelperService";
import { useQuery } from "@tanstack/react-query";

const useHelper = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["helper", "categories"],
    queryFn: HelperService.getAllCategoriesAvailable,
  });
  return { categories: data, isLoading, isError };
};

export default useHelper;
