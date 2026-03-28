import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AdminNews } from "../screens/Admin/AdminNews/AdminNews";
import { AdminNewsForm } from "../screens/Admin/AdminNews/AdminNewsForm";

export type AdminNewsStackParamList = {
  AdminNews: undefined;
  AdminNewsForm: { id: number };
};

const Stack = createNativeStackNavigator<AdminNewsStackParamList>();

export const AdminNewsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: "none",
    }}
  >
    <Stack.Screen name="AdminNews" component={AdminNews} />
    <Stack.Screen name="AdminNewsForm" component={AdminNewsForm} />
  </Stack.Navigator>
);
