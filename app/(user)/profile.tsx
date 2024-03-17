import Button from '@/components/Button';
import { supabase } from '@/lib/supabase';
import { Link } from 'expo-router';
import { View, Text,  } from 'react-native';



const ProfileScreen = () => {
  return (
    <View>
      <Text>Profile</Text>

      <Button
        text="Sign out"
        onPress={async () => await supabase.auth.signOut()}
      />
       <Link href={'/(admin)/'} asChild>
      <Button text="Admin" />
    </Link>
    </View>
  );
};

export default ProfileScreen;