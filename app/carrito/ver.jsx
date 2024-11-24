import { router, Stack } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
} from "react-native";
import { Screen } from "../../components/mios/Screen";
import { useEffect, useState } from "react";
import {
  getCarrito,
  getProductos,
  clienteExists,
  addCliente,
  guardarVenta,
  getOneCliente,
  resetCarrito,
} from "../../lib/backend";

export default function VerCarrito() {
  const [carrito, setCarrito] = useState([]);
  const [productos, setProductos] = useState({});
  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [showClientForm, setShowClientForm] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setProductos(getProductos());
    const carritoItems = getCarrito();
    setCarrito(carritoItems);

    // Calcular el total
    const totalVenta = carritoItems.reduce(
      (sum, item) => sum + item.precio,
      // eslint-disable-next-line prettier/prettier
      0
    );
    setTotal(totalVenta);
  }, []);

  const handleFinalizarOrden = async () => {
    if (!cedula) {
      Alert.alert("Error", "Por favor ingrese un número de cédula");
      return;
    }

    const exists = clienteExists(parseInt(cedula));

    if (!exists && !showClientForm) {
      setShowClientForm(true);
      return;
    }

    if (showClientForm && (!nombre || !apellido)) {
      Alert.alert("Error", "Por favor complete todos los campos");
      return;
    }

    let cliente = {};

    try {
      // Si es un cliente nuevo, registrarlo
      if (!exists) {
        cliente = addCliente({
          cedula: parseInt(cedula),
          nombre,
          apellido,
        });
      } else {
        cliente = getOneCliente(cedula);
      }

      // Preparar datos para la venta
      const ventaData = {
        productos: carrito.map((item) => ({
          idProducto: item.id,
          cantidad: item.cantidad,
          precio: item.precio,
        })),
        venta: {
          idCliente: cliente.id,
          total: total,
        },
      };

      // Guardar la venta
      guardarVenta(ventaData);

      Alert.alert("Éxito", "La orden ha sido finalizada correctamente", [
        {
          text: "OK",
          onPress: () => {
            setShowClientForm(false);
            setCarrito([]);
            setTotal(0);
            setCedula("");
            setNombre("");
            setApellido("");
            resetCarrito();
            router.back();
          },
        },
      ]);
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "#27498c" },
          headerTintColor: "white",
          headerTitle: "Carrito",
        }}
      />

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ingrese su cédula"
          value={cedula}
          onChangeText={setCedula}
          keyboardType="numeric"
          placeholderTextColor="#666"
        />

        {showClientForm && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={nombre}
              onChangeText={setNombre}
              placeholderTextColor="#666"
            />
            <TextInput
              style={styles.input}
              placeholder="Apellido"
              value={apellido}
              onChangeText={setApellido}
              placeholderTextColor="#666"
            />
          </>
        )}
      </View>

      <View style={[styles.filas, { marginTop: 10 }]}>
        <View style={[styles.celda, { flex: 1 }]}>
          <Text style={[styles.texto]}>{"Producto"}</Text>
        </View>
        <View style={[styles.celda, { flex: 1 }]}>
          <Text style={[styles.texto]}>{"Cantidad"}</Text>
        </View>
        <View style={[styles.celda, { flex: 1 }]}>
          <Text style={[styles.texto]}>{"Precio"}</Text>
        </View>
      </View>

      {productos.length === 0 ? (
        <ActivityIndicator color={"#fff"} size={"large"} />
      ) : (
        <>
          <FlatList
            data={carrito}
            keyExtractor={(producto, index) => index.toString()}
            renderItem={({ item }) =>
              item ? (
                <View style={styles.filas}>
                  <View style={[styles.celda, { flex: 1 }]}>
                    <Text style={[styles.texto]}>
                      {productos[item.id - 1].nombre}
                    </Text>
                  </View>
                  <View style={[styles.celda, { flex: 1 }]}>
                    <Text style={[styles.texto]}>{item.cantidad}</Text>
                  </View>
                  <View style={[styles.celda, { flex: 1 }]}>
                    <Text style={[styles.texto]}>{item.precio}</Text>
                  </View>
                </View>
              ) : null
            }
          />

          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total: {total}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Finalizar Orden"
              onPress={handleFinalizarOrden}
              color="#27498c"
            />
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  texto: {
    color: "black",
    fontSize: 12,
  },
  filas: {
    width: "90%",
    backgroundColor: "white",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 2,
  },
  celda: {
    flex: 1,
    height: 40,
    textAlign: "center",
    alignItems: "center",
    verticalAlign: "center",
    justifyContent: "center",
    borderRightWidth: 2,
    borderColor: "black",
  },
  formContainer: {
    width: "90%",
    alignSelf: "center",
    marginVertical: 10,
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    color: "black",
    marginBottom: 10,
  },
  buttonContainer: {
    width: "90%",
    alignSelf: "center",
    marginVertical: 20,
  },
  totalContainer: {
    width: "90%",
    alignSelf: "center",
    marginTop: 10,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
  },
  totalText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
  },
});
