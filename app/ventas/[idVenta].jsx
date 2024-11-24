import { useEffect, useState } from "react";
import { Screen } from "../../components/mios/Screen";
import { Stack, useLocalSearchParams } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { getDetallesVenta, getProductos } from "../../lib/backend";

export default function SaleDetailsScreen() {
  const { idVenta } = useLocalSearchParams();
  const [saleDetails, setSaleDetails] = useState([]);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    setProductos(getProductos());
    fetchSaleDetails();
  }, [idVenta]);

  const fetchSaleDetails = () => {
    const data = getDetallesVenta(idVenta);

    setSaleDetails(data);
  };

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "#27498c" },
          headerTintColor: "white",
          headerTitle: "Detalles de Venta",
        }}
      />

      <View style={[styles.filas, { marginTop: 15 }]}>
        <View style={[styles.celda, { flex: 1 }]}>
          <Text
            style={
              ([styles.texto], { fontWeight: "bold", fontStyle: "italic" })
            }
          >
            Producto
          </Text>
        </View>
        <View style={[styles.celda, { flex: 1 }]}>
          <Text
            style={[styles.texto, { fontWeight: "bold", fontStyle: "italic" }]}
          >
            Cantidad
          </Text>
        </View>
        <View style={[styles.celda, { flex: 2 }]}>
          <Text
            style={[styles.texto, { fontWeight: "bold", fontStyle: "italic" }]}
          >
            Precio
          </Text>
        </View>
      </View>

      <FlatList
        data={saleDetails}
        keyExtractor={(item) => item.idDetalleVenta.toString()}
        renderItem={({ item }) => (
          <View style={styles.filas}>
            <View style={[styles.celda, { flex: 1 }]}>
              <Text style={[styles.texto]}>
                {productos[item.idProducto - 1].nombre}
              </Text>
            </View>
            <View style={[styles.celda, { flex: 1 }]}>
              <Text style={[styles.texto]}>{item.cantidad}</Text>
            </View>
            <View style={[styles.celda, { flex: 2 }]}>
              <Text style={[styles.texto]}>{item.precio}</Text>
            </View>
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  pressable: {
    marginVertical: 10,
    alignSelf: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 25,
  },
  texto: {
    color: "black",
    fontSize: 16,
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
  searchContainer: {
    width: "90%",
    alignSelf: "center",
    marginVertical: 10,
  },
  searchInput: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    color: "black",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  filterOption: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  filterText: {
    color: "white",
    fontSize: 16,
  },
  filterInput: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    color: "black",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  saleItem: {
    backgroundColor: "white",
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 20,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saleText: {
    color: "black",
    fontSize: 16,
  },
  saleDetailsItem: {
    backgroundColor: "white",
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 20,
    borderRadius: 5,
  },
  saleDetailsText: {
    color: "black",
    fontSize: 14,
  },
});
