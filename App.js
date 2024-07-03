import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "./screens/HomeScreen";
import UserScreen from "./screens/UserScreen";

import GlobalContextProvider from "./context/global-context";

const BottomTab = createBottomTabNavigator();

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <GlobalContextProvider>
        <NavigationContainer>
          <BottomTab.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: "#3e04c3" },
              headerTintColor: "white",
              headerTitleAlign: "center", // for Android - iOS is fixed at centre
              //tabBarStyle: { backgroundColor: "#3e04c3" },
              tabBarActiveTintColor: "#3e04c3",
            }}
          >
            <BottomTab.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: "Home",
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="home" color={color} size={size} />
                ),
              }}
            />
            <BottomTab.Screen
              name="User"
              component={UserScreen}
              options={{
                title: "Sign in/out",
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="person" color={color} size={size} />
                ),
              }}
            />
          </BottomTab.Navigator>
        </NavigationContainer>
      </GlobalContextProvider>
    </>
  );
}
