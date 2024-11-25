import { Stack, useLocalSearchParams, router } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Screen } from "../../components/mios/Screen";
import { useEffect, useState } from "react";
import {
  addProductoCarrito,
  getOneProducto,
  tieneStock,
} from "../../lib/backend";

export default function AgregarACarrito() {
  const params = useLocalSearchParams();
  const [cantidad, setCantidad] = useState(0);
  const [producto, setProducto] = useState({});

  const agregar = () => {
    if (cantidad > 0 && tieneStock(params.id, cantidad)) {
      addProductoCarrito({
        id: params.id,
        cantidad: parseInt(cantidad),
        precio: producto.precioVenta * parseInt(cantidad),
      });
      router.back();
    } else if (cantidad <= 0) {
      alert("La cantidad debe ser mayor o igual a 0");
    } else {
      alert("Stock Insuficiente");
    }
  };

  useEffect(() => {
    getOneProducto(params.id).then((res) => {
      setProducto(res);
    });
  }, []);

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
        <Text style={styles.texto}>Stock Disponible: {producto.stock}</Text>
      </View>
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
