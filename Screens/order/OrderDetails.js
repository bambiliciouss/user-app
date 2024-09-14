import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Dimensions,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
} from "react-native";

import {
  Container,
  Box,
  HStack,
  Avatar,
  VStack,
  Spacer,
  Divider,
  Center,
  Heading,
  Radio,
  CheckCircleIcon,
} from "native-base";
import { SwipeListView } from "react-native-swipe-list-view";
import React, { useState, useCallback, useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

var { height, width } = Dimensions.get("window");
import { Badge } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../../assets/common/baseurl";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/AntDesign";

const OrderDetails = (item, index) => {
  //console.log("These are the items", item);
  const navigation = useNavigation();
  const latestOrderStatus =
    item.item.orderStatus[item.item.orderStatus.length - 1];

  let statusBadgeColor = "";
  switch (latestOrderStatus.orderLevel) {
    case "Order Placed":
      statusBadgeColor = "secondary";
      break;
    case "Order Accepted":
      statusBadgeColor = "primary";
      break;
    case "Container for pick up":
    case "Container has been picked up":
    case "Container is at the Store":
      statusBadgeColor = "primary";
      break;
    case "Out for Delivery":
      statusBadgeColor = "error";
      break;
    case "Delivered":
      statusBadgeColor = "success";
      break;
      case "Completed":
        statusBadgeColor = "success";
        break;
    case "Rejected":
      statusBadgeColor = "error";
      break;
    default:
      statusBadgeColor = "light";
      break;
  }

  return (
    <View style={styles.card}>
      <View style={styles.cardBody}>
        <Text style={styles.address}>
          <Badge
            value={latestOrderStatus.orderLevel}
            status={statusBadgeColor}
            containerStyle={styles.badgeContainer}
            textStyle={styles.badgeText}
           //badgeStyle={styles.badgeStyle}
          />
        </Text>
        {/* <View style={{ flexDirection: "row", width: "80%" }}>
          <Text style={[styles.address, { fontWeight: "bold" }]}>Name: </Text>
          <Text style={styles.address}>
            {item.item.customer.fname} {item.item.customer.lname}
          </Text>
        </View> */}
        <View style={{ flexDirection: "row", width: "80%" }}>
          <Text style={[styles.address, { fontWeight: "bold" }]}>
            Address:{" "}
          </Text>
          <Text style={styles.address}>
            {item.item.deliveryAddress.houseNo},{" "}
            {item.item.deliveryAddress.purokNum},{" "}
            {item.item.deliveryAddress.streetName},{" "}
            {item.item.deliveryAddress.barangay},{" "}
            {item.item.deliveryAddress.city}
          </Text>
        </View>
        {/* <Text style={styles.address}>
          No. of Items :{" "}
          {item.item.orderItems.length + item.item.orderProducts.length} pc(s){" "}
        </Text> */}
        <View style={{ flexDirection: "row", width: "80%" }}>
          <Text style={[styles.address, { fontWeight: "bold" }]}>
            Total Amount:{" "}
          </Text>
          <Text style={styles.address}>₱{item.item.totalPrice}.00</Text>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("OrderSummary", { orderId: item.item._id });
            }}>
            <View style={[styles.button]}>
              <Text style={styles.buttonText}>View Order Details</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardBody: {
    marginBottom: 10,
    padding: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  address: {
    fontSize: 16,
    marginBottom: 5,
  },
  container: {
    flexDirection: "row",
    padding: 5,
    width: width,
    marginBottom: 5,
  },
  image: {
    borderRadius: 10,
    width: width / 3,
    aspectRatio: 1,
    margin: 7,
  },
  item: {
    flexWrap: "wrap",
    marginVertical: 3,
    width: width / 3,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },

  textStyle: {
    color: "white",
    fontWeight: "bold",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: "#00bbff", // Filled button color
  },
  defaultButton: {
    backgroundColor: "#00bbff", // Filled button color
  },
  nonDefaultButton: {
    borderColor: "#00bbff", // Outline button border color
    borderWidth: 1,
  },
  buttonText: {
    color: "#000000", // Filled button text color
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  editButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginLeft: 10,
  },
  deleteButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginLeft: 5,
    // backgroundColor: "#56a3bf",
  },
  badgeContainer: {
    marginLeft: 10,
  },
  badgeText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  badgeStyle: {
    paddingVertical: 10, // Add vertical padding to increase badge height
    paddingHorizontal: 20, // Add horizontal padding to increase badge width
  },
  
});
export default OrderDetails;
