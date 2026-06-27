import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Matches } from "../screens/Matches/Matches";
import { MatchDetail } from "../screens/MatchDetails/MatchDetail";
import { AdminMatchDetail } from "../screens/Admin/AdminMatches/AdminMatchDetail";
import { withThemeUpdates } from "./withThemeUpdates";

export type MatchesStackParamList = {
  Matches: undefined;
  MatchDetail: { id: string };
  AdminMatchDetail: { id: string };
};

const Stack = createNativeStackNavigator<MatchesStackParamList>();
const ThemedMatches = withThemeUpdates(Matches);
const ThemedMatchDetail = withThemeUpdates(MatchDetail);
const ThemedAdminMatchDetail = withThemeUpdates(AdminMatchDetail);

export const MatchesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, animation: "none" }}>
    <Stack.Screen name="Matches" component={ThemedMatches} />
    <Stack.Screen name="MatchDetail" component={ThemedMatchDetail} />
    <Stack.Screen name="AdminMatchDetail" component={ThemedAdminMatchDetail} />
  </Stack.Navigator>
);
