import { View, Text, Platform, FlatList, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { useCart } from '@/providers/CartProvider';
import CartListItem from '@/components/CartListItem';
import Button from '@/components/Button';

const CartScreen = () => {
  // Utilisation du hook useCart pour récupérer les items du panier et le total
  const { items, total } = useCart();

  return (
    <View style={styles.container}>
      {/* Liste des items dans le panier */}
      <FlatList
        data={items}
        renderItem={({ item }) => <CartListItem cartItem={item} />}
        keyExtractor={(item) => item.id.toString()} // Ajout de keyExtractor pour une meilleure gestion des clés
        contentContainerStyle={styles.listContent}
      />

      {/* Affichage du total */}
      <Text style={styles.totalText}>
        Total: {total} fcfa
      </Text>

      {/* Bouton de checkout */}
      <Button text="Checkout" />

      {/* Barre de statut configurée selon la plateforme */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    backgroundColor: '#fff', // Ajout d'une couleur de fond pour uniformité
  },
  listContent: {
    gap: 10,
  },
  totalText: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: '500',
  },
});

export default CartScreen;
