import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useContext, useState, useEffect, useCallback } from "react";
import COLORS from "../../constants/colors";

import AuthGlobal from "../../Context/store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../../assets/common/baseurl";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Button from "../../Components/Button";

import mime from "mime";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";

import Toast from "react-native-toast-message";
const EditProfile = () => {
  const context = useContext(AuthGlobal);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [phone, setPhone] = useState("");
  const [userID, setUserID] = useState("");
  const navigation = useNavigation();
  const [userProfile, setUserProfile] = useState("");

  const [image, setImage] = useState("");
  const [mainImage, setMainImage] = useState();
  const [user, setUser] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    if (context.stateUser.isAuthenticated) {
      setUser(context.stateUser.user.userId);
    }
    (async () => {
      if (Platform.OS !== "android") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result.assets);
      setMainImage(result.assets[0].uri);
      setImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (
          context.stateUser.isAuthenticated === false ||
          context.stateUser.isAuthenticated === null
        ) {
          navigation.navigate("Login");
        }

        const jwt = await AsyncStorage.getItem("jwt");
        const response = await axios.get(`${baseURL}me`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });

        setUserProfile(response.data.user);
        console.log(response.data.user);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [
    context.stateUser.isAuthenticated,
    context.stateUser.user.id,
    navigation,
  ]);

  useEffect(() => {
    if (userProfile) {
      setFname(userProfile.fname);
      setLname(userProfile.lname);
      setPhone(userProfile.phone);
      setUserID(userProfile._id);
    }
  }, [userProfile]);

  const handleProfileUpdate = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem("jwt");
      const userProfile = context.stateUser.userProfile;
      console.log("TOKEN", jwtToken);

      if (!jwtToken || !context.stateUser.isAuthenticated || !userProfile) {
        console.log("User authentication or profile information is missing");
        return;
      }

      const profileData = {
        fname: fname,
        lname: lname,
        phone: phone,
        avatar: avatar,
      };

      console.log(profileData, userID);

      const response = await axios.put(
        `${baseURL}me/update/mobile/${userID}`,
        profileData,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data", // Change the content type to JSON
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      console.log("Profile updated successfully", response.data);
      Toast.show({
        topOffset: 60,
        type: "success",
        text1: "Profile updated successfully.",
        text2: "You can now view your updated profile.",
      });
      navigation.navigate("Profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      // setError("Error updating profile. Please try again.");
      Toast.show({
        position: "top",
        bottomOffset: 20,
        type: "error",
        text1: "Error updating profile.",
        text2: "Please try again.",
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <KeyboardAwareScrollView>
        <View style={{ flex: 1, marginHorizontal: 22 }}>
          <View style={{ marginVertical: 2 }}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "bold",
                marginVertical: 5,
                color: COLORS.black,
              }}>
              Edit Profile
            </Text>
          </View>

          {/* <View style={styles.container}>
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={{ uri: mainImage }} />
              <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                <Ionicons style={{ color: "white" }} name="camera" />
              </TouchableOpacity>
            </View>
          </View> */}

          <Image
            source={{
              uri:
                userProfile && userProfile.avatar && userProfile.avatar.url
                  ? userProfile.avatar.url
                  : "default_avatar_uri",
            }}
            style={styles.avatar}
          />

          {/* FIRST AND LAST NAME */}
          <View style={{ flexDirection: "row", marginBottom: 12 }}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "400",
                  marginBottom: 8,
                }}>
                First Name
              </Text>
              <View
                style={{
                  width: "100%",
                  height: 48,
                  borderColor: "black",
                  borderWidth: 1,
                  borderRadius: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingLeft: 10,
                }}>
                <TextInput
                  placeholder="Enter your first name"
                  placeholderTextColor="black"
                  keyboardType="default"
                  style={{
                    width: "100%",
                  }}
                  name={"fname"}
                  id={"fname"}
                  value={fname}
                  onChangeText={(text) => setFname(text)}
                />
              </View>
            </View>

            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "400",
                  marginBottom: 8,
                }}>
                Last Name
              </Text>
              <View
                style={{
                  width: "100%",
                  height: 48,
                  borderColor: "black",
                  borderWidth: 1,
                  borderRadius: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingLeft: 10,
                }}>
                <TextInput
                  placeholder="Enter your last name"
                  placeholderTextColor="black"
                  keyboardType="default"
                  style={{
                    width: "100%",
                  }}
                  name={"lname"}
                  id={"lname"}
                  value={lname}
                  onChangeText={(text) => setLname(text)}
                />
              </View>
            </View>
          </View>

          {/* MOBILE NUMBER */}
          <View style={{ marginBottom: 12 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 400,
                marginVertical: 8,
              }}>
              Mobile Number
            </Text>

            <View
              style={{
                width: "100%",
                height: 48,
                borderColor: COLORS.black,
                borderWidth: 1,
                borderRadius: 8,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
                paddingLeft: 15,
              }}>
              <TextInput
                placeholder="+63"
                placeholderTextColor={COLORS.black}
                keyboardType="numeric"
                editable={false}
                style={{
                  width: "12%",
                  borderRightWidth: 1,
                  borderLeftColor: COLORS.grey,
                  height: "100%",
                }}
              />

              <TextInput
                placeholder="Enter your phone number"
                placeholderTextColor={COLORS.black}
                keyboardType="numeric"
                style={{
                  width: "80%",
                }}
                name={"phone"}
                id={"phone"}
                value={phone}
                onChangeText={(text) => setPhone(text)}
              />
            </View>
          </View>

          <Button
            title="Update"
            filled
            style={{
              marginTop: 18,
              marginBottom: 4,
            }}
            onPress={() => handleProfileUpdate()}
          />

          <Button
            title="Back to Profile"
            outline
            style={{
              marginTop: 18,
              marginBottom: 4,
            }}
            onPress={() => navigation.navigate("Profile")}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  infoContainer: {
    marginTop: 20,
  },
  infoLabel: {
    fontWeight: "bold",
  },
  infoValue: {
    marginTop: 5,
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderStyle: "solid",
    borderWidth: 8,
    padding: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    borderColor: "#E0E0E0",
    elevation: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },
  imagePicker: {
    position: "absolute",
    right: 5,
    bottom: 5,
    backgroundColor: "grey",
    padding: 8,
    borderRadius: 100,
    elevation: 20,
  },
});

export default EditProfile;
