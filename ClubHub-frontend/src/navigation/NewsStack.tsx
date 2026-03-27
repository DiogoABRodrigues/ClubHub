import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { News } from "../screens/News/News";
import { NewsDetail } from "../screens/NewsDetail/NewsDetail";

export type NewsStackParamList = {
  News: undefined;
  NewsDetail: { id: string };
};

const Stack = createNativeStackNavigator<NewsStackParamList>();

export const NewsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: "none",
    }}
  >
    <Stack.Screen name="News" component={News} />
    <Stack.Screen name="NewsDetail" component={NewsDetail} />
  </Stack.Navigator>
);
