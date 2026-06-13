import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Matches } from "../screens/Matches/Matches";
import { MatchDetail } from "../screens/MatchDetails/MatchDetail";
import { AdminMatchDetail } from "../screens/Admin/AdminMatches/AdminMatchDetail";

export type MatchesStackParamList = {
  Matches: undefined;
  MatchDetail: { id: string };
  AdminMatchDetail: { id: string };
};

const Stack = createNativeStackNavigator<MatchesStackParamList>();

export const MatchesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, animation: "none" }}>
    <Stack.Screen name="Matches" component={Matches} />
    <Stack.Screen name="MatchDetail" component={MatchDetail} />
    <Stack.Screen name="AdminMatchDetail" component={AdminMatchDetail} />
  </Stack.Navigator>
);
