import { useEffect, useState } from "react";
import { AppSettingsService } from "../services/AppSettingsService";

export function useAppSetting(key: string) {
  const [value, setValue] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AppSettingsService.get(key as any).then((res) => {
      setValue(res);
      setLoading(false);
    });
  }, [key]);

  const toggle = async (newValue: boolean) => {
    setValue(newValue);
    try {
      await AppSettingsService.toggle(newValue);

      const fresh = await AppSettingsService.get(key as any);
      setValue(fresh);
    } catch (e) {
      console.log("toggle error", e);
      setValue(!newValue); // rollback
    }
  };

  return { value, toggle, loading };
}