import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

const parseDate = (d: string) => {
  if (!d) return new Date();

  const parts = d.split("-").map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return new Date();

  const [y, m, day] = parts;
  return new Date(y, m - 1, day);
};

const applyTime = (date: Date, time: string) => {
  if (!time) return new Date(date);

  const parts = time.split(":").map(Number);

  const h = parts[0] ?? 0;
  const m = parts[1] ?? 0;

  const d = new Date(date);
  d.setHours(h, m);

  return d;
};

const formatTime = (date: Date) => {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
};

const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export const DateTimePickerModal = ({
  visible,
  initialDate,
  initialTime,
  onClose,
  onSave,
}: any) => {
  const [phase, setPhase] = useState<"date" | "time">("date");
  const [value, setValue] = useState(new Date());

  useEffect(() => {
    if (!visible) return;

    setPhase("date");
    setValue(applyTime(parseDate(initialDate), initialTime));
  }, [visible, initialDate, initialTime]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleChange = async (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === "dismissed" || !date) {
      onClose();
      return;
    }

    if (phase === "date") {
      const merged = new Date(date);
      merged.setHours(value.getHours(), value.getMinutes());
      setValue(merged);
      setPhase("time");
      return;
    }

    try {
      const final = new Date(value);
      final.setHours(date.getHours(), date.getMinutes());

      await onSave(formatDate(final), formatTime(final));
    } catch {
      Alert.alert("Erro", "Falha ao guardar data");
    } finally {
      onClose();
    }
  };

  if (!visible) return null;

  return (
    <DateTimePicker
      value={value}
      mode={phase}
      minimumDate={phase === "date" ? today : undefined}
      onChange={handleChange}
    />
  );
};
