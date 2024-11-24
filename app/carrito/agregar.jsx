import { Stack, useLocalSearchParams, router } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Screen } from "../../components/mios/Screen";
import { useEffect, useState } from "react";
import { addProductoCarrito, getOneProducto } from "../../lib/backend";

export default function AgregarACarrito() {
  const params = useLocalSearchParams();
  const [cantidad, setCantidad] = useState(0);
  const [producto, setProducto] = useState({});

  const agregar = () => {
    addProductoCarrito({
      id: params.id,
      cantidad: parseInt(cantidad),
      precio: producto.precioVenta * parseInt(cantidad),
    });
    router.back();
  };

  useEffect(() => {
    setProducto(getOneProducto(params.id));
  }, [params]);

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "#27498c" },
          headerTintColor: "white",
          headerTitle: "Agregar a Carrito",
        }}
      />
      <View style={styles.container}>
        <Text style={styles.texto}>Cantidad:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setCantidad}
          value={cantidad}
          keyboardType="numeric"
        />

        <Pressable
          onPress={agregar}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "rgb(210, 230, 255)" : "white",
            },
            styles.button,
          ]}
        >
          <Text style={styles.buttonText}>Agregar</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 12,
  },
  texto: {
    color: "white",
    marginBottom: 5,
    fontSize: 25,
  },
  button: {
    borderRadius: 8,
    padding: 6,
    marginTop: 10,
    width: "30%",
    alignSelf: "center",
  },
  buttonText: {
    alignSelf: "center",
    fontSize: 20,
  },
  input: {
    backgroundColor: "white",
    height: 40,
    borderWidth: 1,
    padding: 10,
  },
});
