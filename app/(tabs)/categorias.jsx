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
import { getCategorias, filtrarCategorias } from "../../lib/backend";
import { Link } from "expo-router";
import { AddIcon, EditIcon, DeleteIcon } from "@/components/mios/Icons";
import { useIsFocused } from "@react-navigation/native";

export default function Categoria() {
  const [categorias, setCategorias] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const isFocused = useIsFocused();

  const onRefresh = () => {
    setRefreshing(true);
    setCategorias(getCategorias());
    setRefreshing(false);
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === "") {
      setCategorias(getCategorias());
    } else {
      setCategorias(filtrarCategorias(text));
    }
  };

  useEffect(() => {
    if (isFocused) {
      setCategorias(getCategorias());
    }
  }, [isFocused]);

  return (
    <Screen>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre..."
          value={searchText}
          onChangeText={handleSearch}
          placeholderTextColor="#666"
        />
      </View>

      <Link asChild href={"/categorias/crear"}>
        <Pressable style={styles.pressable}>
          <AddIcon color="white" />
          <Text style={{ color: "white", paddingLeft: 5, fontSize: 20 }}>
            Crear
          </Text>
        </Pressable>
      </Link>

      <View style={styles.filas}>
        <View style={styles.celda}>
          <Text
            style={[
              styles.texto,
              { fontWeight: "bold", fontStyle: "italic", fontSize: 14 },
            ]}
          >
            {"ID"}
          </Text>
        </View>
        <View style={styles.celda}>
          <Text
            style={[
              styles.texto,
              { fontWeight: "bold", fontStyle: "italic", fontSize: 14 },
            ]}
          >
            {"Nombre"}
          </Text>
        </View>
        <View style={[styles.celda, { flex: 2 }]}>
          <Text
            style={{ fontWeight: "bold", fontStyle: "italic", fontSize: 14 }}
          >
            Acciones
          </Text>
        </View>
      </View>
      {categorias.length === 0 ? (
        <ActivityIndicator color={"#fff"} size={"large"} />
      ) : (
        <FlatList
          data={categorias}
          keyExtractor={(categoria, index) =>
            categoria ? categoria.id : index + 1
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
                <View style={styles.celda}>
                  <Text style={[styles.texto]}>{item.id}</Text>
                </View>
                <View style={styles.celda}>
                  <Text style={[styles.texto]}>{item.nombre}</Text>
                </View>
                <Link
                  asChild
                  href={{
                    pathname: "/categorias/editar",
                    params: { id: item.id, nombre: item.nombre },
                  }}
                >
                  <Pressable style={styles.celda}>
                    <EditIcon color="black" />
                  </Pressable>
                </Link>
                <Link
                  asChild
                  href={{
                    pathname: "/categorias/eliminar",
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
