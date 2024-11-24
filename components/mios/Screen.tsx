import { StyleSheet, View } from "react-native";

export function Screen({ children }: any) {
  return <View style={styles.screen}>{children}</View>;
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "black",
    paddingHorizontal: 2,
    paddingTop: 4,
    flex: 1,
  },
});
