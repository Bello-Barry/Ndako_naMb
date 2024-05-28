import { StyleSheet, Text, View, Pressable } from 'react-native';
import Colors from '../constants/Colors';
import { Tables } from '../types';
import { Link, useSegments } from 'expo-router';
import RemoteImage from './RemoteImage';

export const defaultPizzaImage =
  'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png';

type ProductListItemProps = {
  annonce: Tables<'annonces'>;
};

const ProductListItem = ({ annonce }: ProductListItemProps) => {
  const segments = useSegments();
  const imageUrls = annonce?.imageUrls || [];

  return (
    <Link href={`/(admin)/menu/${annonce.id}`} asChild>
      <Pressable style={styles.container}>
        {imageUrls.length > 0 ? (
          <RemoteImage
            paths={imageUrls}
            fallback={defaultPizzaImage}
            style={styles.image}
          />
        ) : (
          <RemoteImage
            paths={null}
            fallback={defaultPizzaImage}
            style={styles.image}
          />
        )}

        <Text style={styles.title}>{annonce.name}</Text>
        <Text style={styles.price}>fcfa{annonce.regularPrice}</Text>
        <Text style={styles.type}>{annonce.type}</Text>
        <Text style={styles.address}>{annonce.address}</Text>
      </Pressable>
    </Link>
  );
};

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
    color: 'gray',
  },
  address: {
    color: 'gray',
  },
});

export default ProductListItem;
