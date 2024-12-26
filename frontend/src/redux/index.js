import { configureStore } from '@reduxjs/toolkit'
import userSliceReducer  from './userSlice'
import  productSliceReducer  from './productSlice'
import axios from "axios";

export const store = configureStore({
    reducer: {
        user : userSliceReducer,
        product : productSliceReducer

    },
  })

  store.subscribe(async () => {
    const state = store.getState();
    const { user, product } = state;

    if (user._id && product.cartItem.length > 0) {
        try {
            await axios.post("http://localhost:5050/update-cart", {
                userId: user._id,
                cart: product.cartItem,
            });
            console.log("Cart synced successfully.");
        } catch (err) {
            console.error("Failed to sync cart with server:", err);
        }
    }
});