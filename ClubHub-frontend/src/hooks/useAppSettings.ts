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
    await AppSettingsService.toggle(key as any, newValue);
  };

  return { value, toggle, loading };
}