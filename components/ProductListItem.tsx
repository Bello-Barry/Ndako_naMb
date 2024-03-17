import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import Colors from '../constants/Colors';
import { Tables } from '../types';
import { Link, useSegments } from 'expo-router';
import RemoteImage from './RemoteImage';

export const defaultPizzaImage =
  'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png';

type ProductListItemProps = {
  annonce: Tables<'annonce'>;
};

const ProductListItem = ({ annonce }: ProductListItemProps) => {
  const segments = useSegments();
//${segments[0]}
  return (
    <Link href={`/(admin)/menu/${annonce.id}`} asChild>
      <Pressable style={styles.container}>
      <RemoteImage
        path={annonce?.imageUrls[0]} 
        fallback={annonce?.imageUrls[0]} 
        style={styles.image}
      />

<Text style={styles.title}>{annonce.name}</Text>
        <Text style={styles.price}>fcfa{annonce.regularPrice}</Text>
        <Text style={styles.type}>{annonce.type}</Text> 
        <Text style={styles.address}>{annonce.address}</Text>
      </Pressable>
    </Link>
  );
};

export default ProductListItem;

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

  title: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
  },
  price: {
    color: Colors.light.tint,
    fontWeight: 'bold',
  },
  type: {
    color: 'gray', // Style pour le champ "type"
  },
  address: {
    color: 'gray', // Style pour le champ "address"
  },
});
{/*
const AnnonceListItem = ({ annonce }: AnnonceListItemProps) => {
  const segments = useSegments();

  return (
    <Link href={`/${segments[0]}/annonce/${annonce.id}`} asChild>
      <Pressable style={styles.container}>
        <RemoteImage
          path={annonce.imageUrls}
          fallback={defaultImage}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.title}>{annonce.name}</Text>
        <Text style={styles.price}>${annonce.regularPrice}</Text>
        <Text style={styles.type}>{annonce.type}</Text> 
        <Text style={styles.address}>{annonce.address}</Text>
      </Pressable>
    </Link>
  );
};

export default AnnonceListItem;

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

  title: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
  },
  price: {
    color: Colors.light.tint,
    fontWeight: 'bold',
  },
  type: {
    color: 'gray', // Style pour le champ "type"
  },
  address: {
    color: 'gray', // Style pour le champ "address"
  },
});
*/}