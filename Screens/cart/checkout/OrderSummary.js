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
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import baseURL from "../../../assets/common/baseurl";
import AsyncStorage from "@react-native-async-storage/async-storage";

var { height, width } = Dimensions.get("window");

import AuthGlobal from "../../../Context/store/AuthGlobal";
import Button from "../../../Components/Button";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import * as actions from "../../../Redux/Actions/cartActions";
import Icon from "react-native-vector-icons/Entypo";

const methods = [
  { name: "Walk In", value: "Walk In" },
  { name: "Pick Up", value: "Pick Up" },
];

const methods2 = [
  { name: "Walk In", value: "Walk In" },
  { name: "Delivery", value: "Delivery" },
];
const OrderSummary = (props) => {
  //console.log("Route params SUMMARY:", props.route.params);
  const storeData = props.route.params ? props.route.params.storeData : null;
  console.log("SUMMARY:", storeData);
  const [token, setToken] = useState();

  const cartItems = useSelector((state) => state.cartItems);
  const cartProduct = useSelector((state) => state.cartProduct);
  dispatch = useDispatch();

  const context = useContext(AuthGlobal);
  const navigation = useNavigation();
  const [addressResult, setAddressList] = useState();
  const [loading, setLoading] = useState(true);

  const [selectedContainerStatus, setselectedContainerStatus] = useState("");
  const [selectedClaimMethod, setselectedClaimMethod] = useState("");

  useFocusEffect(
    useCallback(() => {
      if (!context.stateUser.isAuthenticated) {
        navigation.navigate("User", { screen: "Login" });
      } else {
        console.log(context.stateUser.user);
        AsyncStorage.getItem("jwt")
          .then((res) => {
            axios
              .get(`${baseURL}me/addresses`, {
                headers: { Authorization: `Bearer ${res}` },
              })
              .then((response) => {
                // Filter the address list to find the default address
                const defaultAddress = response.data.addresses.find(
                  (address) => address.isDefault
                );
                if (defaultAddress) {
                  setAddressList([defaultAddress]); // Set the default address as the new address list
                  console.log("Address result", defaultAddress);
                } else {
                  setAddressList([]); // If no default address found, set empty list
                }
                setLoading(false);
              })
              .catch((error) => console.log("Axios Error:", error)); // Log any Axios errors
          })
          .catch((error) => console.log("AsyncStorage Error:", error)); // Log any AsyncStorage errors
        return () => {
          setAddressList([]);
          setLoading(true);
        };
      }
    }, [context.stateUser.isAuthenticated])
  );

  const renderItem = ({ item, index }) => (
    <TouchableHighlight
      onPress={() => console.log("You touched me")}
      _dark={{
        bg: "coolGray.800",
      }}
      _light={{
        bg: "white",
      }}>
      <Box pl="4" pr="5" py="5" bg="white" keyExtractor={(item) => item.id}>
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
    </TouchableHighlight>
  );

  const renderHiddenItem = (cartItems) => (
    <TouchableOpacity onPress={() => deleteItem(cartItems)}>
      <VStack
        alignItems="center"
        style={[styles.hiddenButton, { height: 5 * 10 }]}>
        <View>
          <Ionicons name="trash" color={"white"} size={30} bg="red" />
          <Text color="white" fontSize="xs" fontWeight="medium">
            Delete
          </Text>
        </View>
      </VStack>
    </TouchableOpacity>
  );
  const deleteItem = (cartItems) => {
    Alert.alert("Delete Item?", "Are you sure you want to delete this item?", [
      {
        text: "Yes",
        onPress: () => {
          dispatch(actions.removeFromCart(cartItems.item));
        },
      },
      { text: "No", onPress: () => console.log("cancel delete") },
    ]);
  };

  const renderProduct = ({ item, index }) => (
    <TouchableHighlight
      onPress={() => console.log("You touched me")}
      _dark={{
        bg: "coolGray.800",
      }}
      _light={{
        bg: "white",
      }}>
      <Box pl="4" pr="5" py="5" bg="white" keyExtractor={(item) => item.id}>
        <HStack alignItems="center" space={3}>
          {/* <Avatar
            size="48px"
            source={{
              uri:
                item.image ||
                "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png",
            }}
          /> */}
          <VStack>
            <Text
              color="coolGray.800"
              _dark={{
                color: "warmGray.50",
              }}
              bold>
              {item.type && item.type.typeofGallon} (NEW CONTAINER)
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
    </TouchableHighlight>
  );

  const renderHiddenProduct = (cartProduct) => (
    <TouchableOpacity onPress={() => deleteProduct(cartProduct)}>
      <VStack
        alignItems="center"
        style={[styles.hiddenButton, { height: 5 * 10 }]}>
        <View>
          <Ionicons name="trash" color={"white"} size={30} bg="red" />
          <Text color="white" fontSize="xs" fontWeight="medium">
            Delete
          </Text>
        </View>
      </VStack>
    </TouchableOpacity>
  );
  const deleteProduct = (cartProduct) => {
    Alert.alert("Delete Item?", "Are you sure you want to delete this item?", [
      {
        text: "Yes",
        onPress: () => {
          dispatch(actions.removeFromCart(cartProduct.item));
        },
      },
      { text: "No", onPress: () => console.log("cancel delete") },
    ]);
  };

  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const productsPrice = cartProduct.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const deliveryFee =
    selectedContainerStatus === "Pick Up" || selectedClaimMethod === "Delivery"
      ? storeData.storeDetails.storebranch.deliverFee
      : 0;

  const totalPrice =
    parseFloat(itemsPrice) +
    parseFloat(deliveryFee) +
    parseFloat(productsPrice);

  const order = {
    orderItems: cartItems,
    orderProducts: cartProduct,
    containerStatus: selectedContainerStatus,
    orderclaimingOption: selectedClaimMethod,
    selectedStore: {
      store: storeData.storeDetails.storebranch._id,
      branchNo: storeData.storeDetails.storebranch.branch,
      address: `${storeData.storeDetails.storebranch.address.houseNo}, ${storeData.storeDetails.storebranch.address.purokNum}, ${storeData.storeDetails.storebranch.address.streetName}, ${storeData.storeDetails.storebranch.address.barangay}, ${storeData.storeDetails.storebranch.address.city}`,
      deliveryFee:
        selectedContainerStatus === "Pick Up" ||
        selectedClaimMethod === "Delivery"
          ? storeData.storeDetails.storebranch.deliverFee
          : 0,
    },
    deliveryAddress:
      addressResult && addressResult[0]
        ? {
            houseNo: addressResult[0].houseNo,
            streetName: addressResult[0].streetName,
            purokNum: addressResult[0].purokNum,
            barangay: addressResult[0].barangay,
            city: addressResult[0].city,
            latitude: addressResult[0].latitude,
            longitude: addressResult[0].longitude,
          }
        : {},
    paymentInfo: "Cash",
    totalPrice: totalPrice,
  };

  const checkoutHandler = async () => {
    console.log("FINAL ORDER", order);
    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .post(`${baseURL}order/new`, order, config)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Order Completed",
            text2: "",
          });

          setTimeout(() => {
            dispatch(actions.clearCart());
            navigation.navigate("Profile");
          }, 500);
        }
      })
      .catch((error) => {
        Toast.show({
          topOffset: 60,
          type: "error",
          text1: "Something went wrong",
          text2: "Please try again",
        });
      });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {cartItems.length === 0 && cartProduct.length === 0 ? (
        <Box style={styles.emptyContainer}>
          <Text>No items in cart</Text>
        </Box>
      ) : (
        <FlatList
          data={[
            "Address",
            `Store: ${storeData.storeDetails.storebranch.branch}`,
            "Order Summary",
            "Select Container Status",
            "How will you claim your order?",
          ]}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <>
                <View style={styles.topheader}></View>
                <View style={styles.card}>
                  <Text style={styles.title}>{item}</Text>
                  {index === 0 && addressResult && addressResult[0] && (
                    <Text style={styles.addressdetails}>
                      {" "}
                      <Icon name="location" size={25} color="red" />
                      {"    "}
                      {addressResult[0].houseNo}
                      {addressResult[0].purokNum} {addressResult[0].streetName}{" "}
                      {addressResult[0].barangay} {addressResult[0].city}{" "}
                      {addressResult[0].latitude} {addressResult[0].longitude}
                    </Text>
                  )}
                  {index === 1 && (
                    <Text style={styles.addressdetails}>
                      {storeData.storeDetails.storebranch.address.houseNo},
                      {storeData.storeDetails.storebranch.address.purokNum},
                      {storeData.storeDetails.storebranch.address.streetName},
                      {storeData.storeDetails.storebranch.address.barangay},
                      {storeData.storeDetails.storebranch.address.city}
                    </Text>
                  )}
                  {index === 2 && (
                    <>
                      <SwipeListView
                        data={cartItems}
                        renderItem={renderItem}
                        renderHiddenItem={renderHiddenItem}
                        disableRightSwipe={true}
                        leftOpenValue={75}
                        rightOpenValue={-100}
                        previewOpenValue={-100}
                        previewOpenDelay={3000}
                        closeOnRowBeginSwipe
                      />
                      <SwipeListView
                        data={cartProduct}
                        renderItem={renderProduct}
                        renderHiddenItem={renderHiddenProduct}
                        disableRightSwipe={true}
                        leftOpenValue={75}
                        rightOpenValue={-100}
                        previewOpenValue={-100}
                        previewOpenDelay={3000}
                        closeOnRowBeginSwipe
                      />
                    </>
                  )}
                  {index === 3 && (
                    <View style={styles.cardContent}>
                      <Radio.Group
                        name="myRadioGroup"
                        value={selectedContainerStatus}
                        onChange={(value) => {
                          setselectedContainerStatus(value);
                        }}>
                        {console.log(selectedContainerStatus)}
                        {methods.map((item, index) => {
                          return (
                            <Radio
                              key={index}
                              value={item.value}
                              my="1"
                              color="#00bbff"
                              size="22"
                              style={{ float: "right" }}
                              icon={
                                <CheckCircleIcon
                                  size="22"
                                  mt="0.5"
                                  color="#95a5a6"
                                />
                              }>
                              {item.name}
                            </Radio>
                          );
                        })}
                      </Radio.Group>
                    </View>
                  )}
                  {index === 4 && (
                    <View style={styles.cardContent}>
                      <Radio.Group
                        name="myRadioGroup"
                        value={selectedClaimMethod}
                        onChange={(value) => {
                          setselectedClaimMethod(value);
                        }}>
                        {console.log(selectedClaimMethod)}
                        {methods2.map((item, index) => {
                          return (
                            <Radio
                              key={index}
                              value={item.value}
                              my="1"
                              color="#00bbff"
                              size="22"
                              style={{ float: "right" }}
                              icon={
                                <CheckCircleIcon
                                  size="22"
                                  mt="0.5"
                                  color="#95a5a6"
                                />
                              }>
                              {item.name}
                            </Radio>
                          );
                        })}
                      </Radio.Group>
                    </View>
                  )}
                </View>
              </>
            );
          }}
          ListFooterComponent={
            <>
              <View style={styles.spacer}></View>
              <Button
                title="Place Order"
                filled
                style={{
                  marginTop: 18,
                }}
                onPress={() => checkoutHandler()}
              />
            </>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    paddingBottom: 15,
  },
  topheader: {
    textAlign: "left",
    marginTop: 20,
    marginLeft: 20,
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",

    letterSpacing: 1,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00bbff",
    marginLeft: 10,
    marginTop: 10,
  },
  emptyContainer: {
    height: height,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    left: 0,
    backgroundColor: "white",
    elevation: 20,
  },
  price: {
    fontSize: 18,
    margin: 20,
    color: "red",
  },
  hiddenContainer: {
    flex: 1,
    justifyContent: "flex-end",
    flexDirection: "row",
    // width: 'lg'
  },
  hiddenButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 25,
    height: 70,
    width: width,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00bbff",
    marginLeft: 10,
    marginTop: 10,
  },
  addressdetails: {
    marginTop: 10,
    marginLeft: 15,
  },

  spacer: {
    paddingBottom: 2,
    marginLeft: 20,
  },
  cardContent: {
    paddingVertical: 5,
    paddingHorizontal: 16,
  },
});
export default OrderSummary;
