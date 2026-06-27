import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { News } from "../screens/News/News";
import { NewsDetail } from "../screens/NewsDetail/NewsDetail";
import { withThemeUpdates } from "./withThemeUpdates";

export type NewsStackParamList = {
  News: undefined;
  NewsDetail: { id: string };
};

const Stack = createNativeStackNavigator<NewsStackParamList>();
const ThemedNews = withThemeUpdates(News);
const ThemedNewsDetail = withThemeUpdates(NewsDetail);

export const NewsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: "none",
    }}
  >
    <Stack.Screen name="News" component={ThemedNews} />
    <Stack.Screen name="NewsDetail" component={ThemedNewsDetail} />
  </Stack.Navigator>
);
