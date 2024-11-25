import { Stack, useLocalSearchParams, router } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
} from "react-native";
import { Screen } from "../../components/mios/Screen";
import { useEffect, useState } from "react";
import {
  editProducto,
  getCategorias,
  getOneCategoria,
  getOneProducto,
} from "../../lib/backend";
import * as ImagePicker from "expo-image-picker";
import Dropdown from "../../components/mios/Dropdown";

export default function EditarProducto() {
  const params = useLocalSearchParams();
  const [nombre, setNombre] = useState("");
  const [categorias, setCategorias] = useState("");
  const [precioVenta, setPrecioVenta] = useState(0);
  const [selectedCategoria, setSelectedCategoria] = useState();
  const [imagen, setImagen] = useState(null);
  const [stock, setStock] = useState(0);

  const pickImage = async () => {
    // Solicitar permisos
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Se necesitan permisos para acceder a la galería");
      return;
    }

    // Abrir selector de imágenes
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImagen(result.assets[0].uri);
    }
  };

  const editar = () => {
    editProducto({
      id: params.id,
      nombre,
      precioVenta,
      idCategoria: selectedCategoria.value,
      imagen,
      stock,
    });
    router.back();
  };

  useEffect(() => {
    getOneProducto(params.id).then((res) => {
      setNombre(res.nombre);
      setImagen(res.imagen);
      setPrecioVenta(res.precioVenta);
      setStock(res.stock);
      getOneCategoria(res.idCategoria).then((res) => {
        setSelectedCategoria({
          value: res.id,
          label: res.nombre,
        });
      });
    });

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
          keyboardType="numeric"
        />

        <Text style={styles.texto}>Nueva Categoria:</Text>
        <Dropdown
          data={categorias}
          defaultValue={selectedCategoria?.label}
          onChange={setSelectedCategoria}
          placeholder="Seleccione uno"
        />

        <Text style={styles.texto}>Imagen del producto:</Text>
        <Pressable
          onPress={pickImage}
          style={[styles.imagenButton, { marginBottom: 10 }]}
        >
          <Text style={styles.buttonText}>Seleccionar Imagen</Text>
        </Pressable>

        {imagen && (
          <Image source={{ uri: imagen }} style={styles.imagePreview} />
        )}

        <Text style={styles.texto}>Ingrese el stock:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setStock}
          value={stock}
          keyboardType="numeric"
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
  imagenButton: {
    borderRadius: 8,
    padding: 6,
    marginTop: 10,
    width: "70%",
    alignSelf: "center",
    backgroundColor: "white",
  },
  button: {
    borderRadius: 8,
    padding: 6,
    marginTop: 10,
    width: "50%",
    alignSelf: "center",
    backgroundColor: "white",
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
  imagePreview: {
    width: 150,
    height: 200,
    alignSelf: "center",
    marginVertical: 10,
    borderRadius: 8,
  },
});
