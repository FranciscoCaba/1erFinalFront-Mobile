import { router, Stack } from "expo-router";
import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Screen } from "../../components/mios/Screen";
import { useEffect, useState } from "react";
import { addProducto, getCategorias } from "../../lib/backend";
import Dropdown from "../../components/mios/Dropdown";
import * as ImagePicker from 'expo-image-picker';

export default function CrearProducto() {
  const [nombre, setNombre] = useState("");
  const [precioVenta, setPrecioVenta] = useState(0);
  const [categorias, setCategorias] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState({});
  const [imagen, setImagen] = useState(null);
  const [stock, setStock] = useState(0);

  const pickImage = async () => {
    // Solicitar permisos
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Se necesitan permisos para acceder a la galería');
      return;
    }

    // Abrir selector de imágenes
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImagen(result.assets[0].uri);
    }
  };

  const crear = () => {
    addProducto({ 
      nombre, 
      precioVenta, 
      idCategoria: selectedCategoria.value,
      imagen: imagen,
      stock
    });
    router.back();
  };

  useEffect(() => {
    const values = getCategorias();
    const final = values.map((val) => {
      return {
        value: val.id,
        label: val.nombre,
      };
    });
    setCategorias(final);
  }, []);

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "#27498c" },
          headerTintColor: "white",
          headerTitle: "Crear Producto",
        }}
      />
      <View style={styles.container}>
        <Text style={styles.texto}>Ingrese el nombre:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setNombre}
          value={nombre}
        />

        <Text style={styles.texto}>Ingrese el precio:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setPrecioVenta}
          value={precioVenta}
          keyboardType="numeric"
        />

        <Text style={styles.texto}>Seleccione la categoria:</Text>
        <Dropdown
          data={categorias}
          onChange={setSelectedCategoria}
          placeholder="Selecciona"
        />

        <Text style={styles.texto}>Imagen del producto:</Text>
        <Pressable
          onPress={pickImage}
          style={[styles.imagenButton, { marginBottom: 10 }]}
        >
          <Text style={styles.buttonText}>Seleccionar Imagen</Text>
        </Pressable>

        {imagen && (
          <Image
            source={{ uri: imagen }}
            style={styles.imagePreview}
          />
        )}

        <Text style={styles.texto}>Ingrese el stock:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setStock}
          value={stock}
          keyboardType="numeric"
        />

        <Pressable
          onPressOut={() => crear()}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "rgb(210, 230, 255)" : "white",
            },
            styles.button,
          ]}
        >
          <Text style={styles.buttonText}>Crear</Text>
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
    alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 8,
  },
});