import { ActivityIndicator, FlatList, Text } from 'react-native';
import ProductListItem from '@/components/ProductListItem';
import { useAnnoncetList } from '@/api/annonces';

export default function MenuScreen() {
  const { data: annonce, error, isLoading } =useAnnoncetList();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Failed to fetch products</Text>;
  }

  return (
    <FlatList
      data={annonce}
      renderItem={({ item }) => <ProductListItem annonce={item} />}
      numColumns={2}
      contentContainerStyle={{ gap: 10, padding: 10 }}
      columnWrapperStyle={{ gap: 10 }}
    />
  );
}