import { useEffect, useState } from "react";
import { AppSettingsService } from "../services/AppSettingsService";
import { useAuth } from "../contexts/AuthContext";

export function useAppSetting(key: string) {
  const { isAdmin, loading: authLoading } = useAuth();
  const [value, setValue] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    AppSettingsService.get(key as any)
      .then((result) => {
        if (active) setValue(result);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [key, isAdmin, authLoading]);

  const toggle = async (newValue: boolean) => {
    const previous = value;
    setValue(newValue);
    try {
      setValue(await AppSettingsService.toggle(newValue));
    } catch {
      setValue(previous);
    }
  };

  return { value, toggle, loading };
}
