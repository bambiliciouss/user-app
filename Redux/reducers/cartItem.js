import { ADD_TO_CART, REMOVE_FROM_CART, CLEAR_CART } from "../Constants";

const cartItems = (state = [], action) => {
  switch (action.type) {
    case ADD_TO_CART:
      // Check if the item is already in the cart
      const existingItemIndex = state.findIndex(
        (item) => item.gallon === action.payload.gallon
      );

      if (existingItemIndex !== -1) {
        // If the item exists, update its quantity instead of adding a new one
        return state.map((item, index) => {
          if (index === existingItemIndex) {
            return {
              ...item,
              quantity: item.quantity + action.payload.quantity,
            };
          }
          return item;
        });
      } else {
        // If the item doesn't exist, add it to the cart
        return [...state, action.payload];
      }

    case REMOVE_FROM_CART:
      return state.filter((cartItem) => cartItem !== action.payload);

    case CLEAR_CART:
      return [];

    default:
      return state;
  }
};

export default cartItems;
