import HomeScreen from "../presentation/screens/HomeScreen";
import ChatScreen from "../presentation/screens/ChatScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const RootStack = createNativeStackNavigator({
    screens: {
        Home: HomeScreen,
        Chat: ChatScreen,
    },
    screenOptions: {
        headerShown: false
    }
});

export default RootStack;