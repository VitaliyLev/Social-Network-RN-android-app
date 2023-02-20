import { createSlice } from "@reduxjs/toolkit";
import {
  authSignUpUser,
  authSignInUser,
  authSignOutUser,
} from "./authOperations";

const initialState = {
  userId: null,
  userName: "",
  userEmail: null,
  userArray: [],
  isUserAuth: false,
  userPhoto: null,
  isLoading: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setUser(state, { payload }) {
      state.userId = payload.uid;
      state.userName = payload.displayName;
      state.userEmail = payload.email;
      state.userArray = payload.user;
      state.isUserAuth = true;
      state.userPhoto = payload.user.photoURL;
    },

    setUserPhoto(state, action) {
      state.userPhoto = action.payload;
    },

    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(authSignUpUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(authSignUpUser.fulfilled, (state, action) => {
        state.userName = action.payload.displayName;
        state.userEmail = action.payload.email;
        state.userId = action.payload.uid;
        state.isUserAuth = true;
        state.isLoading = false;
      })
      .addCase(authSignUpUser.rejected, (state) => {
        state.isLoading = false;
        //throw alert error
      })

      .addCase(authSignInUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(authSignInUser.fulfilled, (state, action) => {
        state.userName = action.payload.displayName;
        state.userId = action.payload.uid;
        state.userEmail = action.payload.email;
        state.isUserAuth = true;
        state.isLoading = false;
      })
      .addCase(authSignInUser.rejected, (state) => {
        state.isLoading = false;
        //throw alert error
      })

      .addCase(authSignOutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(authSignOutUser.fulfilled, (state) => {
        state.userId = null;
        state.userName = "";
        state.userEmail = null;
        state.isUserAuth = false;
        state.userArray = [];
        state.userPhoto = null;
        state.isLoading = false;
      })
      .addCase(authSignOutUser.rejected, (state) => {
        state.isLoading = false;
        //throw alert error
      });
  },
});

export const { setUser, setUserPhoto, setIsLoading } = authSlice.actions;
