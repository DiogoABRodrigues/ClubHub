import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppSettingsService } from "../services/AppSettingsService";

export function useAppSetting(key: string) {
  const [value, setValue] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        // Sem token não faz o request, evita o 401
        setLoading(false);
        return;
      }

      try {
        const res = await AppSettingsService.get(key as any);
        setValue(res);
      } catch {
        // silencia o erro, valor fica false por defeito
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [key]);

  const toggle = async (newValue: boolean) => {
    setValue(newValue);
    try {
      await AppSettingsService.toggle(newValue);
      const fresh = await AppSettingsService.get(key as any);
      setValue(fresh);
    } catch {
      setValue(!newValue); // rollback
    }
  };

  return { value, toggle, loading };
}