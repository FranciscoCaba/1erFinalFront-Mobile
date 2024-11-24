import { Stack, useLocalSearchParams, router } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Screen } from "../../components/mios/Screen";
import { useState } from "react";
import { editCategoria } from "../../lib/backend";

export default function EditarCategoria() {
  const params = useLocalSearchParams();
  const [nombre, setNombre] = useState(params.nombre || "");

  const editar = () => {
    editCategoria({ id: params.id, nombre });
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
        <Text style={styles.texto}>Nombre actual: {params.nombre}</Text>
        <Text style={styles.texto}>Nuevo nombre:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setNombre}
          value={nombre}
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
