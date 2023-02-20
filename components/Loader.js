import { StyleSheet, View } from "react-native";
import React from "react";
import Spinner from "react-native-loading-spinner-overlay";
import { useSelector } from "react-redux";
import { selectIsLoading } from "../redux/auth/authSelectors";

const Loader = () => {
  const isVisibleLoader = useSelector(selectIsLoading);

  return (
    <View>
      {isVisibleLoader && (
        <Spinner
          visible={isVisibleLoader}
          textContent={"Loading..."}
          textStyle={styles.spinnerTextStyle}
        />
      )}
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: "#fff",
  },
});
