import React, { useState, useCallback, useContext, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Dimensions,
  Container,
  Heading,
  StyleSheet,
  Image,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
var { width } = Dimensions.get("window");
import { useSelector, useDispatch } from "react-redux";

import axios from "axios";
import baseURL from "../../../assets/common/baseurl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthGlobal from "../../../Context/store/AuthGlobal";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import Button from "../../../Components/Button";

import Icon from "react-native-vector-icons/AntDesign";
import * as actions from "../../../Redux/Actions/cartActions";

const GallonOrder = (props) => {
  console.log("Route params:", props.route.params);

  const storeData = props.route.params ? props.route.params.storeData : null;

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cartItems);
  const cartProduct = useSelector((state) => state.cartProduct);
  const [loading, setLoading] = useState(true);
  const [refillGallon, setRefillGallon] = useState([]);
  const [productGallon, setProductGallon] = useState([]);

  const [isRefillSelected, setRefillSelected] = useState(false);
  const [isNewSelected, setNewSelected] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      // Reset states when screen gains focus
      setRefillGallon([]);
      setProductGallon([]);
      setRefillSelected(false);
      setNewSelected(false);
      setLoading(true);
      // return () => {
      //   dispatch(actions.clearCart()); // Assuming you have a clearCart action creator
      // };
    }, [])
  );

  const handleRefillGallons = async () => {
    setRefillSelected(true);
    setNewSelected(false);
    AsyncStorage.getItem("jwt")
      .then((res) => {
        axios
          .get(
            `${baseURL}order/all/typeofgallon/${storeData.storeDetails.storebranch._id}`,
            {
              headers: { Authorization: `Bearer ${res}` },
            }
          )
          .then((res) => {
            setRefillGallon(res.data.typeGallon);
            setLoading(false);
            console.log("Refill Gallon: ", res.data.typeGallon);
          });
      })
      .catch((error) => console.log(error));

    return () => {
      setRefillGallon([]);
      setLoading(true);
    };
  };

  const handleProductGallons = async () => {
    setNewSelected(true);
    setRefillSelected(false);
    AsyncStorage.getItem("jwt")
      .then((res) => {
        axios
          .get(
            `${baseURL}admin/all/product/store/${storeData.storeDetails.storebranch._id}`,
            {
              headers: { Authorization: `Bearer ${res}` },
            }
          )
          .then((res) => {
            setProductGallon(res.data.product);
            setLoading(false);
            console.log("Product Gallon: ", res.data.product);
          });
      })
      .catch((error) => console.log(error));

    return () => {
      setProductGallon([]);
      setLoading(true);
    };
  };

  const renderRefill = ({ item }) => {
    return (
      <View style={styles.product}>
        <Image style={styles.image} source={{ uri: item.gallonImage.url }} />
        <View style={styles.info}>
          <Text style={styles.namedesc}>{item.typeofGallon}</Text>
          <Text style={styles.price}>₱ {item.price}.00</Text>
        </View>
        <Button
          title="Add To Cart"
          filled
          style={styles.buttoncart}
          onPress={() => {
            dispatch(
              actions.addItemToCart({
                id: item._id,
                quantity: 1,
              })
            );
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: `Added to Cart`,
              text2: "Go to your cart to complete the order",
            });
          }}
        />
      </View>
    );
  };

  const renderProduct = ({ item }) => {
    return (
      <View style={styles.product}>
        <Image
          style={styles.image}
          source={{ uri: item.typesgallon.gallonImage.url }}
        />
        <View style={styles.info}>
          <Text style={styles.namedesc}>{item.typesgallon.typeofGallon}</Text>
          <Text style={styles.price}>₱ {item.price}.00</Text>
        </View>
        <Button
          title="Add To Cart"
          filled
          style={styles.buttoncart}
          onPress={() => {
            dispatch(actions.addProductToCart(item._id, 1));
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: `Added to Cart`,
              text2: "Go to your cart to complete the order",
            });
          }}
        />
      </View>
    );
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    // Calculate total price for cartItems
    cartItems.forEach((item) => {
      totalPrice += item.price * item.quantity;
    });

    // Calculate total price for cartProduct
    cartProduct.forEach((item) => {
      totalPrice += item.price * item.quantity;
    });
    return totalPrice.toFixed(2); // Assuming prices are in decimal format
  };

  const handleGotoSummary = () => {
    //console.log("orders", orderAndStatuAndClaim);
    let order = {
      storeData,
    };
    console.log("order", order);
    navigation.navigate("Order Summary", { storeData });
  };
  return (
    <>
      <View style={styles.maincontainer}>
        <View style={styles.cardHeader}>
          <Text style={styles.name}>Select Your Order:</Text>
        </View>
        <View style={styles.container}>
          <Button
            title="Refill"
            filled
            style={styles.button}
            onPress={() => handleRefillGallons()}
          />

          <Button
            title="New Container"
            filled
            style={styles.button}
            onPress={() => handleProductGallons()}
          />
        </View>

        {isRefillSelected ? (
          <FlatList
            data={refillGallon}
            renderItem={renderRefill}
            keyExtractor={(item) => item._id.toString()}
          />
        ) : isNewSelected ? (
          <FlatList
            data={productGallon}
            renderItem={renderProduct}
            keyExtractor={(item) => item._id.toString()}
          />
        ) : (
          <View>
            <Text style={{ textAlign: "center", fontStyle: "italic" }}>
              Please select a category...
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        onPress={() => {
          handleGotoSummary();
        }}
        style={styles.buttoncartt}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.buttoncartText}>
            Cart | {cartItems.length + cartProduct.length}{" "}
            {cartItems.length + cartProduct.length === 1 ? "Item" : "Items"}
          </Text>
          <Text style={[styles.buttoncartText, { textAlign: "right" }]}>
            ₱ {calculateTotalPrice()}
          </Text>
        </View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    marginLeft: 10,
    marginRight: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12.5,
    paddingBottom: 12.5,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
  },
  name: {
    fontSize: 20,
    color: "#696969",
    fontWeight: "bold",
    flex: 1,
    textAlign: "left",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    marginBottom: 4,
  },

  cartcontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    marginBottom: 4,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },

  product: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 20,
    alignItems: "center",
  },
  image: {
    width: "50%",
    height: 150,
    resizeMode: "contain",
  },
  info: {
    marginTop: 20,
  },
  namedesc: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  price: {
    fontSize: 24,
    color: "#999",
    textAlign: "center",
  },
  buttoncart: {
    // alignSelf: "flex-end",
    marginTop: 10,
    width: 200,
  },

  buttoncartt: {
    backgroundColor: "#00bbff",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 0,
  },
  buttoncartText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});

export default GallonOrder;
