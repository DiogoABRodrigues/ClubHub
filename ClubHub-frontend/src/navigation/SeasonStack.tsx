import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MatchDetail } from "../screens/MatchDetails/MatchDetail";
import { AdminMatchDetail } from "../screens/Admin/AdminMatches/AdminMatchDetail";
import { SeasonScreen } from "../screens/Season/SeasonScreen";
import { withThemeUpdates } from "./withThemeUpdates";

export type SeasonStackParamList = {
  SeasonScreen: undefined;
  MatchDetail: { id: number };
  AdminMatchDetail: { id: number };
};

const Stack = createNativeStackNavigator<SeasonStackParamList>();
const ThemedSeasonScreen = withThemeUpdates(SeasonScreen);
const ThemedMatchDetail = withThemeUpdates(MatchDetail);
const ThemedAdminMatchDetail = withThemeUpdates(AdminMatchDetail);

export const SeasonStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: "none",
    }}
  >
    <Stack.Screen name="SeasonScreen" component={ThemedSeasonScreen} />
    <Stack.Screen name="MatchDetail" component={ThemedMatchDetail} />
    <Stack.Screen name="AdminMatchDetail" component={ThemedAdminMatchDetail} />
  </Stack.Navigator>
);
