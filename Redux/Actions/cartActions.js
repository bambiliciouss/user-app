import {
  ADD_TO_CART,
  ADD_TO_CART_PRODUCT,
  REMOVE_FROM_CART,
  CLEAR_CART,
} from "../Constants";
import baseURL from "../../assets/common/baseurl";
import axios from "axios";

export const addItemToCart =
  ({ id, quantity }) =>
  async (dispatch) => {
    console.log(id);
    try {
      const { data } = await axios.get(`${baseURL}admin/typeofgallon/${id}`);
      console.log("Add to cart", data);
      dispatch({
        type: ADD_TO_CART,
        payload: {
          gallon: data.gallonType._id,
          type: data.gallonType.typeofGallon,
          price: data.gallonType.price,
          quantity,
        },
      });
    } catch (error) {
      // Handle error here
      console.error("Error adding item to cart refill:", error);
    }
  };

export const addProductToCart = (id, quantity) => async (dispatch) => {
  console.log(id);
  try {
    const { data } = await axios.get(`${baseURL}admin/all/product/${id}`);
    console.log("PRODUCTS", data);
    dispatch({
      type: ADD_TO_CART_PRODUCT,
      payload: {
        product: data.product._id,
        type: data.product.typesgallon,
        price: data.product.price,
        quantity,
      },
    });
  } catch (error) {
    console.error("An error occurred while fetching product:", error);
    // Handle the error here, such as showing a user-friendly message or logging it.
  }
};

export const removeFromCart = (payload) => {
  return {
    type: REMOVE_FROM_CART,
    payload,
  };
};

export const clearCart = () => {
  return {
    type: CLEAR_CART,
  };
};
