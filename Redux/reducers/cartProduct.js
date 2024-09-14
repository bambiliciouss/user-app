import {
  ADD_TO_CART_PRODUCT,
  REMOVE_FROM_CART,
  CLEAR_CART,
} from "../Constants";

const cartProduct = (state = [], action) => {
  switch (action.type) {
    case ADD_TO_CART_PRODUCT:
      // Check if the product is already in the cart
      const existingProductIndex = state.findIndex(
        (item) => item.product === action.payload.product
      );

      if (existingProductIndex !== -1) {
        // If the product exists, update its quantity instead of adding a new one
        return state.map((item, index) => {
          if (index === existingProductIndex) {
            return {
              ...item,
              quantity: item.quantity + action.payload.quantity,
            };
          }
          return item;
        });
      } else {
        // If the product doesn't exist, add it to the cart
        return [...state, action.payload];
      }
    case REMOVE_FROM_CART:
      return state.filter((cartItem) => cartItem !== action.payload);
    case CLEAR_CART:
      return (state = []);
  }
  return state;
};

export default cartProduct;
