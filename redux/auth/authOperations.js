import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { auth } from "../../firebase/config";

export const authSignUpUser = createAsyncThunk(
  "auth/signUp",
  async (credentials, thunkAPI) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );

      await updateProfile(auth.currentUser, {
        displayName: credentials.name,
      });

      const userUpdateSucces = await auth.currentUser;
      return userUpdateSucces;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const authSignInUser = createAsyncThunk(
  "auth/signIn",
  async (credentials, thunkAPI) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );

      const userUpdateSucces = await auth.currentUser;
      return userUpdateSucces;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const authSignOutUser = createAsyncThunk(
  "auth/signOut",
  async (_, thunkAPI) => {
    try {
      await signOut(auth);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

//update current user photo
export const updateUserPhoto = (photoUrl) =>
  updateProfile(auth.currentUser, {
    photoURL: photoUrl,
  })
    .then(() => {
      console.log("Profile updated! Photo update in Storage");
    })
    .catch((error) => {
      console.log(error);
    });

//delete image from auth
export const deleteUserPhotoFromAuth = () =>
  updateProfile(auth.currentUser, {
    photoURL: "",
  })
    .then(() => {
      console.log("Profile updated! Photo deleted from Ayth Firebase");
    })
    .catch((error) => {
      console.log(error);
    });
