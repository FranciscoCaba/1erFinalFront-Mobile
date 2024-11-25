import { Stack, useLocalSearchParams, router } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View, Image } from "react-native";
import { Screen } from "../../components/mios/Screen";
import { useEffect, useState } from "react";
import { editCategoria, getOneCategoria } from "../../lib/backend";
import * as ImagePicker from 'expo-image-picker';

export default function EditarCategoria() {
  const params = useLocalSearchParams();
  const [nombre, setNombre] = useState("");
  const [icono, setIcono] = useState(null);

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
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setIcono(result.assets[0].uri);
    }
  };

  useEffect(() => {
    getOneCategoria(params.id).then(res => {
      setNombre(res.nombre);
      setIcono(res.icono);
    })
  }, [])

  const editar = () => {
    editCategoria({ id: params.id, nombre, icono });
    router.back();
  };

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
        <Text style={styles.texto}>Nombre actual: {nombre}</Text>
        <Text style={styles.texto}>Nuevo nombre:</Text>
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

        {icono && (
          <View style={styles.imageView}>
            <Image
              source={{ uri: icono }}
              style={styles.imagePreview}
            />
          </View>
        )}

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
    alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 8,
  },
  imageView: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    alignSelf: "center",
    backgroundColor: "lightgray",
    borderRadius: 25,
  }
});
