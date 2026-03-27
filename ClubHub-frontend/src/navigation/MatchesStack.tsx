import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Matches } from "../screens/Matches/Matches";
import { MatchDetail } from "../screens/MatchDetails/MatchDetail";

export type MatchesStackParamList = {
  Matches: undefined; // ecrã principal da lista
  MatchDetail: { id: string }; // detalhe do jogo
};

const Stack = createNativeStackNavigator<MatchesStackParamList>();

export const MatchesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, animation: "none" }}>
    <Stack.Screen name="Matches" component={Matches} />
    <Stack.Screen name="MatchDetail" component={MatchDetail} />
  </Stack.Navigator>
);
