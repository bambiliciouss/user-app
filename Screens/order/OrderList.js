import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { useState, useCallback, useContext, useEffect } from "react";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import baseURL from "../../assets/common/baseurl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OrderDetails from "./OrderDetails";
var { height, width } = Dimensions.get("window");

import AuthGlobal from "../../Context/store/AuthGlobal";
import Button from "../../Components/Button";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";

const OrderList = () => {
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const context = useContext(AuthGlobal);

  // const sortOrdersByLatestStatus = (orders) => {
  //   return orders.sort((a, b) => {
  //     const latestStatusA = a.orderStatus[a.orderStatus.length - 1]?.datedAt;
  //     const latestStatusB = b.orderStatus[b.orderStatus.length - 1]?.datedAt;
  //     return new Date(latestStatusB) - new Date(latestStatusA);
  //   });
  // };

  const sortOrdersByCreatedAt = (orders) => {
    return orders.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };


  const onRefresh = useCallback(() => {
    setRefreshing(true);
    axios
      .get(`${baseURL}orders/me`)
      .then((res) => {
        const sortedOrders = sortOrdersByCreatedAt(res.data.orders);
        setOrderList(sortedOrders);
        //setOrderList(res.data.orders);
      })
      .catch((error) => {
        console.error("Error refreshing order list:", error);
      })
      .finally(() => {
        setRefreshing(false);
      });
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!context.stateUser.isAuthenticated) {
        navigation.navigate("User", { screen: "Login" });
      } else {
        AsyncStorage.getItem("jwt")
          .then((res) => {
            axios
              .get(`${baseURL}orders/me`, {
                headers: { Authorization: `Bearer ${res}` },
              })
              .then((response) => {
                  const sortedOrders = sortOrdersByCreatedAt(
                    response.data.orders
                  );
                  setOrderList(sortedOrders);
                //setOrderList(response.data.orders);
                //console.log("NOT FORMATTED",response.data.orders.createdAt );

                //LATEST TO OLDEST 
                // const orders = response.data.orders;
                // orders.forEach((order) => {
                //   console.log(order.createdAt);
                // });

                const orderStatuses = response.data.orders.map(order => order.orderStatus);
console.log("Order Statuses", orderStatuses);
                setLoading(false);
              })
              .catch((error) => console.log("Axios Error:", error));
          })
          .catch((error) => console.log("AsyncStorage Error:", error));
        return () => {
          setOrderList([]);
          setLoading(true);
        };
      }
    }, [context.stateUser.isAuthenticated])
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
          <Text style={styles.title}>Order List</Text>
        </View>
        <FlatList
          contentContainerStyle={styles.propertyListContainer}
          data={orderList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item, index }) => {
            return <OrderDetails item={item} index={index} />;
          }}
          keyExtractor={(item) => item._id}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: "left",
    marginTop: 50,
    marginLeft: 20,
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  propertyListContainer: {
    paddingHorizontal: 20,
  },
  listHeader: {
    flexDirection: "row",
    padding: 5,
    backgroundColor: "lightblue",
    width: width,
    marginBottom: 5,
  },
  headerItem: {
    flex: 1,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  spinner: {
    height: height / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    marginBottom: 160,
    backgroundColor: "white",
  },
  buttonContainer: {
    margin: 20,
    alignSelf: "center",
    flexDirection: "row",
  },

  container1: {
    flex: 1,
  },
  buttonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
});

export default OrderList;
