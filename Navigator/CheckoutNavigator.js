import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Checkout from "../Screens/cart/checkout/Checkout";
import ContainerStatus from "../Screens/cart/checkout/ContainerStatus";
import OrderClaimingMethod from "../Screens/cart/checkout/OrderClaimingMethod";
import Payment from "../Screens/cart/checkout/Payment";
import Confirm from "../Screens/cart/checkout/Confirm";

import Store from "../Screens/cart/checkout/Store";
import GallonOrder from "../Screens/cart/checkout/GallonOrder";


const Tab = createMaterialTopTabNavigator();

const CheckoutNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Store" component={Store} />
      <Tab.Screen name="Gallon Order" component={GallonOrder} />
      {/* <Tab.Screen name="Order Summary" component={OrderSummary} /> */}
      {/* <Tab.Screen name="Container Status" component={ContainerStatus} /> */}
      {/* <Tab.Screen name="Order Claim" component={OrderClaimingMethod} /> */}

      {/* <Tab.Screen name="Payment" component={Payment} /> */}
      {/* <Tab.Screen name="Confirm" component={Confirm} /> */}
    </Tab.Navigator>
  );
};

export default CheckoutNavigator;
