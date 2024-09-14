import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect } from "react";
import Button from "../../Components/Button";
import { useSelector, useDispatch } from "react-redux";
var { width } = Dimensions.get("window");

import * as actions from "../../Redux/Actions/cartActions";
import Toast from "react-native-toast-message";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../../assets/common/baseurl";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/AntDesign";
const AddressDetails = ({
  item,
  index,
  handleSetDefaultAddress,
  handledeleteAddress,
}) => {
  const { houseNo, purokNum, streetName, barangay, city, isDefault, _id } =
    item;
  // console.log("this is item ", item);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const deleteAddress = (_id) => {
    Alert.alert(
      "Delete Address?",
      "Are you sure you want to delete this address?",
      [
        {
          text: "Yes",
          onPress: () => {
            handledeleteAddress(_id);
            console.log("addressdeleted", _id);
          },
        },
        { text: "No", onPress: () => console.log("cancel delete", _id) },
      ]
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardBody}>
        <Text style={styles.address}>
          {houseNo || "N/A"} {purokNum || "N/A"} {streetName || "N/A"}{" "}
          {barangay || "N/A"} {city || "N/A"}
        </Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={() => {
              handleSetDefaultAddress(_id);
            }}>
            <View
              style={[
                styles.button,
                isDefault ? styles.defaultButton : styles.nonDefaultButton,
              ]}>
              <Text style={styles.buttonText}>
                {isDefault ? "Default Address" : "Set as Default"}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("EditAddress", { idAddress: _id });
            }}>
            <View style={styles.editButton}>
              <Icon name="edit" size={20} color="#13b7f2" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              deleteAddress(_id);
            }}>
            <View style={styles.deleteButton}>
              <Icon name="delete" size={20} color="#fa260a" />
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
});

export default AddressDetails;
