import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";

import { Box, HStack, VStack, Spacer } from "native-base";
import React, {
  useState,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { CheckBox } from "react-native-elements";
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

import Icon from "react-native-vector-icons/AntDesign";
const OrderSummary = (props) => {
  const { orderId } = props.route.params;
  const [orderDetails, setOrderDetails] = useState("");
  const [totalItemsProductsPrice, setTotalItemsProductsPrice] = useState(0);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    axios
      .get(`${baseURL}order/${orderId}`)
      .then((res) => {
        setOrderDetails(res.data.order);
        console.log(res.data.order);
      })
      .catch((error) => {
        console.error("Error refreshing order details:", error);
      })
      .finally(() => {
        setRefreshing(false);
      });
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${baseURL}order/${orderId}`);
          console.log("Order Details", response.data.order);
          setOrderDetails(response.data.order);
        } catch (error) {
          console.log(error);
        }
      };

      fetchData();

      return () => {
        console.log("Data Cleared");
      };
    }, [])
  );

  useEffect(() => {
    if (orderDetails) {
      //console.log(orderDetails.containerStatus);
      //console.log(orderDetails.orderStatus);
      //console.log(orderDetails);
      //console.log(itemsPrice);
      const itemsTotalPrice = (orderDetails.orderItems || []).reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      const productsTotalPrice = (orderDetails.orderProducts || []).reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      setTotalItemsProductsPrice(itemsTotalPrice + productsTotalPrice);
    }
  }, [orderDetails]);

  console.log(orderId);

  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const latestOrderStatus = orderDetails.orderStatus
    ? orderDetails.orderStatus.sort(
        (a, b) => new Date(b.datedAt) - new Date(a.datedAt)
      )[0]
    : null;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
          <Text style={styles.otitle}>Order Details</Text>
          {latestOrderStatus &&
            latestOrderStatus.orderLevel === "Out for Delivery" && (
              <Button
                title="View Maps"
                filled
                style={{
                  marginTop: 30,
                  width: 100, // Adjust width as needed
                  height: 50,
                }}
                onPress={() =>
                  navigation.navigate("OutDeliveries2", { orderId: orderId })
                }
              />
            )}
        </View>
        <View style={styles.hr}></View>
        <FlatList
          data={[
            "Delivery Address",
            "Order Status",
            "Store",
            "Order Summary",
            `Container Status`,
            `Order Claiming Method`,
            `Payment Method`,
            `Subtotal: `,
            "Delivery Fee",
            "Order Total",
          ]}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <>
                <View style={styles.card}>
                  <Text style={styles.title}>{item}</Text>

                  {index === 0 &&
                    orderDetails &&
                    orderDetails.customer &&
                    orderDetails.deliveryAddress && (
                      <>
                        <View style={{ flexDirection: "row" }}>
                          <Text style={styles.label}>Name:</Text>
                          <Text style={styles.addressdetails}>
                            {orderDetails.customer.fname}{" "}
                            {orderDetails.customer.lname}
                          </Text>
                        </View>
                        <View style={{ flexDirection: "row", width: "80%" }}>
                          <Text style={styles.label}>Address:</Text>
                          <Text style={styles.addressdetails}>
                            {orderDetails.deliveryAddress.houseNo},{" "}
                            {orderDetails.deliveryAddress.purokNum},{" "}
                            {orderDetails.deliveryAddress.streetName},{" "}
                            {orderDetails.deliveryAddress.barangay},{" "}
                            {orderDetails.deliveryAddress.city}
                          </Text>
                        </View>
                        <View style={styles.hr}></View>
                      </>
                    )}
                  {index === 1 && orderDetails && orderDetails.orderStatus && (
                    <>
                      {orderDetails.orderStatus
                        .sort(
                          (a, b) => new Date(b.datedAt) - new Date(a.datedAt)
                        )
                        .map((item, index) => (
                          <View key={index} style={styles.classContent}>
                            <View style={styles.timelineContainer}>
                              <View style={[styles.timelineDot]} />
                              <View style={styles.timelineLine} />
                            </View>

                            <View style={styles.classContent}>
                              <View style={styles.classHours}>
                                <Text style={styles.startTime}>
                                  {new Date(item.datedAt).toLocaleDateString()}
                                </Text>
                                <Text style={styles.endTime}>
                                  {new Date(item.datedAt).toLocaleTimeString()}
                                </Text>
                              </View>

                              <View style={[styles.cardstatus]}>
                                <Text style={styles.cardTitle}>
                                  {item.orderLevel}
                                </Text>
                                {item.staff && (
                                  <Text style={styles.cardDate}>
                                    Staff: {item.staff.fname} {item.staff.lname}
                                  </Text>
                                )}
                              </View>
                            </View>
                          </View>
                        ))}
                      <View style={styles.hr}></View>
                    </>
                  )}

                  {index === 2 &&
                    orderDetails &&
                    orderDetails.selectedStore && (
                      <>
                        <Text style={styles.addressdetails}>
                          {orderDetails.selectedStore.branchNo}
                          {"\n"}
                          {orderDetails.selectedStore.address}
                        </Text>
                        <View style={styles.hr}></View>
                      </>
                    )}

                  {index === 3 && orderDetails && (
                    <>
                      {orderDetails.orderItems.map((item, index) => (
                        <View key={index}>
                          <Box pl="4" pr="5" py="5">
                            <HStack alignItems="center" space={3}>
                              <VStack>
                                <Text
                                  color="coolGray.800"
                                  _dark={{
                                    color: "warmGray.50",
                                  }}
                                  bold>
                                  {item.type} (REFILL)
                                </Text>
                                <Text fontSize="sm" color="coolGray.500">
                                  Quantity: {item.quantity}
                                </Text>
                              </VStack>
                              <Spacer />
                              <Text
                                fontSize="xs"
                                color="coolGray.800"
                                _dark={{
                                  color: "warmGray.50",
                                }}
                                alignSelf="flex-start">
                                ₱ {item.price}
                              </Text>
                            </HStack>
                          </Box>
                        </View>
                      ))}
                      {orderDetails.orderProducts.map((item, index) => (
                        <View key={index}>
                          <Box pl="4" pr="5" py="5">
                            <HStack alignItems="center" space={3}>
                              <VStack>
                                <Text
                                  color="coolGray.800"
                                  _dark={{
                                    color: "warmGray.50",
                                  }}
                                  bold>
                                  {item.type.typeofGallon} (NEW CONTAINER)
                                </Text>
                                <Text fontSize="sm" color="coolGray.500">
                                  Quantity: {item.quantity}
                                </Text>
                              </VStack>
                              <Spacer />
                              <Text
                                fontSize="xs"
                                color="coolGray.800"
                                _dark={{
                                  color: "warmGray.50",
                                }}
                                alignSelf="flex-start">
                                ₱ {item.price}
                              </Text>
                            </HStack>
                          </Box>
                        </View>
                      ))}
                      <View style={styles.hr}></View>
                    </>
                  )}

                  {index === 4 && (
                    <>
                      <Text
                        style={[
                          styles.addressdetails,
                          { textAlign: "right", paddingRight: 20 },
                        ]}>
                        {orderDetails.containerStatus}
                      </Text>
                      <View style={styles.hr}></View>
                    </>
                  )}
                  {index === 5 && (
                    <>
                      <Text
                        style={[
                          styles.addressdetails,
                          { textAlign: "right", paddingRight: 20 },
                        ]}>
                        {orderDetails.orderclaimingOption}
                      </Text>
                      <View style={styles.hr}></View>
                    </>
                  )}
                  {index === 6 && (
                    <>
                      <Text
                        style={[
                          styles.addressdetails,
                          { textAlign: "right", paddingRight: 20 },
                        ]}>
                        {orderDetails.paymentInfo}
                      </Text>
                      <View style={styles.hr}></View>
                    </>
                  )}
                  {index === 7 && orderDetails && (
                    <>
                      <Text
                        style={[
                          styles.addressdetails,
                          { textAlign: "right", paddingRight: 20 },
                        ]}>
                        ₱{totalItemsProductsPrice}
                      </Text>

                      <View style={styles.hr}></View>
                    </>
                  )}

                  {index === 8 &&
                    orderDetails &&
                    orderDetails.selectedStore && (
                      <>
                        <Text
                          style={[
                            styles.addressdetails,
                            { textAlign: "right", paddingRight: 20 },
                          ]}>
                          ₱{orderDetails.selectedStore.deliveryFee}
                        </Text>

                        <View style={styles.hr}></View>
                      </>
                    )}

                  {index === 9 && orderDetails && (
                    <>
                      <Text
                        style={[
                          styles.addressdetails,
                          {
                            textAlign: "right",
                            paddingRight: 20,
                            color: "#00bbff",
                            fontSize: 25,
                          },
                        ]}>
                        ₱{orderDetails.totalPrice}
                      </Text>

                      <View style={styles.hr}></View>
                    </>
                  )}
                </View>
              </>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent background
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    elevation: 5, // for Android shadow
    // You can add additional styling here
  },
  otitle: {
    textAlign: "left",
    marginTop: 50,
    marginLeft: 20,
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  hr: {
    borderBottomColor: "lightgray",
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  title: {
    textAlign: "left",

    marginLeft: 20,
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",

    letterSpacing: 1,
  },
  label: {
    fontWeight: "bold",
    marginTop: 10,
    marginLeft: 18,
    fontSize: 16,
  },
  addressdetails: {
    fontSize: 16,
    marginTop: 10,
    marginLeft: 18,
  },

  statusContainer: {
    marginTop: 10,
    marginLeft: 18,
  },
  separator: {
    height: 1,
    backgroundColor: "gray",
    marginVertical: 5,
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
  // buttonContainer: {
  //   margin: 20,
  //   alignSelf: "center",
  //   flexDirection: "row",
  // },

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
  classItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  timelineContainer: {
    width: 30,
    alignItems: "center",
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#00bbff",
    marginBottom: 8,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: "#00bbff",
  },
  classContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  classHours: {
    marginRight: 8,
    alignItems: "flex-end",
  },
  startTime: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  endTime: {
    fontSize: 16,
  },
  cardTitle: {
    fontSize: 16,
    color: "black",
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 12,
    color: "black",
    marginBottom: 8,
  },
  cardstatus: {
    flex: 1,
    backgroundColor: "#c1e7f5",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 10,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10, // Adjust as needed
    marginBottom: 10, // Adjust as needed
    paddingHorizontal: 10, // Adjust as needed
    backgroundColor: "#00bbff",
  },
});
export default OrderSummary;
