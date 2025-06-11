import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./asyncAction";

export const userSlide = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: false,
    current: null,
    token: null,
    isLoading: false,
    mes: "",
    currentCart: null,
  },
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.token = action.payload.token;
      state.current = action.payload.userData;
    },
    logout: (state, action) => {
      state.isLoggedIn = false;
      state.current = null;
      state.token = null;
      state.isLoading = false;
      state.mes = "";
      state.currentCart = null;
    },
    clearMessage: (state) => {
      state.mes = "";
    },
    // updateCart: (state, action) => {
    //   const { pid, color, count } = action.payload;
    //   console.log({ pid, color, count });
    //   const updateItem = state.currentCart.find(
    //     (e) => (e.color === color && e.product?._id === pid)
    //   );
    //   if(updateItem) updateItem.quantity = count
    //   // else state.mes = 'Please try late.'
    //   // const updatingCart = JSON.parse(JSON.stringify(state.currentCart))
    //   // state.currentCart = updatingCart.map(e => {
    //   //   if(e.color === color && e.product?._id === pid){
    //   //     return {...e, count}
    //   //   }else return e
    //   // })
    // },
  },

  extraReducers: (builder) => {
    builder.addCase(actions.getCurrent.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(actions.getCurrent.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentCart = action.payload.cart;
      state.current = action.payload;
      state.isLoggedIn = true;
      // console.log(state.current);
    });

    builder.addCase(actions.getCurrent.rejected, (state, action) => {
      state.isLoading = false;
      state.current = null;
      state.isLoggedIn = false;
      state.token = null;
      state.currentCart = null;
      state.mes = "Login session has expired. Please log in again!";
    });
  },
});

export const { login, logout, clearMessage } = userSlide.actions;

export default userSlide.reducer;
