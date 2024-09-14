import React, { useState, useCallback, useContext } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Container,
  Heading,
  StyleSheet,
  Image,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import baseURL from "../../../assets/common/baseurl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthGlobal from "../../../Context/store/AuthGlobal";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import Button from "../../../Components/Button";
import * as actions from "../../../Redux/Actions/cartActions";
import { useSelector, useDispatch } from "react-redux";
const Store = () => {
  const [selectedStore, setselectedStore] = useState(null);
  const [branchList, setBranchList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const context = useContext(AuthGlobal);
  const [storeDetails, setStoreDetails] = useState([]);
  const dispatch = useDispatch();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      axios.get(`${baseURL}available/store`).then((res) => {
        setBranchList(res.data);
        setLoading(false);
      });
      setRefreshing(false);
    }, 2000);
  }, []);

  useFocusEffect(
    useCallback(() => {
      dispatch(actions.clearCart());
      if (!context.stateUser.isAuthenticated) {
        navigation.navigate("User", { screen: "Login" });
      } else {
        AsyncStorage.getItem("jwt")
          .then((res) => {
            axios
              .get(`${baseURL}/available/store`, {
                headers: { Authorization: `Bearer ${res}` },
              })
              .then((res) => {
                setBranchList(res.data.storeBarangay);
                setLoading(false);
                console.log("STORES: ", res.data.storeBarangay);
              });
          })
          .catch((error) => console.log(error));

        return () => {
          setBranchList([]);
          setLoading(true);
        };
      }
    }, [context.stateUser.isAuthenticated])
  );

  const handleGotoGallon = () => {
    //console.log("orders", orderAndStatuAndClaim);
    let storeData = {
      selectedStore,
      storeDetails,
    };
    console.log("store", storeData);
    navigation.navigate("Gallon Order", { storeData: storeData });
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <TouchableOpacity
          onPress={() => {
            setselectedStore(item._id);
            setStoreDetails(item);
            console.log("Selected Store:", item);
          }}
          style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ marginRight: 8 }}>
            <View
              style={{
                height: 24,
                width: 24,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: selectedStore === item._id ? "#3498db" : "#95a5a6",
                alignItems: "center",
                justifyContent: "center",
              }}>
              {selectedStore === item._id && (
                <View
                  style={{
                    height: 12,
                    width: 12,
                    borderRadius: 6,
                    backgroundColor: "#3498db",
                  }}
                />
              )}
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {item.storebranch.storeImage && (
                <Image
                  source={{ uri: item.storebranch.storeImage.url }}
                  style={{ width: 100, height: 100, marginRight: 10 }}
                />
              )}
              <View style={{ width: 150 }}>
                <Text style={styles.description}>
                  {item.storebranch.branch}
                </Text>
                <Text style={styles.description}>
                  {item.storebranch.address.houseNo},{" "}
                  {item.storebranch.address.purokNum},{" "}
                  {item.storebranch.address.streetName},{" "}
                  {item.storebranch.address.barangay},{" "}
                  {item.storebranch.address.city}
                </Text>
                <Text style={styles.price}>
                  Delivery Fee: ₱{item.storebranch.deliverFee}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
  return (
    <View style={styles.container}>
    <View style={styles.cardHeader}>
      <Text style={styles.name}>Select Your Preferred Store:</Text>
    </View>
    {branchList && branchList.length > 0 ? (
      <FlatList
        data={branchList}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()} // Make sure to use toString() for the key
      />
    ) : (
      <Text style={{ textAlign: 'center' }}>No store available in your set address</Text>
    )}
    {branchList && branchList.length > 0 && ( // Check if branchList has elements
      <View style={{ width: "100%", alignItems: "center" }}>
        <Button
          title="Select Store"
          filled
          style={{
            marginTop: 18,
            marginBottom: 4,
            width: 300,
          }}
          onPress={() => handleGotoGallon()}
        />
      </View>
    )}
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 10,
    marginRight: 20,
    marginTop: 20,
    marginBottom: 20,
  },

  content: {
    marginLeft: 10,
    marginRight: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  /******** card **************/
  card: {
    shadowColor: "#00000021",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,

    marginVertical: 5,
    backgroundColor: "white",
    marginHorizontal: 5,
    borderRadius: 30,
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
    fontSize: 18,
    color: "#696969",
    fontWeight: "bold",
    flex: 1,
    textAlign: "left",
  },
  nameafter: {
    fontSize: 15,
    color: "#696969",
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    fontStyle: "italic",
  },
  cardContent: {
    paddingVertical: 12.5,
    paddingHorizontal: 16,
  },
  description: {
    fontSize: 14,
    // color: "#696969",
    textAlign: "justify",
  },

  iconRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "right",
  },

}
);

export default Store;
