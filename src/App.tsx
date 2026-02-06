import { createStaticNavigation } from "@react-navigation/native";
import { StatusBar, useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootStack from "./navigation/RootStack";

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <Navigation />
    </SafeAreaProvider>
  );
}
