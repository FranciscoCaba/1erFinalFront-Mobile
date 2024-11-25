import { router, Stack } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
} from "react-native";
import { Screen } from "../../components/mios/Screen";
import { useState } from "react";
import { addCategoria } from "../../lib/backend";
import * as ImagePicker from "expo-image-picker";

export default function CrearCategoria() {
  const [nombre, setNombre] = useState("");
  const [icono, setIcono] = useState(null);

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
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setIcono(result.assets[0].uri);
    }
  };

  const crear = () => {
    addCategoria({ nombre, icono });
    router.back();
  };

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "#27498c" },
          headerTintColor: "white",
          headerTitle: "Crear Categoria",
        }}
      />
      <View style={styles.container}>
        <Text style={styles.texto}>Ingrese el nombre:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setNombre}
          value={nombre}
        />

        <Text style={styles.texto}>Icono de categoria:</Text>
        <Pressable
          onPress={pickImage}
          style={[styles.iconoButton, { marginBottom: 10 }]}
        >
          <Text style={styles.buttonText}>Seleccionar Icono</Text>
        </Pressable>

        {icono && <Image source={{ uri: icono }} style={styles.imagePreview} />}

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
  iconoButton: {
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
    width: "30%",
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
    height: 150,
    alignSelf: "center",
    marginVertical: 10,
    borderRadius: 8,
  },
});
