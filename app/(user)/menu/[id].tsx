import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import Button from '@/components/Button';
import { useCart } from '@/providers/CartProvider';

import { useAnnonce} from '@/api/annonces';
import RemoteImage from '@/components/RemoteImage';



const ProductDetailsScreen = () => {
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === 'string' ? idString : idString[0]);
  const { data:annonce, error, isLoading } = useAnnonce(id);

  const { addItem } = useCart();

  const router = useRouter();

 

  const addToCart = () => {
    if (!annonce) {
      return;
    }
    addItem(annonce );
    router.push('/cart');
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Failed to fetch products</Text>;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: annonce.name }} />

      <RemoteImage
        path={annonce?.imageUrls} 
        fallback={annonce?.imageUrls[0]} 
        style={styles.image}
      />

      <Text>{annonce.description}</Text> 
      <Text>{annonce.address}</Text> 
      <Text>{annonce.discountPrice}</Text>
      <Text>{annonce.bathrooms}</Text> 
      <Text>{annonce.bedrooms}</Text> 
      <Text>{annonce.furnished}</Text> 
      <Text>{annonce.parking}</Text>
      <Text>{annonce.type}</Text> 
      <Text>{annonce.offer}</Text> 
      
      <Text style={styles.price}>{annonce.regularPrice}fcfa</Text> 
      <Button onPress={addToCart} text="reservez" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    padding: 10,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 'auto',
  },

  sizes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  size: {
    backgroundColor: 'gainsboro',
    width: 50,
    aspectRatio: 1,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeText: {
    fontSize: 20,
    fontWeight: '500',
  },
});

export default ProductDetailsScreen;


{/*
const AnnonceDetailsScreen = () => {
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === 'string' ? idString : idString[0]);
  const { data: annonce, error, isLoading } = useInsertAnnonce(id); // Utilisation de useInsertAnnonce au lieu de useProduct

  const { addItem } = useCart();

  const router = useRouter();

  const addToCart = () => {
    if (!annonce) {
      return;
    }
    addItem(annonce); // Utilisation de l'annonce au lieu du produit
    router.push('/cart');
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Échec de la récupération des annonces</Text>; // Modification du message d'erreur
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: annonce.name }} />

      <RemoteImage
        path={annonce?.imageUrls} 
        fallback={defaultImage} 
        style={styles.image}
      />

      <Text>{annonce.description}</Text> 
      <Text>{annonce.address}</Text> 
      <Text>{annonce.discountPrice}</Text>
      <Text>{annonce.bathrooms}</Text> 
      <Text>{annonce.bedrooms}</Text> 
      <Text>{annonce.furnished}</Text> 
      <Text>{annonce.parking}</Text>
      <Text>{annonce.type}</Text> 
      <Text>{annonce.offer}</Text> 
      
      <Text style={styles.price}>${annonce.regularPrice}</Text> 
      <Button onPress={addToCart} text="Ajouter au panier" />
    </View>
  );
};

export default AnnonceDetailsScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    flex: 1,
    maxWidth: '50%',
  },

  image: {
    width: '100%',
    aspectRatio: 1,
  },

  price: {
    color: Colors.light.tint,
    fontWeight: 'bold',
    fontSize: 18,
    marginVertical: 10,
  },
});

*/}
