//import ImagePicker from 'react-native-image-crop-picker';

import Button from '@/components/Button';
import { defaultPizzaImage } from '@/components/ProductListItem';
import Colors from '@/constants/Colors';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, Alert,Dimensions, Switch, ScrollView, TouchableOpacity } from 'react-native';
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
import { Ionicons } from '@expo/vector-icons';

const CreateProductScreen = () => {
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
  {/*const [name, setName] = useState('');
  const [regularPrice, setRegularPrice] = useState('');
  const [errors, setErrors] = useState('');*/}
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
      setFormData(formData);
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

    
    };
    setFormData(emptyFormData);
  };

  const validateInput = () => {
    if (!formData.name || !formData.description || !formData.imageUrls|| !formData.address || !formData.regularPrice || !formData.parking || !formData.type) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return false;
    }
    // Add additional validation as needed
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
    const newAnnonce: Omit<annonce, 'id'> = { ...formData  };

    if (imagePath) {
      newAnnonce.imageUrls = [imagePath];
    }
    console.log('formData',formData)
    console.log('formDataimageUrls',formData.imageUrls)
    

  
    insertAnnonce(
      {...formData },
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
     
      {...formData, imageUrls:[imagePath]},
      {
        onSuccess: () => {
          resetFields();
          router.back();
        },
      }
    );
  };


  
{/*const pickImage = async () => {
  try {
    // Lancez ImagePicker pour permettre la sélection multiple
    const images = await ImagePicker.openPicker({
      multiple: true,
      mediaTypes: 'photo',
      // Ajoutez d'autres options ici selon vos besoins
    });

    // 'images' est un tableau contenant les informations de chaque image sélectionnée
    const uris = images.map((image: { path: any; }) => image.path);

    // Mise à jour de l'état avec les nouvelles images
    setFormData(prevData => ({
      ...prevData,
      imageUrls: [...prevData.imageUrls, ...uris] // Ajoutez les URIs au tableau existant
    }));
  } catch (e) {
    console.error(e);
  }
};
*/}

 

const pickImage = async () => {
  let results: string[] = [];
  // Lancez l'ImagePicker pour permettre la sélection multiple
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
    // Ajoutez cette option pour permettre la sélection multiple
    allowsMultipleSelection: true,
    selectionLimit: 6
  });

  if (!result.canceled && result.assets) {
    // Parcourez chaque image sélectionnée et ajoutez son URI au tableau results
    result.assets.forEach((image: { uri: string }) => {
      const uri = image.uri;
      results.push(uri);
    });

    // Mise à jour de l'état avec les nouvelles images
    setFormData((prevData) => ({
      ...prevData,
      imageUrls: [...prevData.imageUrls, ...results] // Ajoutez les URIs au tableau existant
    }));
  }
};



  
  {/*const pickImage = async () => {
    let results = [];
    for (let i = 0; i < 4; i++) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
       
      });
  
      if (!result.canceled && result.assets) {
        // Assurez-vous que result.assets est non-null avant d'accéder à result.assets[0].uri
        const uri = result.assets[0].uri;
        results.push(uri); // Stockez l'URI dans le tableau results
        setFormData((prevData) => ({
          ...prevData,
          imageUrls: [...prevData.imageUrls, uri] // Ajoutez l'URI au tableau existant
        }));
      }
    }
  };*/}
  
      
    
  
  

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

  const submitToSupabase = async () => {
    const imagePath = await uploadImage();
    
    try {
      const { data, error } = await supabase
        .from('annonces') // Remplacez 'annonces' par le nom de votre table
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
            imageUrls: formData.imageUrls,
          },
        ]);
  
      if (error) throw error;
  
      // Gérer la réponse de succès ici
      console.log('Données soumises avec succès :', data);
    } catch (error) {
      // Gérer l'erreur ici
      console.error('Erreur lors de la soumission des données :', error);
    }
  };

  async function uploadImage(): Promise<string | undefined> {
    //const imageUrls = formData.imageUrls; // Assuming formData is defined elsewhere
  
    if (!Array.isArray(formData.imageUrls)) {
      console.error('imageUrls should be an array of strings.');
      return;
    }
  
    const firstImageUrl = formData.imageUrls[0]; // Get the first URL (you can adjust this as needed)
  
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
      
      console.log('filePath',filePath)
      // Supprimez la ligne suivante car elle n'est pas nécessaire
      // console.log(' base64',decode(base64))
      const { data, error } = await supabase.storage
        .from('annonces-images')
        .upload(filePath, base64, { contentType }); // Passez la chaîne base64 directement
  
      if (error) {
        console.error('Error uploading image:', error);
        return;
      }
  
      if (data) {
        return data.path;
        console.log(' data',   data)
      }
    } catch (error) {
      console.error('An error occurred while processing the image:', error);
    }
  
    return undefined;
  }
  

  const windowWidth = Dimensions.get('window').width;
  

  return (
    <View style={styles.container}>
       <ScrollView>
      <Stack.Screen
    options={{ title: isUpdating ? 'UpdateAnnonce' : 'Create Annonce' }}
  />

  {/*<Image
    source={{ uri: formData.imageUrls[0] || formData.imageUrls[0] }}
    style={styles.image}
  />*/}
   <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
    >
  {formData.imageUrls.map((imageUrl, index) => (
  <Image
    key={index}
    source={{ uri: imageUrl }}
    style={{ width: windowWidth, height: 200 }}
    resizeMode='contain'
  />
))}
</ScrollView>
  
  <TouchableOpacity onPress={pickImage} style={styles.fab}>
        <Ionicons name="camera-outline" size={30} color={'#fff'} />
      </TouchableOpacity>
  

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



      {/*<Text style={{ color: 'red' }}>{errors}</Text>*/}
      <Button onPress={submitToSupabase} text={isUpdating ? 'Update' : 'Create'} />
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
  fab: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    position: 'absolute',
    bottom: 40,
    right: 30,
    height: 70,
    backgroundColor: '#2b825b',
    borderRadius: 100,
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



//ERROR  Invalid image URL. It should start with "file://".
 //ERROR  An error occurred while processing the image: [SyntaxError: JSON Parse error: Unexpected character ERROR  An error occurred while processing the image: [SyntaxError: JSON Parse error: Unexpected character: e]
