{/*import { Image, View } from 'react-native';
import React, { ComponentProps, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { FileObject } from '@supabase/storage-js'

type RemoteImageProps = {
  path?: string[] | null;
  fallback: string | FileObject;
} & Omit<ComponentProps<typeof Image>, 'source'>;

const RemoteImage = ({ path, fallback, ...imageProps }: RemoteImageProps) => {
  const [image, setImage] = useState('');

  useEffect(() => {
    if (!path) return;
    (async () => {
      setImage('');
      const { data, error } = await supabase.storage
        .from('annonces-images')
        .download(path);

      if (error) {
        console.log(error);
      }

      if (data) {
        const fr = new FileReader();
        fr.readAsDataURL(data);
        fr.onload = () => {
          setImage(fr.result as string);
        };
      }
    })();
  }, [path]);

  if (!image) {
  }

  
  return (
    <View style={{ flexDirection: 'row', margin: 1, alignItems: 'center', gap: 5 }}>
      {image ? (
        <Image style={{ width: 100, height: 100 }} source={{ uri: image }} />
      ) : (
        <View style={{ width: 100, height: 80, backgroundColor: '#1A1A1A' }} />
      )}
      
    </View>
  )
 
 
};
//<Image source={{ uri: image || fallback }} {...imageProps} />;
export default RemoteImage;*/}
import { Image, View } from 'react-native';
import React, { ComponentProps, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type RemoteImageProps = {
  paths?: string[] | null; // Modifié pour être un tableau de chaînes
  fallback: string;
} & Omit<ComponentProps<typeof Image>, 'source'>;

const RemoteImage = ({ paths, fallback, ...imageProps }: RemoteImageProps) => {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (!paths || paths.length === 0) {
      setImages([fallback]);
      return;
    }
    setImages([]);
    paths.forEach(async (path, index) => {
      // Remplacer les caractères invalides par des underscores
      const sanitizedPath = path.replace(/[^a-zA-Z0-9-_.]/g, '_');
      
      const { data, error } = await supabase.storage
        .from('annonces-images')
        .download(sanitizedPath);
  
      if (error) {
        console.error('Erreur de téléchargement:', error.message);
        setImages(prevImages => [...prevImages, fallback]);
        return;
      }
  
      if (data) {
        const fr = new FileReader();
        fr.readAsDataURL(data);
        fr.onloadend = () => {
          setImages(prevImages => [...prevImages, fr.result as string]);
        };
      }
    });
  }, [paths, fallback]);
  
  return (
    <View style={{ flexDirection: 'row', margin: 1, alignItems: 'center', gap: 5 }}>
      {images.map((img, index) => (
        <Image key={index} source={{ uri: img }} {...imageProps} />
      ))}
    </View>
  );
};

export default RemoteImage;
