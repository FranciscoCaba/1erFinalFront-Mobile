import { Stack, useLocalSearchParams, router } from "expo-router";
import { Pressable, StyleSheet, Text, View, Alert } from "react-native";
import { Screen } from "../../components/mios/Screen";
import { deleteCategoria } from "../../lib/backend";

export default function EliminarCategoria() {
  const params = useLocalSearchParams();

  const confirmarEliminacion = () => {
    Alert.alert(
      "Confirmar eliminación",
      `¿Estás seguro de que deseas eliminar la categoría "${params.nombre}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: eliminar,
        },
        // eslint-disable-next-line prettier/prettier
      ]
    );
  };

  const eliminar = () => {
    deleteCategoria({ id: params.id });

    router.back();
  };

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "#27498c" },
          headerTintColor: "white",
          headerTitle: "Eliminar Categoría",
        }}
      />
      <View style={styles.container}>
        <Text style={styles.texto}>
          ¿Estás seguro de que deseas eliminar la categoría "{params.nombre}"?
        </Text>

        <Pressable
          onPress={confirmarEliminacion}
          style={({ pressed }) => [
            {
              backgroundColor: pressed
                ? "rgb(255, 200, 200)"
                : "rgb(255, 150, 150)",
            },
            styles.button,
          ]}
        >
          <Text style={styles.buttonText}>Eliminar</Text>
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
    marginBottom: 20,
  },
});
