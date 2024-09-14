import { View, Text } from "react-native";
import React, { useContext } from "react";

import { createStackNavigator } from "@react-navigation/stack";

import OrderList from "../Screens/order/OrderList";
import OrderSummary from "../Screens/order/OrderSummary";
import OutDeliveries2 from "../Screens/order/OutDeliveries2";
const Stack = createStackNavigator();

const OrderStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        mode: "card",
        headerShown: false,
      }}>
      <Stack.Screen
        name="OrderList"
        component={OrderList}
        option={{
          headerTransparent: true,
        }}
      />

      <Stack.Screen
        name="OrderSummary"
        component={OrderSummary}
        option={{
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="OutDeliveries2"
        component={OutDeliveries2}
        option={{
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default OrderStack;
