import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "../screens/Home/Home";
import { MatchDetail } from "../screens/MatchDetails/MatchDetail";
import { NewsDetail } from "../screens/NewsDetail/NewsDetail";

export type HomeStackParamList = {
  Home: undefined;
  MatchDetail: { id: string };
  NewsDetail: { id: string };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: "none",
    }}
  >
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="MatchDetail" component={MatchDetail} />
    <Stack.Screen name="NewsDetail" component={NewsDetail} />
  </Stack.Navigator>
);
