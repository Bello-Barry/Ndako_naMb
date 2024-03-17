import Button from '@/components/Button';
import { defaultPizzaImage } from '@/components/ProductListItem';
import Colors from '@/constants/Colors';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, Alert, Switch, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
  useDeleteAnnonce,
  useInsertAnnonce,
  useAnnonce,
  useUpdateAnnonce,
} from '@/api/annonces';

import * as FileSystem from 'expo-file-system';
import { randomUUID } from 'expo-crypto';
import { supabase } from '@/lib/supabase';
import { decode } from 'base64-arraybuffer';
import { annonce } from '@/types';

const CreateProductScreen = () => {
  const [formData, setFormData] = useState<annonce>({
    name: '',
    description: '',
    address: '',
    regularPrice: 0,
    discountPrice: 0,
    bathrooms: 0,
    bedrooms: 0,
    furnished: false,
    parking: false,
    type: '',
    offer: '',
    imageUrls: [],
  });
  const [name, setName] = useState('');
  const [regularPrice, setRegularPrice] = useState('');
  const [errors, setErrors] = useState('');
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
     {/*
    setFormData(updatingAnnonce.regularPrice.toString());
      setFormData(updatingAnnonce.discountPrice);
      setFormData(updatingAnnonce.address);
      setFormData(updatingAnnonce.description);
      setFormData(updatingAnnonce.bathrooms);
      setFormData(updatingAnnonce.bedrooms);
      setFormData(updatingAnnonce.parking);
      setFormData(updatingAnnonce.type);
      setFormData(updatingAnnonce.imageUrls);
      setFormData(updatingAnnonce.imageUrls);
    */} 
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
      discountPrice: 0,
      furnished: false,
      offer: ''
    };
    setFormData(emptyFormData);
  };

  const validateInput = () => {
    setErrors('');
    if (!name) {
      setErrors('Name is required');
      return false;
    }
    if (!regularPrice) {
      setErrors('Price is required');
      return false;
    }
    if (isNaN(parseFloat(regularPrice))) {
      setErrors('Price is not a number');
      return false;
    }
    return true;
  };

  const onSubmit = () => {
    if (isUpdating) {
      // update
      onUpdate();
    } else {
      onCreate();
    }
  };

  const onCreate = async () => {
    if (!validateInput()) {
      return;
    }

    const imagePath = await uploadImage();

    // Save in the database
    {/*name, regularPrice: parseFloat(regularPrice), image: imagePath*/}
    insertAnnonce(
      {...formData, imageUrls: [imagePath]  },
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

    const imagePath = await uploadImage();
     {/* id, name, regularPrice: parseFloat(regularPrice), image: imagePath*/ }

    updateAnnonce(
     
      {...formData, imageUrls: [imagePath]},
      {
        onSuccess: () => {
          resetFields();
          router.back();
        },
      }
    );
  };

  {/*const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData.imageUrls(result.assets[0].uri);
    }
  };*/}
  const pickImage = async () => {
    // Aucune demande d'autorisation n'est nécessaire pour lancer la bibliothèque d'images
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    {/*if (!result.canceled && result.assets && result.assets.length > 0) {
      // Mettez à jour l'état de l'imageUrls avec l'URI de l'image sélectionnée
      setFormData((prevData) => ({
        ...prevData,
        imageUrls: [result.assets[0].uri], // Utilisez un tableau pour stocker l'URI
      }));*/}
      const firstImageUrl = result?.assets?.[0]?.uri;

      if (firstImageUrl?.startsWith('file://')) {
        // Mettez à jour l'état de imageUrls avec l'URI de l'image sélectionnée
        setFormData((prevData) => ({
          ...prevData,
          imageUrls: [firstImageUrl], // Utilisez un tableau pour stocker l'URI
        }));
      } else {
        console.error('Aucune image sélectionnée ou URL invalide.');
        // Gérez le cas où aucune image n'a été sélectionnée ou si l'URL est invalide.
      }
    }
  
  

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
      {
        text: 'Cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: onDelete,
      },
    ]);
  };



  async function uploadImage(): Promise<string | undefined> {
    const imageUrls = formData.imageUrls; // Assuming formData is defined elsewhere
  
    if (!Array.isArray(imageUrls)) {
      console.error('imageUrls should be an array of strings.');
      return;
    }
  
    const firstImageUrl = imageUrls[0]; // Get the first URL (you can adjust this as needed)
  
    if (!firstImageUrl?.startsWith('file://')) {
      console.error('Invalid image URL. It should start with "file://".');
      return;
    }
  
    try {
      const base64 = await FileSystem.readAsStringAsync(firstImageUrl, {
        encoding: 'base64',
      });
  
      const filePath = `${randomUUID()}.png`;
      const contentType = 'image/png';
  
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, decode(base64), { contentType });
  
      if (error) {
        console.error('Error uploading image:', error);
        return;
      }
  
      if (data) {
        return data.path;
      }
    } catch (error) {
      console.error('An error occurred while processing the image:', error);
    }
  
    return undefined;
  }
  

  {/*async function uploadImage(): Promise<string | undefined>{
    const imageUrls=formData.imageUrls
    if (!imageUrls?.startsWith('file://')) {
      return;
    }

    const base64 = await FileSystem.readAsStringAsync(imageUrls, {
      encoding: 'base64',
    });
    const filePath = `${randomUUID()}.png`;
    const contentType = 'image/png';

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, decode(base64), { contentType });

    console.log(error);

    if (data) {
      return data.path;
    }
  };*/}
  

  return (
    <View style={styles.container}>
       <ScrollView>
      <Stack.Screen
    options={{ title: isUpdating ? 'UpdateAnnonce' : 'Create Annonce' }}
  />

  <Image
    source={{ uri: formData.imageUrls[0] || formData.imageUrls[0] }}
    style={styles.image}
  />
  <Text onPress={pickImage} style={styles.textButton}>
    Select Image
  </Text>

  <Text style={styles.label}>titre</Text>
  <TextInput
    value={formData.name}
    onChangeText={(text) => setFormData({ ...formData, name: text })}
    placeholder="Name"
    style={styles.input}
  />

  <Text style={styles.label}>Prix (fcfa)</Text>
  <TextInput
    value={formData.regularPrice.toString()}
    onChangeText={(text) =>
      setFormData({ ...formData, regularPrice: parseFloat(text) })
    }
    placeholder={formData.regularPrice.toString()}
    style={styles.input}
    keyboardType="numeric"
  />
    

    <Text style={styles.label}>description</Text>
      <TextInput
  value={formData.description}
  onChangeText={(text) => setFormData({ ...formData, description: text })}
  placeholder="Description"
  style={styles.input}
  multiline
/>

<Text style={styles.label}>quartier</Text>
<TextInput
  value={formData.address}
  onChangeText={(text) => setFormData({ ...formData, address: text })}
  placeholder="Quartier"
  style={styles.input}
/>


<Text style={styles.label}>chambre</Text>
<TextInput
  value={formData.bathrooms.toString()}
  onChangeText={(text) =>
    setFormData({ ...formData, bathrooms: parseInt(text) })
  }
  placeholder={formData.bathrooms.toString()}
  style={styles.input}
  keyboardType="numeric"
/>

<Text style={styles.label}>salon</Text>
<TextInput
  value={formData.bedrooms.toString()}
  onChangeText={(text) =>
    setFormData({ ...formData, bedrooms: parseInt(text) })
  }
  placeholder={formData.bedrooms.toString()}
  style={styles.input}
  keyboardType="numeric"
/>


<Text style={styles.label}>parking</Text>
<Switch
  value={formData.parking}
  onValueChange={(value) => setFormData({ ...formData, parking: value })}
/>

<Text style={styles.label}>types</Text>
<TextInput
  value={formData.type}
  onChangeText={(text) => setFormData({ ...formData, type: text })}
  placeholder="vendre ou louer"
  style={styles.input}
/>



      <Text style={{ color: 'red' }}>{errors}</Text>
      <Button onPress={onSubmit} text={isUpdating ? 'Update' : 'Create'} />
      {isUpdating && (
        <Text onPress={confirmDelete} style={styles.textButton}>
          Delete
        </Text>
      )}
      </ScrollView>
    </View>
  );
};

export default CreateProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  image: {
    width: '50%',
    aspectRatio: 1,
    alignSelf: 'center',
  },
  textButton: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginVertical: 10,
  },

  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 20,
  },
  label: {
    color: 'gray',
    fontSize: 16,
  },
});