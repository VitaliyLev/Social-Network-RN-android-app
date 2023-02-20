import { onAuthStateChanged } from "firebase/auth";
import { setUser } from "./authReducer";
import { auth } from "../../firebase/config";

export const onAuthStateChangedUser = () => async (dispatch) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      try {
        const { uid, email, displayName } = user;
        dispatch(setUser({ uid, email, displayName, user }));
      } catch (error) {
        console.error("AuthStateChanged Error", error);
      }
    }
  });
};