import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Pressable,
} from "react-native";
import { Screen } from "../../components/mios/Screen";
import { Stack, useRouter } from "expo-router";
import { filtrarVenta, getClientes } from "../../lib/backend";
import { RadioButton } from "react-native-paper";

export default function SalesScreen() {
  const router = useRouter();
  const [sales, setSales] = useState(null);
  const [filterOption, setFilterOption] = useState("fecha");
  const [filterValue, setFilterValue] = useState("");
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    fetchSales();
    setClientes(getClientes());
  }, [filterOption, filterValue]);

  const fetchSales = () => {
    const data = filtrarVenta(filterOption, filterValue);

    setSales(data || []);
  };

  const handleSalePress = (sale) => {
    router.push(`/ventas/${sale.idVenta}`);
  };

  return (
    <Screen>
      <View style={styles.filterContainer}>
        <View style={styles.filterOption}>
          <RadioButton
            value="fecha"
            status={filterOption === "fecha" ? "checked" : "unchecked"}
            onPress={() => setFilterOption("fecha")}
          />
          <Text style={styles.filterText}>Filtrar por Fecha</Text>
        </View>
        <View style={styles.filterOption}>
          <RadioButton
            value="cliente"
            status={filterOption === "cliente" ? "checked" : "unchecked"}
            onPress={() => setFilterOption("cliente")}
          />
          <Text style={styles.filterText}>Filtrar por Cliente</Text>
        </View>
      </View>

      {filterOption === "fecha" ? (
        <TextInput
          style={styles.filterInput}
          placeholder="Ingrese la fecha (dd/mm/yyyy)"
          value={filterValue}
          onChangeText={setFilterValue}
        />
      ) : (
        <TextInput
          style={styles.filterInput}
          placeholder="Ingrese nombre, apellido o cédula del cliente"
          value={filterValue}
          onChangeText={setFilterValue}
        />
      )}

      <View style={[styles.filas, { marginTop: 15 }]}>
        <View style={[styles.celda, { flex: 1 }]}>
          <Text
            style={
              ([styles.texto], { fontWeight: "bold", fontStyle: "italic" })
            }
          >
            Fecha
          </Text>
        </View>
        <View style={[styles.celda, { flex: 1 }]}>
          <Text
            style={[styles.texto, { fontWeight: "bold", fontStyle: "italic" }]}
          >
            Total
          </Text>
        </View>
        <View style={[styles.celda, { flex: 2 }]}>
          <Text
            style={[styles.texto, { fontWeight: "bold", fontStyle: "italic" }]}
          >
            Cliente
          </Text>
        </View>
      </View>

      <FlatList
        data={sales}
        keyExtractor={(item) => item?.idVenta}
        renderItem={({ item }) =>
          item ? (
            <Pressable onPress={() => handleSalePress(item)}>
              <View style={styles.filas}>
                <View style={[styles.celda, { flex: 1 }]}>
                  <Text style={[styles.texto]}>{item.fecha}</Text>
                </View>
                <View style={[styles.celda, { flex: 1 }]}>
                  <Text style={[styles.texto]}>{item.total}</Text>
                </View>
                <View style={[styles.celda, { flex: 2 }]}>
                  <Text style={[styles.texto]}>
                    {clientes[item.idCliente - 1]?.nombre}{" "}
                    {clientes[item.idCliente - 1]?.apellido}
                  </Text>
                </View>
              </View>
            </Pressable>
          ) : (
            ""
          )
        }
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
