import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';

// Création d'une instance de QueryClient avec des options de configuration
const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Désactive le rechargement des données au focus de la fenêtre
      retry: false, // Désactive la répétition des requêtes en cas d'échec
      // Ajoutez d'autres options par défaut ici
    },
  },
});

export default function QueryProvider({ children }: PropsWithChildren) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
