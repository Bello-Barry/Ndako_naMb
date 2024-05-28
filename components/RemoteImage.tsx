import { Image, View, StyleSheet } from 'react-native';
import React, { ComponentProps, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type RemoteImageProps = {
  paths?: string[] | null;
  fallback: string;
} & Omit<ComponentProps<typeof Image>, 'source'>;

const RemoteImage = ({ paths, fallback, ...imageProps }: RemoteImageProps) => {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const loadImages = async () => {
      if (!paths || paths.length === 0) {
        setImages([fallback]);
        return;
      }

      const imagePromises = paths.slice(0, 6).map(async (path) => {
        // Remplacer les caractères invalides par des underscores
        const sanitizedPath = path.replace(/[^a-zA-Z0-9-_.]/g, '_');

        const { data, error } = await supabase.storage
          .from('annonces-images')
          .download(sanitizedPath);

        if (error) {
          console.error('Erreur de téléchargement:', error.message);
          return fallback;
        }

        if (data) {
          const fr = new FileReader();
          fr.readAsDataURL(data);
          return new Promise<string>((resolve) => {
            fr.onloadend = () => resolve(fr.result as string);
          });
        }

        return fallback;
      });

      const loadedImages = await Promise.all(imagePromises);
      setImages(loadedImages);
    };

    loadImages();
  }, [paths, fallback]);

  return (
    <View style={styles.imageContainer}>
      {images.map((img, index) => (
        <Image key={index} source={{ uri: img }} style={styles.image} {...imageProps} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Pour permettre plusieurs images sur plusieurs lignes si nécessaire
    margin: 1,
    alignItems: 'center',
    gap: 5,
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
  },
});

export default RemoteImage;
