import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MessageScreen from '../screens/MessageScreen';
import ConversationScreen from '../screens/ConversationScreen';

const Stack = createStackNavigator();

function MessagingStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="MessageScreen">
      <Stack.Screen
        name="MessageScreen"
        component={MessageScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ConversationScreen"
        component={ConversationScreen}
        options={({ route }) => ({
          title: `${route.params.first_name} ${route.params.last_name}`,
          headerBackTitle: 'Messages',
        })}
      />
    </Stack.Navigator>
  );
}

export default MessagingStackNavigator;