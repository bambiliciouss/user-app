import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useCallback, useContext, useEffect } from "react";
import AuthGlobal from "../Context/store/AuthGlobal";

const HomePage = () => {
  const navigation = useNavigation();
  const context = useContext(AuthGlobal);
  const isAuthenticated = context.stateUser.isAuthenticated;

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.name}>Hydration Starts Here!</Text>
          </View>
          <Image
            source={require("../assets/logo2.1.png")}
            style={{
              width: 100,
              height: 100,
              alignSelf: "center",
            }}
          />
          <View style={styles.cardContent}>
            <Text style={styles.description}>
              Water refilling stations provide a convenient and eco-friendly
              solution for replenishing drinking water supplies. These stations
              typically offer purified water, allowing customers to refill their
              reusable containers, reducing single-use plastic waste. They are
              promoting hydration while minimizing environmental impact.
            </Text>
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.name}>Why Choose Us?</Text>
          </View>
          <Text style={styles.nameafter}>Hassle Free</Text>
          <View style={styles.cardContent}>
            <View style={styles.iconRow}>
              {/* <Image
                source={require("../assets/onboarding_2.png")}
                style={{
                  width: 100,
                  height: 100,
                  alignSelf: "center",
                  borderRadius: 100,
                  backgroundColor: "#4a94d9",
                }}
              /> */}

              <Text
                style={[styles.description, { width: "95%", paddingLeft: 15 }]}>
                Our app provides a user-friendly and hassle-free ordering
                experience. When customers use our app, they can easily place
                orders and stay informed with real-time notifications regarding
                the status of their orders. This streamlined process ensures
                that customers can navigate through the ordering process
                effortlessly and stay updated on their order progress without
                any inconvenience.
              </Text>
            </View>
          </View>

          <Text style={styles.nameafter}>Quality and Reliability</Text>
          <View style={styles.cardContent}>
            <View style={styles.iconRow}>
              <Text
                style={[styles.description, { width: "95%", paddingLeft: 15 }]}>
                We ensure that our water meets high standards for safety and
                cleanliness, providing a reliable source of hydration.
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.name}>
              We're your go-to source for water delivery service near you!
            </Text>
          </View>
          {/* <View style={styles.cardContent}>
            <View style={styles.iconRow}>
              <Ionicons name="call" size={25} color="black" />
              <Text style={styles.description}> 0908-866-1978</Text>
            </View>
            <View style={styles.iconRow}>
              <Ionicons name="location-outline" size={25} color="black" />
              <Text style={[styles.description, { width: "80%" }]}>
                Blk-15 Lot 7 Chavez St., Cor. Estante St. Purok-3, Central
                Bicutan, Taguig City
              </Text>
            </View>
          </View> */}
        </View>
        {!isAuthenticated && (
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate("User", { screen: "Login" })}>
              <Text style={styles.login}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={() =>
                navigation.navigate("User", { screen: "Register" })
              }>
              <Text style={styles.login}>Register</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#c9ebff",
    padding: 20,
  },

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
    textAlign: "center",
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
    color: "#696969",
    textAlign: "justify",
  },

  iconRow: {
    flexDirection: "row",
    marginBottom: 10,
  },

  loginButton: {
    position: "relative",
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },

  registerButton: {
    position: "relative",
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
});
export default HomePage;
