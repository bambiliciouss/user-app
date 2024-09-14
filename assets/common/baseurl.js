import { Platform } from "react-native";

let baseURL = "";

{
  Platform.OS == "android"
    ? (baseURL = "https://treatsdelight-crownprincess-backend.e6fies.easypanel.host/api/v1/")
    : (baseURL = "https://treatsdelight-crownprincess-backend.e6fies.easypanel.host/api/v1/");
}

{
  Platform.OS == "ios"
    ? (baseURL = "https://treatsdelight-crownprincess-backend.e6fies.easypanel.host/api/v1/")
    : (baseURL = "https://treatsdelight-crownprincess-backend.e6fies.easypanel.host/api/v1/");
}

// {
//   Platform.OS == "ios"
//     ? (baseURL = "http://172.34.100.238:4000/api/v1/")
//     : (baseURL = "http://172.34.100.238:4000/api/v1/");
// }


export default baseURL;
