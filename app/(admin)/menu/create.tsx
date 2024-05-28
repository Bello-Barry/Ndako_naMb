import Button from '@/components/Button';
import Colors from '@/constants/Colors';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, Alert, Dimensions, Switch, ScrollView, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useDeleteAnnonce, useInsertAnnonce, useAnnonce, useUpdateAnnonce } from '@/api/annonces';
import * as FileSystem from 'expo-file-system';
import { randomUUID } from 'expo-crypto';
import { supabase } from '@/lib/supabase';
import { decode } from 'base64-arraybuffer';
import { annonce } from '@/types';
import { Ionicons } from '@expo/vector-icons';

const CreateProductScreen = async () => {
  const [formData, setFormData] = useState<annonce>({
    name: '',
    description: '',
    address: '',
    regularPrice: 0,
    bathrooms: 0,
    bedrooms: 0,
    parking: false,
    type: '',
    imageUrls: [],
  });

  const [image, setImage] = useState<string | null>(null);

  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(
    typeof idString === 'string' ? idString : idString?.[0]
  );
  const isUpdating = !!idString;

  const { mutate: insertAnnonce } = useInsertAnnonce();
  const { mutate: updateAnnonce } = useUpdateAnnonce();
  const { data: updatingAnnonce } = useAnnonce(id);
  const { mutate: deleteAnnonce } = useDeleteAnnonce();

  const router = useRouter();

  useEffect(() => {
    if (updatingAnnonce) {
      setFormData(updatingAnnonce);
    }
  }, [updatingAnnonce]);

  const resetFields = () => {
    const emptyFormData: annonce = {
      name: '',
      description: '',
      address: '',
      regularPrice: 0,
      bathrooms: 0,
      bedrooms: 0,
      parking: false,
      type: '',
      imageUrls: [],
    };
    setFormData(emptyFormData);
  };

  const validateInput = () => {
    if (!formData.name || !formData.description || formData.imageUrls.length === 0 || !formData.address || !formData.regularPrice || !formData.parking || !formData.type) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return false;
    }
    return true;
  };

  const onSubmit = () => {
    if (isUpdating) {
      onUpdate();
    } else {
      onCreate();
    }
  };

  const onCreate = async () => {
    if (!validateInput()) {
      return;
    }

    const newAnnonce: Omit<annonce, 'id'> = { ...formData };

    if (formData.imageUrls) {
      newAnnonce.imageUrls = formData.imageUrls;
    }

    insertAnnonce(
      { ...newAnnonce },
      {
        onSuccess: () => {
          resetFields();
          router.back();
        },
      }
    );
  };

  const onUpdate = async () => {
    if (!validateInput()) {
      return;
    }

    updateAnnonce(
      { ...formData, imageUrls: formData.imageUrls },
      {
        onSuccess: () => {
          resetFields();
          router.back();
        },
      }
    );
  };

  const pickImage = async () => {
    let results: string[] = [];

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 6,
    });

    if (!result.canceled && result.assets) {
      result.assets.forEach((image: { uri: string }) => {
        const uri = image.uri;
        results.push(uri);
      });

      setFormData((prevData) => ({
        ...prevData,
        imageUrls: [...prevData.imageUrls, ...results]
      }));
    }
  };

  const onDelete = () => {
    deleteAnnonce(id, {
      onSuccess: () => {
        resetFields();
        router.replace('/(admin)');
      },
    });
  };

  const confirmDelete = () => {
    Alert.alert('Confirm', 'Are you sure you want to delete this product', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: onDelete,
      },
    ]);
  };

  const submitToSupabase = async () => {
    try {
      const uploadedImageUrls = await uploadImages(formData);

      const { data, error } = await supabase
        .from('annonces')
        .insert([
          {
            name: formData.name,
            description: formData.description,
            address: formData.address,
            regularPrice: formData.regularPrice,
            bathrooms: formData.bathrooms,
            bedrooms: formData.bedrooms,
            parking: formData.parking,
            type: formData.type,
            imageUrls: uploadedImageUrls,
          },
        ]);

      if (error) {
        console.error('Erreur lors de l\'insertion des données :', error);
      } else {
        console.log('Données soumises avec succès :', data);
      }
    } catch (error) {
      console.error('Erreur lors de la soumission des données :', error);
    }
  };

  async function uploadImages(formData: { imageUrls: string[] }): Promise<string[]> {
    const uploadedImageUrls: string[] = [];
    const baseFilePath = 'images';

    try {
      for (const imageUrl of formData.imageUrls) {
        if (!imageUrl.startsWith('file://')) {
          console.error('Invalid image URL. It should start with "file://".');
          continue;
        }

        const base64 = await FileSystem.readAsStringAsync(imageUrl, {
          encoding: 'base64',
        });

        const filePath = `${baseFilePath}/${randomUUID()}.png`;
        const contentType = 'image/png';

        const { data, error } = await supabase.storage
          .from('annonces-images')
          .upload(filePath, decode(base64), { contentType });

        if (error) {
          console.error('Error uploading image:', error);
          continue;
        }

        if (data) {
          uploadedImageUrls.push(data.path);
        }
      }

      return uploadedImageUrls;
    } catch (error) {
      console.error('An error occurred while processing the images:', error);
      return [];
    }
  }

  const windowWidth = Dimensions.get('window').width;

  return (
    <View style={styles.container}>
      <ScrollView>
        <Stack.Screen options={{ title: isUpdating ? 'UpdateAnnonce' : 'Create Annonce' }} />

        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {formData.imageUrls.map((imageUrl, index) => (
            <Image
              key={index}
              source={{ uri: imageUrl }}
              style={{ width: windowWidth, height: 200 }}
              resizeMode="contain"
            />
          ))}
        </ScrollView>

        <TouchableOpacity onPress={pickImage} style={styles.fab}>
          <Ionicons name="camera-outline" size={30} color={'#fff'} />
        </TouchableOpacity>

        <Text style={styles.label}>Titre</Text>
        <TextInput
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="Name"
          style={styles.input}
        />

        <Text style={styles.label}>Prix (fcfa)</Text>
        <TextInput
          value={formData.regularPrice.toString()}
          onChangeText={(text) => setFormData({ ...formData, regularPrice: parseFloat(text) })}
          placeholder="Prix"
          style={styles.input}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          placeholder="Description"
          style={styles.input}
          multiline
        />

        <Text style={styles.label}>Quartier</Text>
        <TextInput
          value={formData.address}
          onChangeText={(text) => setFormData({ ...formData, address: text })}
          placeholder="Quartier"
          style={styles.input}
        />

        <Text style={styles.label}>Chambre</Text>
        <TextInput
          value={formData.bathrooms.toString()}
          onChangeText={(text) => setFormData({ ...formData, bathrooms: parseInt(text) })}
          placeholder="Chambre"
          style={styles.input}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Salon</Text>
        <TextInput
          value={formData.bedrooms.toString()}
          onChangeText={(text) => setFormData({ ...formData, bedrooms: parseInt(text) })}
          placeholder="Salon"
          style={styles.input}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Garage</Text>
        <Switch
          value={formData.parking}
          onValueChange={(value) => setFormData({ ...formData, parking: value })}
        />

        <Text style={styles.label}>Type</Text>
        <TextInput
          value={formData.type}
          onChangeText={(text) => setFormData({ ...formData, type: text })}
          placeholder="Type"
          style={styles.input}
        />

        <Button text={isUpdating ? 'Update' : 'Create'} onPress={onSubmit} />

        {isUpdating && (
          <Button text="Delete" onPress={confirmDelete} type="delete" />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0080FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CreateProductScreen;
