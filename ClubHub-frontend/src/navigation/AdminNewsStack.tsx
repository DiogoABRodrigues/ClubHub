import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AdminNews } from "../screens/Admin/AdminNews/AdminNews";
import { AdminNewsForm } from "../screens/Admin/AdminNews/AdminNewsForm";
import { withThemeUpdates } from "./withThemeUpdates";

export type AdminNewsStackParamList = {
  AdminNews: undefined;
  AdminNewsForm: { id: number };
};

const Stack = createNativeStackNavigator<AdminNewsStackParamList>();
const ThemedAdminNews = withThemeUpdates(AdminNews);
const ThemedAdminNewsForm = withThemeUpdates(AdminNewsForm);

export const AdminNewsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: "none",
    }}
  >
    <Stack.Screen name="AdminNews" component={ThemedAdminNews} />
    <Stack.Screen name="AdminNewsForm" component={ThemedAdminNewsForm} />
  </Stack.Navigator>
);
