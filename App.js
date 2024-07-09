import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "./screens/HomeScreen";
import UserScreen from "./screens/UserScreen";
import BookingsScreen from "./screens/BookingsScreen";
import GlobalContextProvider from "./context/global-context";
import MessagingStackNavigator from './components/MessagingStackNavigator';
import { navigationRef } from './utils/NavigatationRef'

const BottomTab = createBottomTabNavigator();

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <GlobalContextProvider>
        <NavigationContainer ref={navigationRef}>
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
              name="Bookings"
              component={BookingsScreen}
              options={{
                title: "Bookings",
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="book" color={color} size={size} />
                ),
              }}
            />
            <BottomTab.Screen
              name="Messaging"
              component={MessagingStackNavigator}
              options={{
                title: "Messages",
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <Ionicons
                    name="chatbox-ellipses-outline"
                    color={color} size={size}
                  />
                ),
              }}
            />
            <BottomTab.Screen
              name="User"
              component={UserScreen}
              options={{
                title: "User",
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