import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MatchDetail } from "../screens/MatchDetails/MatchDetail";
import { AdminMatchDetail } from "../screens/Admin/AdminMatches/AdminMatchDetail";
import { SeasonScreen } from "../screens/Season/SeasonScreen";

export type SeasonStackParamList = {
  SeasonScreen: undefined;
  MatchDetail: { id: number };
  AdminMatchDetail: { id: number };
};

const Stack = createNativeStackNavigator<SeasonStackParamList>();

export const SeasonStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: "none",
    }}
  >
    <Stack.Screen name="SeasonScreen" component={SeasonScreen} />
    <Stack.Screen name="MatchDetail" component={MatchDetail} />
    <Stack.Screen name="AdminMatchDetail" component={AdminMatchDetail} />
  </Stack.Navigator>
);
