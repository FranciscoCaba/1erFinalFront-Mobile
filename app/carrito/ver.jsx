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
  Modal,
  TouchableOpacity,
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
import { RadioButton } from "react-native-paper";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function VerCarrito() {
  const [carrito, setCarrito] = useState([]);
  const [productos, setProductos] = useState({});
  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [showClientForm, setShowClientForm] = useState(false);
  const [total, setTotal] = useState(0);
  const [tipoOperacion, setTipoOperacion] = useState("");
  const [direccion, setDireccion] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isDeliveryModalVisible, setIsDeliveryModalVisible] = useState(false);
  const [tempDireccion, setTempDireccion] = useState("");
  const [locationPermission, setLocationPermission] = useState(null);

  useEffect(() => {
    setProductos(getProductos());
    const carritoItems = getCarrito();
    setCarrito(carritoItems);

    const totalVenta = carritoItems.reduce((sum, item) => sum + item.precio, 0);
    setTotal(totalVenta);
  }, []);

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation(coordinate);
  };

  const handlePreFinalizarOrden = async () => {
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

    // Si es Pickup, finalizar directamente
    if (tipoOperacion === "PickUp") {
      await finalizarOrden();
      return;
    }

    // Si es Delivery, mostrar modal para dirección y ubicación
    setIsDeliveryModalVisible(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    setLocationPermission(status === "granted");
  };

  const finalizarOrden = async (passedDireccion = tempDireccion) => {
    if (tipoOperacion === "Delivery" && !selectedLocation) {
      Alert.alert("Error", "Por favor seleccione una ubicación en el mapa");
      return;
    }

    if (tipoOperacion === "Delivery" && !passedDireccion) {
      Alert.alert("Error", "Por favor ingrese una dirección");
      return;
    }

    let cliente = {};

    try {
      const exists = clienteExists(parseInt(cedula));

      if (!exists) {
        cliente = addCliente({
          cedula: parseInt(cedula),
          nombre,
          apellido,
        });
      } else {
        cliente = getOneCliente(cedula);
      }

      const ventaData = {
        productos: carrito.map((item) => ({
          idProducto: item.id,
          cantidad: item.cantidad,
          precio: item.precio,
        })),
        venta: {
          idCliente: cliente.id,
          total,
          tipoOperacion,
        },
      };
      if (tipoOperacion === "Delivery") {
        ventaData.venta = {
          ...ventaData.venta,
          direccion: passedDireccion,
          ubicacion: selectedLocation,
        };
      }

      guardarVenta(ventaData);

      Alert.alert("Éxito", "La orden ha sido finalizada correctamente", [
        {
          text: "OK",
          onPress: () => {
            resetFormAndNavigate();
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const resetFormAndNavigate = () => {
    setShowClientForm(false);
    setCarrito([]);
    setTotal(0);
    setCedula("");
    setNombre("");
    setApellido("");
    setDireccion("");
    setTipoOperacion("");
    setSelectedLocation(null);
    setIsDeliveryModalVisible(false);
    setTempDireccion("");
    resetCarrito();
    router.back();
  };

  const handleConfirmDeliveryDetails = () => {
    if (!tempDireccion) {
      Alert.alert("Error", "Por favor ingrese una dirección");
      return;
    }
    if (!selectedLocation) {
      Alert.alert("Error", "Por favor seleccione una ubicación en el mapa");
      return;
    }
    finalizarOrden(tempDireccion);
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
        <Text style={[styles.textoBlanco, { marginBottom: 0 }]}>
          Tipo de Operación:{" "}
        </Text>
        <View style={styles.tipoOperacionContainer}>
          <View style={styles.tipoOperacion}>
            <RadioButton
              value="PickUp"
              status={tipoOperacion === "PickUp" ? "checked" : "unchecked"}
              onPress={() => setTipoOperacion("PickUp")}
            />
            <Text style={styles.tipoOperacionText}>Pickup</Text>
          </View>
          <View style={styles.tipoOperacion}>
            <RadioButton
              value="Delivery"
              status={tipoOperacion === "Delivery" ? "checked" : "unchecked"}
              onPress={() => setTipoOperacion("Delivery")}
            />
            <Text style={styles.tipoOperacionText}>Delivery</Text>
          </View>
        </View>
      </View>

      <View style={[styles.filas, { marginTop: 10 }]}>
        <View style={[styles.celda, { flex: 1 }]}>
          <Text style={[styles.texto, { fontWeight: "bold" }]}>
            {"Producto"}
          </Text>
        </View>
        <View style={[styles.celda, { flex: 1 }]}>
          <Text style={[styles.texto, { fontWeight: "bold" }]}>
            {"Cantidad"}
          </Text>
        </View>
        <View style={[styles.celda, { flex: 1 }]}>
          <Text style={[styles.texto, { fontWeight: "bold" }]}>{"Precio"}</Text>
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
              onPress={handlePreFinalizarOrden}
              color="#27498c"
              disabled={!tipoOperacion}
            />
          </View>
        </>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isDeliveryModalVisible}
        onRequestClose={() => setIsDeliveryModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Detalles de Entrega</Text>

            <Text style={styles.textoBlanco}>Dirección:</Text>
            <TextInput
              style={[styles.input, { width: "100%" }]}
              placeholder="Ingrese su dirección"
              value={tempDireccion}
              onChangeText={setTempDireccion}
              placeholderTextColor="#666"
            />

            <Text style={styles.textoBlanco}>Seleccione ubicación:</Text>
            <MapView
              showsUserLocation
              showsMyLocationButton
              style={styles.map}
              onPress={handleMapPress}
              initialRegion={{
                latitude: -25.2988,
                longitude: -57.6172,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              {selectedLocation && (
                <Marker
                  coordinate={selectedLocation}
                  title="Ubicación seleccionada"
                />
              )}
            </MapView>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsDeliveryModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirmDeliveryDetails}
              >
                <Text style={styles.modalButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  texto: {
    color: "black",
    fontSize: 12,
  },
  textoBlanco: {
    color: "white",
    marginBottom: 5,
    fontSize: 20,
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
  tipoOperacionContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 10,
  },
  tipoOperacion: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  tipoOperacionText: {
    color: "white",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#27498c",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    color: "white",
    fontSize: 20,
    marginBottom: 15,
    fontWeight: "bold",
  },
  map: {
    width: "100%",
    height: 200,
    marginBottom: 10,
    borderRadius: 5,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "red",
  },
  confirmButton: {
    backgroundColor: "green",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
