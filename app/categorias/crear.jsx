import { router, Stack } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Screen } from "../../components/mios/Screen";
import { useState } from "react";
import { addCategoria } from "../../lib/backend";

export default function CrearCategoria() {
  const [nombre, setNombre] = useState("");

  const crear = () => {
    addCategoria({ nombre });
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
