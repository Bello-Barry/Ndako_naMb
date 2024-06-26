import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import { defaultPizzaImage } from '@/components/ProductListItem';
import { useState } from 'react';
import Button from '@/components/Button';
import { useCart } from '@/providers/CartProvider';

import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

import RemoteImage from '@/components/RemoteImage';
import { useAnnonce } from '@/api/annonces';




const ProductDetailsScreen = () => {
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === 'string' ? idString : idString[0]);
  const { data: annonce, error, isLoading } = useAnnonce(id);

  const { addItem } = useCart();

  const router = useRouter();
  const windowWidth = Dimensions.get('window').width;
  

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
      <Stack.Screen
        options={{
          title: 'Menu',
          headerRight: () => (
            <Link href={`/(admin)/menu/create?id=${id}`} asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="pencil"
                    size={25}
                    color={Colors.light.tint}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />

      <Stack.Screen options={{ title: annonce?.name }} />

      <RemoteImage
        paths={annonce?.imageUrls}
        fallback={annonce?.imageUrls[0]}
        style={styles.image}
      />
      
      
     

      <Text>{annonce?.description}</Text> 
      <Text>{annonce?.address}</Text> 
      <Text>{annonce?.regularPrice}</Text>
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
    width:100,
    aspectRatio: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: '500',
  },
});

export default ProductDetailsScreen;