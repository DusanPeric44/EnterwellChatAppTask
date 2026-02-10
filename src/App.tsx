import { createStaticNavigation } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootStack from "./navigation/RootStack";
import { ThemeProvider } from "./presentation/theme/ThemeContext";

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Navigation />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
