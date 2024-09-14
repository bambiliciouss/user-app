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
    Image,
  } from "react-native";
  
  import { Box, HStack, VStack, Spacer } from "native-base";
  import React, {
    useState,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
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
  
  import MapView, { Marker, AnimatedRegion } from "react-native-maps";
  import { GOOGLE_MAP_KEY } from "../../constants/googleMapKey";
  import imagePath from "../../constants/imagePath";
  import MapViewDirections from "react-native-maps-directions";
  import Loader from "../../Components/MapsComponents/Loader";
  const screen = Dimensions.get("window");
  const ASPECT_RATIO = screen.width / screen.height;
  const LATITUDE_DELTA = 0.05;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  
  import {
    locationPermission,
    getCurrentLocation,
    getLocation,
  } from "../../Components/helper/helperFunction";
  
  const OutDeliveries2 = (props) => {
    const { orderId } = props.route.params;
    //console.log("The Order ID", orderId);
    const [orderDetails, setOrderDetails] = useState(null);
    const [riderDetails, setRiderDetails] = useState(null);
    const [myLatitude, setMyLatitude] = useState(null);
    const [myLongitude, setMyLongitude] = useState(null);
    const [riderLatitude, setRiderLatitude] = useState(null);
    const [riderLongitude, setRiderLongitude] = useState(null);
  
    const sortOrderStatusByLatestDate = (order) => {
      if (order && order.orderStatus && Array.isArray(order.orderStatus)) {
        return order.orderStatus.sort((a, b) => {
          return new Date(b.datedAt) - new Date(a.datedAt);
        });
      }
      return [];
    };
  
    useFocusEffect(
      useCallback(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`${baseURL}order/${orderId}`);
            //console.log("Order Details", response.data.order);
            const sortedOrderStatus = sortOrderStatusByLatestDate(
              response.data.order
            );
            setOrderDetails({
              ...response.data.order,
              orderStatus: sortedOrderStatus,
            });
          } catch (error) {
            console.log(error);
          }
        };
  
        fetchData();
  
        return () => {
          console.log("Data Cleared");
        };
      }, [orderId])
    );
  
    useEffect(() => {
      if (orderDetails) {
        console.log(orderDetails.orderStatus[0].staff._id);
        setMyLatitude(orderDetails.deliveryAddress.latitude);
        setMyLongitude(orderDetails.deliveryAddress.longitude);
  
        fetchRiderLocation(orderDetails.orderStatus[0].staff._id);
  
        const interval = setInterval(() => {
          fetchRiderLocation(orderDetails.orderStatus[0].staff._id);
        }, 1000);
  
        return () => {
          clearInterval(interval);
        };
      }
    }, [orderDetails]);
  
    const fetchRiderLocation = async (staffId) => {
      console.log(
        "Checking Rider Location------------------------------------------------"
      );
      const locPermissionDenied = await locationPermission();
      console.log(locPermissionDenied);
      if (locPermissionDenied) {
        try {
          const response = await axios.get(`${baseURL}rider/location/${staffId}`);
          console.log(
            "Rider Details Response",
            response.data.riderloc.latitude,
            response.data.riderloc.longitude
          );
          setRiderDetails(response.data.riderloc);
        } catch (error) {
          console.log(error);
        }
      }
    };
  
    useEffect(() => {
      if (riderDetails) {
        console.log(
          "Rider Location:",
          riderDetails.latitude,
          riderDetails.longitude
        );
        // console.log("RiderLatitude:", riderDetails.latitude);
        // console.log("RiderLongitude:", riderDetails.longitude);
        setRiderLatitude(riderDetails.latitude);
        setRiderLongitude(riderDetails.longitude);
      }
    }, [riderDetails]);
  
    // useEffect(() => {
    //   if (orderDetails && riderDetails) {
    //     console.log(`Distance: ${orderDetails.distance} km`);
    //     console.log(`Duration: ${orderDetails.duration} min.`);
    //   }
    // }, [orderDetails, riderDetails]);
  
    const mapRef = useRef();
    const [state, setState] = useState({
      myLoc: {
        latitude: 0,
        longitude: 0,
      },
      isLoading: false,
    });
  
    useEffect(() => {
      if (myLatitude !== null && myLongitude !== null) {
        setState((prevState) => ({
          ...prevState,
          myLoc: {
            latitude: myLatitude,
            longitude: myLongitude,
          },
        }));
      }
    }, [myLatitude, myLongitude]);
  
    const { myLoc, isLoading } = state;
  
    const updateState = (data) => {
      setRiderLatitude((riderLatitude) => ({
        ...riderLatitude,
        ...data,
      }));
      setRiderLongitude((riderLongitude) => ({
        ...riderLongitude,
        ...data,
      }));
    };
  
    const fetchTime = (d, t) => {
      updateState({
        distance: d,
        time: t,
      });
    };
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={styles.container}>
            <View style={{ flex: 1 }}>
              {myLatitude && myLongitude && riderLatitude && riderLongitude && (
                <MapView
                  ref={mapRef}
                  style={StyleSheet.absoluteFill}
                  initialRegion={{
                    ...myLoc,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                  }}
                  region={{
                    ...myLoc,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                  }}>
                  <Marker
                    coordinate={{ latitude: myLatitude, longitude: myLongitude }}>
                    <Image
                      source={imagePath.house}
                      style={{ width: 60, height: 60 }}
                      resizeMode="contain"
                    />
                  </Marker>
  
                  <Marker
                    coordinate={{
                      latitude: riderLatitude,
                      longitude: riderLongitude,
                    }}>
                    <Image
                      source={imagePath.waterrr}
                      style={{ width: 50, height: 50 }}
                      resizeMode="contain"
                    />
                  </Marker>
  
                  <MapViewDirections
                    //key={index}
                    origin={{
                      latitude: riderLatitude,
                      longitude: riderLongitude,
                    }}
                    //destination={destinationCords}
                    destination={{
                      latitude: myLatitude,
                      longitude: myLongitude,
                    }}
                    apikey={GOOGLE_MAP_KEY}
                    strokeWidth={6}
                    strokeColor="#00bbff"
                    optimizeWaypoints={true}
                    onStart={(params) => {
                      console.log(
                        `Started routing between "${params.origin}" and "${params.destination}"`
                      );
                    }}
                    onReady={(result) => {
                      // console.log(
                      //   `${delivery.customer.fname} ${delivery.customer.lname}`
                      // );
                      console.log(`Distance: ${result.distance} km`);
                      console.log(`Duration: ${result.duration} min.`);
  
  
  
                      fetchTime(result.distance, result.duration),
                        mapRef.current.fitToCoordinates(result.coordinates, {
                          edgePadding: {
                            // right: 30,
                            // bottom: 300,
                            // left: 30,
                            // top: 100,
                          },
                        });
                    }}
                    onError={(errorMessage) => {
                      // console.log('GOT AN ERROR');
                    }}
                  />
                </MapView>
              )}
            </View>
  
            <Loader isLoading={isLoading} />
          </View>
        </View>
      </SafeAreaView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    bottomCard: {
      backgroundColor: "white",
      width: "100%",
      padding: 30,
      borderTopEndRadius: 24,
      borderTopStartRadius: 24,
    },
    inpuStyle: {
      backgroundColor: "white",
      borderRadius: 4,
      borderWidth: 1,
      alignItems: "center",
      height: 48,
      justifyContent: "center",
      marginTop: 16,
    },
  });
  
  export default OutDeliveries2;