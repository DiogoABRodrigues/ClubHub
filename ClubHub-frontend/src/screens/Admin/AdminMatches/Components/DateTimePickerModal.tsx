import React, { useEffect, useMemo, useState } from "react";
import { Alert, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

interface Props {
  visible: boolean;
  initialDate: string;
  initialTime: string;
  onClose: () => void;
  onSave: (date: string, time: string) => Promise<void>;
}

/** "YYYY-MM-DD" → Date */
const parseDateStr = (dateStr: string): Date => {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date();
  date.setFullYear(y, m - 1, d);
  date.setHours(0, 0, 0, 0);
  return isNaN(date.getTime()) ? new Date() : date;
};

/** "HH:MM" → aplica a hora num Date existente */
const applyTimeStr = (base: Date, timeStr: string): Date => {
  const [h, m] = timeStr.split(":").map(Number);
  const date = new Date(base);
  date.setHours(h ?? 0, m ?? 0, 0, 0);
  return date;
};

/** Date → "YYYY-MM-DD" */
const formatToDateStr = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

/** Date → "HH:MM" */
const formatToTimeStr = (date: Date): string => {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
};

export const DateTimePickerModal = ({
  visible,
  initialDate,
  initialTime,
  onClose,
  onSave,
}: Props) => {
  const [phase, setPhase] = useState<"date" | "time">("date");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    if (visible) {
      setPhase("date");
      const base = parseDateStr(initialDate);
      setSelectedDate(applyTimeStr(base, initialTime));
    }
  }, [visible, initialDate, initialTime]);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const handleChange = async (event: any, date?: Date) => {
    if (event.type === "dismissed") {
      onClose();
      return;
    }
    if (!date) {
      onClose();
      return;
    }

    if (phase === "date") {
      const merged = new Date(date);
      merged.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0);
      setSelectedDate(merged);
      setPhase("time");
    } else {
      const merged = new Date(selectedDate);
      merged.setHours(date.getHours(), date.getMinutes(), 0, 0);
      try {
        await onSave(formatToDateStr(merged), formatToTimeStr(merged));
      } catch {
        Alert.alert("Erro", "Não foi possível guardar a data/hora.");
      } finally {
        onClose();
      }
    }
  };

  if (!visible) return null;

  return (
    <DateTimePicker
      value={selectedDate}
      mode={phase}
      minimumDate={phase === "date" ? today : undefined}
      display="default"
      onChange={handleChange}
    />
  );
};
