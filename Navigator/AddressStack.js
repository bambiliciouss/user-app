import { View, Text } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();

import Address from "../Screens/address/Address";
import RegisterNewAddress from "../Screens/address/RegisterNewAddress";
import EditAddress from "../Screens/address/EditAddress";

const AddressStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        mode: "card",
        headerShown: false,
      }}>
      <Stack.Screen
        name="Address"
        component={Address}
        option={{
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="NewAddress"
        component={RegisterNewAddress}
        option={{
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="EditAddress"
        component={EditAddress}
        option={{
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
};
export default AddressStack;
