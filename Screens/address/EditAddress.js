import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
  TextInput,
} from "react-native";
import React, { useCallback, useState, useEffect } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import baseURL from "../../assets/common/baseurl";

import COLORS from "../../constants/colors";
import Toast from "react-native-toast-message";
import Button from "../../Components/Button";
import { Picker } from "@react-native-picker/picker";

import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import Icon from "react-native-vector-icons/Foundation";

const EditAddress = (props) => {
  const { idAddress } = props.route.params;
  const navigation = useNavigation();
  const [addressDetails, setAddressDetails] = useState("");

  const [currentLocation, setCurrentLocation] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [purokNum, setPurokNum] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const barangayOptions = [
    "Bagumbayan",
    "Bambang",
    "Calzada",
    "Central Bicutan",
    "Central Signal Village",
    "Fort Bonifacio",
    "Hagonoy",
    "Ibayo-Tipas",
    "Katuparan",
    "Ligid-Tipas",
    "Lower Bicutan",
    "Maharlika Village",
    "Napindan",
    "New Lower Bicutan",
    "North Daang Hari",
    "North Signal Village",
    "Palingon",
    "Pinagsama",
    "San Miguel",
    "Santa Ana",
    "South Daang Hari",
    "South Signal Village",
    "Tanyag",
    "Tuktukan",
    "Upper Bicutan",
    "Ususan",
    "Wawa",
    "Western Bicutan",
  ];

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `${baseURL}me/address/details/${idAddress}`
          );
          console.log("Address Details", response.data.address);
          setAddressDetails(response.data.address);
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
    if (addressDetails) {
      setLatitude(addressDetails.latitude);
      setLongitude(addressDetails.longitude);
      setHouseNo(addressDetails.houseNo);
      setPurokNum(addressDetails.purokNum);
      setSelectedBarangay(addressDetails.barangay);
      setStreet(addressDetails.streetName);
      setCity(addressDetails.city);

      setCurrentLocation({
        latitude: addressDetails.latitude,
        longitude: addressDetails.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });

      setInitialRegion({
        latitude: addressDetails.latitude,
        longitude: addressDetails.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
  }, [addressDetails]);

  const handleMarkerDrag = async (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setCurrentLocation({ latitude, longitude });

    try {
      let addressDetails = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      console.log("this is the marked address", addressDetails);
      setLatitude(latitude);
      setLongitude(longitude);
      // setHouseNo(addressDetails[0].name);
      setStreet(addressDetails[0].street);
      setCity(addressDetails[0].city);
      // setRegion(addressDetails[0].region);
      // setCountry(addressDetails[0].country);
    } catch (error) {
      console.error("Error fetching address details:", error);
    }
  };
  const handleSearch = async () => {
    try {
      if (!searchQuery) {
        // If searchQuery is null or empty, move to current location
        setInitialRegion({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
        setSearchResult(null);
        return;
      }

      const searchLocation = await Location.geocodeAsync(searchQuery);
      if (searchLocation && searchLocation.length > 0) {
        setSearchResult(searchLocation[0]); // Assuming the first result is the most relevant
        setInitialRegion({
          latitude: searchLocation[0].latitude,
          longitude: searchLocation[0].longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
        console.log("this is the searched address", searchLocation);
        setLatitude(latitude);
        setLongitude(longitude);
        setStreet(searchLocation[0].street);
        setCity(searchLocation[0].city);
      } else {
        setSearchResult(null);
        // Handle case where no results are found
      }
    } catch (error) {
      console.error("Error searching location:", error);
      // Handle error
    }
  };

  const handleAddressUpdate = async () => {
    try {
      const addressData = {
        houseNo: houseNo,
        streetName: street,
        purokNum: purokNum,
        barangay: selectedBarangay,
        city: city,
        latitude: latitude,
        longitude: longitude,
      };

      console.log(addressData, idAddress);

      const response = await axios.put(
        `${baseURL}me/update/address/${idAddress}`,
        addressData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Address updated successfully", response.data);
      Toast.show({
        topOffset: 60,
        type: "success",
        text1: "Address updated successfully.",
      });
      navigation.navigate("Address");
    } catch (error) {
      console.error("Error updating address:", error);
      // setError("Error updating profile. Please try again.");
      Toast.show({
        position: "top",
        bottomOffset: 20,
        type: "error",
        text1: "Error updating address.",
        text2: "Please try again.",
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>Edit Address</Text>

        <TextInput
          placeholder="Search for location"
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          value={searchQuery}
          style={styles.searchBarContainer}
        />

        {/* House No */}
        <View
          style={{
            width: "95%",
            height: 30,
            borderColor: COLORS.black,
            borderWidth: 1,
            borderRadius: 8,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingLeft: 15,
            margin: 10,
          }}>
          <TextInput
            placeholder="House No."
            placeholderTextColor={COLORS.black}
            keyboardType="default"
            editable={false}
            style={{
              width: "30%",
              borderRightWidth: 1,
              borderLeftColor: COLORS.grey,
              height: "100%",
            }}
          />
          <TextInput
            placeholder="House No./Unit No./Building"
            placeholderTextColor={COLORS.black}
            keyboardType="default"
            style={{
              width: "80%",
              paddingLeft: 15,
            }}
            name={"houseNo"}
            id={"houseNo"}
            value={houseNo}
            onChangeText={(text) => setHouseNo(text)}
          />
        </View>

        {/* Street Name */}
        <View
          style={{
            width: "95%",
            height: 30,
            borderColor: COLORS.black,
            borderWidth: 1,
            borderRadius: 8,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingLeft: 15,
            marginLeft: 10,
            marginLeft: 10,
          }}>
          <TextInput
            placeholder="Street Name"
            placeholderTextColor={COLORS.black}
            keyboardType="default"
            editable={false}
            style={{
              width: "30%",
              borderRightWidth: 1,
              borderLeftColor: COLORS.grey,
              height: "100%",
            }}
          />
          <TextInput
            placeholder="Street Name"
            placeholderTextColor={COLORS.black}
            keyboardType="default"
            style={{
              width: "80%",
              paddingLeft: 15,
            }}
            name={"street"}
            id={"street"}
            value={street}
            onChangeText={(text) => setStreet(text)}
          />
        </View>

        {/* Purok Num */}
        <View
          style={{
            width: "95%",
            height: 30,
            borderColor: COLORS.black,
            borderWidth: 1,
            borderRadius: 8,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingLeft: 15,
            margin: 10,
          }}>
          <TextInput
            placeholder="Purok No."
            placeholderTextColor={COLORS.black}
            keyboardType="default"
            editable={false}
            style={{
              width: "30%",
              borderRightWidth: 1,
              borderLeftColor: COLORS.grey,
              height: "100%",
            }}
          />
          <TextInput
            placeholder="Purok No."
            placeholderTextColor={COLORS.black}
            keyboardType="default"
            style={{
              width: "80%",
              paddingLeft: 15,
            }}
            name={"purokNum"}
            id={"purokNum"}
            value={purokNum}
            onChangeText={(text) => setPurokNum(text)}
          />
        </View>

        {/* Barangay */}
        <View
          style={{
            width: "95%",
            height: 30,
            borderColor: COLORS.black,
            borderWidth: 1,
            borderRadius: 8,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingLeft: 15,
            marginLeft: 10,
          }}>
          <TextInput
            placeholder="Barangay"
            placeholderTextColor={COLORS.black}
            editable={false}
            style={{
              width: "30%",
              borderRightWidth: 1,
              borderLeftColor: COLORS.grey,
              height: "100%",
            }}
          />
          <Picker
            selectedValue={selectedBarangay}
            style={{ width: "70%" }}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedBarangay(itemValue)
            }>
            <Picker.Item label="Select Here" />
            {barangayOptions.map((barangay, index) => (
              <Picker.Item key={index} label={barangay} value={barangay} />
            ))}
          </Picker>
          <TextInput
            // placeholder="Enter Purok No."
            placeholderTextColor={COLORS.black}
            keyboardType="numeric"
            style={{
              width: "80%",
              paddingLeft: 15,
            }}
            name={"barangay"}
            id={"barangay"}
            value={selectedBarangay}
            onChangeText={(text) => setSelectedBarangay(text)}
          />
        </View>

        {/* City */}
        <View
          style={{
            width: "95%",
            height: 30,
            borderColor: COLORS.black,
            borderWidth: 1,
            borderRadius: 8,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingLeft: 15,
            margin: 10,
          }}>
          <TextInput
            placeholder="City"
            placeholderTextColor={COLORS.black}
            keyboardType="default"
            editable={false}
            style={{
              width: "30%",
              borderRightWidth: 1,
              borderLeftColor: COLORS.grey,
              height: "100%",
            }}
          />
          <TextInput
            placeholder="City"
            placeholderTextColor={COLORS.black}
            keyboardType="default"
            style={{
              width: "80%",
              paddingLeft: 15,
            }}
            name={"city"}
            id={"city"}
            value={city}
            onChangeText={(text) => setCity(text)}
          />
        </View>
      </View>

      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        region={searchResult ? initialRegion : null} // Update region only if search result is available
      >
        {searchResult ? (
          <Marker
            coordinate={{
              latitude: searchResult.latitude,
              longitude: searchResult.longitude,
            }}
            title="Searched Location"
            draggable
            onDragEnd={handleMarkerDrag}
          />
        ) : (
          currentLocation && (
            <Marker
              coordinate={currentLocation}
              title="Your Location"
              draggable
              onDragEnd={handleMarkerDrag}
            />
          )
        )}
      </MapView>

      {/* <TouchableOpacity>
        <View style={[styles.locate, { flexDirection: "row" }]}>
            <Icon name="target-two" size={20} color="#fa260a" />
            <Text style={styles.buttonText}>  Locate Me</Text>
          </View>
        </TouchableOpacity> */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => handleAddressUpdate()}>
          <View style={styles.updatebutton}>
            <Text style={styles.buttonText}>Update Address</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Address")}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Back</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  map: {
    width: "100%",
    height: "50%",
    marginLeft: 10,
    marginRight: 10,
  },
  title: {
    marginTop: 50,
    marginLeft: 20,
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  updatebutton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: "#00bbff", // Filled button color
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
  searchBarContainer: {
    backgroundColor: "transparent",
    borderBottomColor: "black",
    borderTopColor: "black",
    paddingHorizontal: 20,
  },
  searchBarInputContainer: {
    backgroundColor: "#E0E0E0",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10, // Adjust as needed
    marginBottom: 4, // Adjust as needed
    paddingHorizontal: 10, // Adjust as needed
  },
  locate: {
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

export default EditAddress;
