import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "../screens/Home/Home";
import { MatchDetail } from "../screens/MatchDetails/MatchDetail";
import { AdminMatchDetail } from "../screens/Admin/AdminMatches/AdminMatchDetail";
import { NewsDetail } from "../screens/NewsDetail/NewsDetail";
import { withThemeUpdates } from "./withThemeUpdates";

export type HomeStackParamList = {
  Home: undefined;
  MatchDetail: { id: number };
  AdminMatchDetail: { id: number };
  NewsDetail: { id: string };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();
const ThemedHome = withThemeUpdates(Home);
const ThemedAdminMatchDetail = withThemeUpdates(AdminMatchDetail);
const ThemedMatchDetail = withThemeUpdates(MatchDetail);
const ThemedNewsDetail = withThemeUpdates(NewsDetail);

export const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: "none",
    }}
  >
    <Stack.Screen name="Home" component={ThemedHome} />
    <Stack.Screen name="AdminMatchDetail" component={ThemedAdminMatchDetail} />
    <Stack.Screen name="MatchDetail" component={ThemedMatchDetail} />
    <Stack.Screen name="NewsDetail" component={ThemedNewsDetail} />
  </Stack.Navigator>
);
