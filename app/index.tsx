// Importez les composants nécessaires
import { View, Text, ActivityIndicator, Alert, TextInput } from 'react-native';
import React, { useState } from 'react';
import Button from '@/components/Button';
import { Link, Redirect } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/lib/supabase';
import DemanderCodeAdmin from '@/components/Admincode';




const index = () => {
  const { session, loading, isAdmin } = useAuth();
 

  // Vérifiez la session et le chargement ici (utilisez vos propres méthodes)

  if (loading) {
    return <ActivityIndicator />;
  }

  if (!session) {
    // Rediriger vers la page de connexion
    // <DemanderCodeAdmin/>;
    return <Redirect href={'/sign-in'} />
  }

  if (!isAdmin) {
    // Rediriger vers la page utilisateur
    return <Redirect href={'/(user)'} />;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
    <Link href={'/(user)'} asChild>
      <Button text="User" />
    </Link>
    <Link href={'/(admin)'} asChild>
      <Button text="Admin" />
    </Link>

    <Button onPress={() => supabase.auth.signOut()} text="Sign out" />
  </View>
);

};

export default index;





{/*

const index = () => {
  const { session, loading, isAdmin } = useAuth();

  if (loading) {
    return <ActivityIndicator />;
  }

  if (!session) {
    return <Redirect href={'/sign-in'} />;
  }

  if (!isAdmin) {
    return <Redirect href={'/(user)'} />;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
      <Link href={'/(user)'} asChild>
        <Button text="User" />
      </Link>
      <Link href={'/(admin)'} asChild>
        <Button text="Admin" />
      </Link>

      <Button onPress={() => supabase.auth.signOut()} text="Sign out" />
    </View>
  );
};

export default index;*/}
