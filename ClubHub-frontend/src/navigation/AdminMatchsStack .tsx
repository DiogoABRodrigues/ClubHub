import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AdminMatchDetail } from "../screens/Admin/AdminMatches/AdminMatchDetail";
import { Matches } from "../screens/Matches/Matches";

export type AdminMatchesStackParamList = {
  AdminMatches: undefined;
  AdminMatchDetail: { id: string };
};

const Stack = createNativeStackNavigator<AdminMatchesStackParamList>();

export const AdminMatchesStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: "none",
    }}
  >
    <Stack.Screen name="AdminMatches" component={Matches} />
    <Stack.Screen name="AdminMatchDetail" component={AdminMatchDetail} />
  </Stack.Navigator>
);
