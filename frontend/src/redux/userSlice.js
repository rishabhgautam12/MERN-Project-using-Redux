import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  firstName: "",
  image: "",
  lastName: "",
  _id: "",
  addresses: [], // New field for storing addresses
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginRedux: (state, action) => {
      console.log(action.payload.data);
      state._id = action.payload.data._id;
      state.firstName = action.payload.data.firstName;
      state.lastName = action.payload.data.lastName;
      state.email = action.payload.data.email;
      state.image = action.payload.data.image;
      state.addresses = action.payload.data.addresses || []; // Load addresses if available
    },
    logoutRedux: (state) => {
      state._id = "";
      state.firstName = "";
      state.lastName = "";
      state.email = "";
      state.image = "";
      state.addresses = []; // Clear addresses on logout
    },
    addAddress: (state, action) => {
      state.addresses.push(action.payload); // Add a new address
    },
    updateAddress: (state, action) => {
      const { index, address } = action.payload;
      if (state.addresses[index]) {
        state.addresses[index] = address; // Update an existing address
      }
    },
    deleteAddress: (state, action) => {
      const index = action.payload;
      if (state.addresses[index]) {
        state.addresses.splice(index, 1); // Delete an address
      }
    },
  },
});

export const { loginRedux, logoutRedux, addAddress, updateAddress, deleteAddress } = userSlice.actions;

export default userSlice.reducer;
