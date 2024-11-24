import { Screen } from "@/components/mios/Screen";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  TextInput,
} from "react-native";
import {
  getProductos,
  filtrarProductos,
  getCategorias,
} from "../../lib/backend";
import { Link } from "expo-router";
import { AddIcon, EditIcon, DeleteIcon } from "@/components/mios/Icons";
import { useIsFocused } from "@react-navigation/native";

export default function Producto() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState({}); // Para almacenar el mapeo de id -> nombre de categoría
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const isFocused = useIsFocused();

  const onRefresh = () => {
    setRefreshing(true);
    setProductos(getProductos());
    setRefreshing(false);
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === "") {
      setProductos(getProductos());
    } else {
      setProductos(filtrarProductos(text));
    }
  };

  useEffect(() => {
    if (isFocused) {
      setProductos(getProductos());
      // Cargar categorías y crear un objeto para mapear id -> nombre
      const categoriasData = getCategorias();
      const categoriasMap = {};
      categoriasData.forEach((cat) => {
        categoriasMap[cat.id] = cat.nombre;
      });

      setCategorias(categoriasMap);
    }
  }, [isFocused]);

  return (
    <Screen>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar producto por nombre o categoria..."
          value={searchText}
          onChangeText={handleSearch}
          placeholderTextColor="#666"
        />
      </View>

      <Link asChild href={"/productos/crear"}>
        <Pressable style={styles.pressable}>
          <AddIcon color="white" />
          <Text style={{ color: "white", paddingLeft: 5, fontSize: 20 }}>
            Crear
          </Text>
        </Pressable>
      </Link>

      <View style={styles.filas}>
        <View style={[styles.celda, { flex: 0.5 }]}>
          <Text
            style={[
              styles.texto,
              { fontWeight: "bold", fontStyle: "italic", fontSize: 14 },
            ]}
          >
            {"ID"}
          </Text>
        </View>
        <View style={[styles.celda, { flex: 1 }]}>
          <Text
            style={[
              styles.texto,
              { fontWeight: "bold", fontStyle: "italic", fontSize: 14 },
            ]}
          >
            {"Nombre"}
          </Text>
        </View>
        <View style={[styles.celda, { flex: 1 }]}>
          <Text
            style={[
              styles.texto,
              { fontWeight: "bold", fontStyle: "italic", fontSize: 14 },
            ]}
          >
            {"Categoría"}
          </Text>
        </View>
        <View style={[styles.celda, { flex: 1 }]}>
          <Text
            style={[
              styles.texto,
              { fontWeight: "bold", fontStyle: "italic", fontSize: 14 },
            ]}
          >
            {"Precio"}
          </Text>
        </View>
        <View style={[styles.celda, { flex: 2 }]}>
          <Text
            style={[
              styles.texto,
              { fontWeight: "bold", fontStyle: "italic", fontSize: 14 },
            ]}
          >
            Acciones
          </Text>
        </View>
      </View>
      {productos.length === 0 ? (
        <ActivityIndicator color={"#fff"} size={"large"} />
      ) : (
        <FlatList
          data={productos}
          keyExtractor={(producto, index) =>
            producto ? producto.id : index + 1
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#27498c"]}
              tintColor={["#27498c"]}
            />
          }
          renderItem={({ item }) =>
            item.activo ? (
              <View style={styles.filas}>
                <View style={[styles.celda, { flex: 0.5 }]}>
                  <Text style={[styles.texto]}>{item.id}</Text>
                </View>
                <View style={[styles.celda, { flex: 1 }]}>
                  <Text style={[styles.texto]}>{item.nombre}</Text>
                </View>
                <View style={[styles.celda, { flex: 1 }]}>
                  <Text style={[styles.texto]}>
                    {categorias[item.idCategoria]}
                  </Text>
                </View>
                <View style={[styles.celda, { flex: 1 }]}>
                  <Text style={[styles.texto]}>{item.precioVenta}</Text>
                </View>
                <Link
                  asChild
                  href={{
                    pathname: "/productos/editar",
                    params: {
                      id: item.id,
                      nombre: item.nombre,
                      categoria: item.categoria,
                      precioVenta: item.precioVenta,
                    },
                  }}
                >
                  <Pressable style={styles.celda}>
                    <EditIcon color="black" />
                  </Pressable>
                </Link>
                <Link
                  asChild
                  href={{
                    pathname: "/productos/eliminar",
                    params: { id: item.id, nombre: item.nombre },
                  }}
                >
                  <Pressable style={styles.celda}>
                    <DeleteIcon color="black" />
                  </Pressable>
                </Link>
              </View>
            ) : null
          }
        />
      )}
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
});
