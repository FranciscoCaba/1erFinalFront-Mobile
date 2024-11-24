import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function Layout() {
  return (
    <View style={styles.principal}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#27498c" },
          headerTintColor: "white",
          headerLeft: () => {},
          headerTitle: "App Carrito de Compras",
          headerRight: () => {},
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  principal: {
    backgroundColor: "black",
    flex: 1,
  },
});
