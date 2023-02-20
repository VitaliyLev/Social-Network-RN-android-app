import React, { useEffect} from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import useRoute from "../router";
import { selectIsUserAuth} from "../redux/auth/authSelectors";
import { onAuthStateChangedUser } from "../redux/auth/refreshUserState";

export default function Main() {
  const isUserAuth = useSelector(selectIsUserAuth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(onAuthStateChangedUser());
  }, [dispatch]);
  
  const routing = useRoute(isUserAuth);
  return <NavigationContainer>{routing}</NavigationContainer>;
}
