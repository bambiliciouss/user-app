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
} from "react-native";
import React, { useState, useCallback, useContext, useEffect } from "react";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import baseURL from "../../assets/common/baseurl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddressDetails from "./AddressDetails";
var { height, width } = Dimensions.get("window");

import AuthGlobal from "../../Context/store/AuthGlobal";
import Button from "../../Components/Button";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";

const Address = () => {
  const [addresslist, setAddressList] = useState();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const context = useContext(AuthGlobal);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    axios
      .get(`${baseURL}me/addresses`)
      .then((res) => {
        setAddressList(res.data.addresses);
      })
      .catch((error) => {
        console.error("Error refreshing addresses:", error);
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
        console.log(context.stateUser.user);
        AsyncStorage.getItem("jwt")
          .then((res) => {
            axios
              .get(`${baseURL}me/addresses`, {
                headers: { Authorization: `Bearer ${res}` },
              })
              .then((response) => {
                //console.log("Response Data:", response.data); // Log the response data to verify its contents
                setAddressList(response.data.addresses);
                setLoading(false);
                console.log(addresslist);
              })
              .catch((error) => console.log("Axios Error:", error)); // Log any Axios errors
          })
          .catch((error) => console.log("AsyncStorage Error:", error)); // Log any AsyncStorage errors
        return () => {
          setAddressList();
          setLoading(true);
        };
      }
    }, [context.stateUser.isAuthenticated])
  );

  const handleSetDefaultAddress = async (_id) => {
    try {
      const response = await axios.post(
        `${baseURL}me/setdefault/address/${_id}`,

        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Set Address Successfully", response.data);
      Toast.show({
        topOffset: 60,
        type: "success",
        text1: "Update Successfully",
        text2: "Set Default Address Successfully",
      });
      onRefresh();
    } catch (error) {
      console.error("Error setting address:", error);
      // setError("Error updating profile. Please try again.");
      Toast.show({
        position: "top",
        bottomOffset: 20,
        type: "error",
        text1: "Error setting address.",
        text2: "Please try again.",
      });
    }
  };

  const handledeleteAddress = async (_id) => {
    try {
      const response = await axios.delete(
        `${baseURL}me/address/${_id}`,

      );

      console.log("Address Deleted Successfully", response.data);
      Toast.show({
        topOffset: 60,
        type: "success",
        text1: "Address Deleted",
        text2: "Address Deleted Successfully",
      });
      onRefresh();
    } catch (error) {
      console.error("Error deleting address:", error);
      // setError("Error updating profile. Please try again.");
      Toast.show({
        position: "top",
        bottomOffset: 20,
        type: "error",
        text1: "Error deleting address.",
        text2: "Please try again.",
      });
    }
  };


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>My Addresses</Text>
        <FlatList
          contentContainerStyle={styles.propertyListContainer}
          data={addresslist}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item, index }) => {
            //console.log("Item in FlatList:ugkfvhjgjkhgjkhg",item);
            return (
              <AddressDetails
                item={item}
                index={index}
                handleSetDefaultAddress={handleSetDefaultAddress}
                handledeleteAddress={handledeleteAddress}
              />
            );
          }}
          keyExtractor={(item) => item._id}
        />

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("NewAddress");
          }}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Add New Address</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: "left",
    marginTop: 50,
    marginLeft: 20,
    fontSize: 24, // Increased font size for better visibility
    fontWeight: "bold", // Added font weight for emphasis
    color: "#333", // Set text color
    textTransform: "uppercase", // Convert text to uppercase
    letterSpacing: 1, // Add letter spacing for better readability
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
    color: "#000000", // Filled button text color
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

export default Address;
