import { View, Text,  Alert, TextInput,StyleSheet } from 'react-native';
import React, { useState } from 'react';
import Button from '@/components/Button';
import { Link, router} from 'expo-router';


const CODE_ADMIN = '0647604'; // Remplacez ceci par votre code admin réel

const DemanderCodeAdmin = () => {
  const [code, setCode] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const verifierCode = () => {
    if (code === CODE_ADMIN) {
      setIsAdmin(true);
      router.push('/(admin)/menu');
    } else {
      Alert.alert('Accès refusé', 'Vous n\'êtes pas un administrateur.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrez le code administrateur:</Text>
      <TextInput
        style={styles.input}
        value={code}
        onChangeText={setCode}
        placeholder="codeAdmin"
      />
      <Button text="Vérifie" onPress={verifierCode} color="#841584" />
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
  },
});

export default DemanderCodeAdmin;