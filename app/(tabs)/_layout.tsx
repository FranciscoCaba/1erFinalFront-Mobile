import { Tabs } from "expo-router";
import React from "react";

import {
  BoxIcon,
  CategoryIcon,
  HomeIcon,
  SellIcon,
} from "@/components/mios/Icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#27498c" },
        tabBarActiveTintColor: "white",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="productos"
        options={{
          title: "Productos",
          tabBarIcon: ({ color }) => <BoxIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="categorias"
        options={{
          title: "Categorias",
          tabBarIcon: ({ color }) => <CategoryIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="ventas"
        options={{
          title: "Ventas",
          tabBarIcon: ({ color }) => <SellIcon color={color} />,
        }}
      />
    </Tabs>
  );
}
