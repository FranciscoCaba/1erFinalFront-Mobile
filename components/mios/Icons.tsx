import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export const CircleInfoIcon = (props: any) => (
  <FontAwesome6 name="circle-info" size={24} color="white" {...props} />
);

export const HomeIcon = (props: any) => (
  <FontAwesome name="home" size={32} color="white" {...props} />
);

export const InfoIcon = (props: any) => (
  <FontAwesome name="info" size={32} color="white" {...props} />
);

export const BoxIcon = (props: any) => (
  <FontAwesome6 name="box-open" size={28} color="black" {...props} />
);

export const SellIcon = (props: any) => (
  <MaterialIcons name="sell" size={32} color="white" {...props} />
);

export const CategoryIcon = (props: any) => (
  <MaterialIcons name="text-snippet" size={32} color="black" {...props} />
);

export const AddIcon = (props: any) => (
  <Ionicons name="add-circle" size={24} color="black" {...props} />
);

export const EditIcon = (props: any) => (
  <MaterialIcons name="edit" size={30} color="black" {...props} />
);

export const DeleteIcon = (props: any) => (
  <MaterialCommunityIcons name="delete" size={30} color="black" {...props} />
);

export const AddCartIcon = (props: any) => (
  <FontAwesome name="cart-plus" size={24} color="black" {...props} />
);

export const SeeCartIcon = (props: any) => (
  <FontAwesome name="shopping-cart" size={24} color="black" {...props} />
);
