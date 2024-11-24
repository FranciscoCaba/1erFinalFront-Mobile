import { Stack, useLocalSearchParams, router } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Screen } from "../../components/mios/Screen";
import { useEffect, useState } from "react";
import { editProducto, getCategorias } from "../../lib/backend";
import Dropdown from "../../components/mios/Dropdown";

export default function EditarProducto() {
  const params = useLocalSearchParams();
  const [nombre, setNombre] = useState(params.nombre || "");
  const [categorias, setCategorias] = useState("");
  const [precioVenta, setPrecioVenta] = useState(
    // eslint-disable-next-line prettier/prettier
    params.precioVenta || ""
  );
  const [selectedCategoria, setSelectedCategoria] = useState(
    // eslint-disable-next-line prettier/prettier
    ""
  );

  const editar = () => {
    editProducto({
      id: params.id,
      nombre,
      precioVenta,
      idCategoria: selectedCategoria.value,
    });
    router.back();
  };

  useEffect(() => {
    setCategorias(
      getCategorias().map((val) => {
        return {
          value: val.id,
          label: val.nombre,
        };
        // eslint-disable-next-line prettier/prettier
      })
    );
  }, []);

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "#27498c" },
          headerTintColor: "white",
          headerTitle: "Editar Categoría",
        }}
      />
      <View style={styles.container}>
        <Text style={styles.texto}>Nuevo nombre:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setNombre}
          value={nombre}
        />

        <Text style={styles.texto}>Nuevo precio:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setPrecioVenta}
          value={precioVenta}
        />

        <Text style={styles.texto}>Nueva Categoria:</Text>
        <Dropdown
          data={categorias}
          onChange={setSelectedCategoria}
          placeholder="Seleccione uno"
        />

        <Pressable
          onPress={editar}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "rgb(210, 230, 255)" : "white",
            },
            styles.button,
          ]}
        >
          <Text style={styles.buttonText}>Guardar</Text>
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
