import { Database } from './database.types';

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

  export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T];

// export type Product = {
//   id: number;
//   image: string | null;
//   name: string;
//   price: number;
// };



export type CartItem = {
  id: string;
  
  annonce: annonce;
  annonce_id: number;
  
  quantity: number;
};

export type annonce ={
  name: string;
  description: string;
  address: string;
  regularPrice: number;
  
  bathrooms: number;
  bedrooms: number;
 
  parking: boolean;
  type: string;

  imageUrls: string[];
};


export const OrderStatusList: OrderStatus[] = [
  'New',
  'Cooking',
  'Delivering',
  'Delivered',
];

export type OrderStatus = 'New' | 'Cooking' | 'Delivering' | 'Delivered';

export type Order = {
  id: number;
  created_at: string;
  total: number;
  user_id: string;
  status: OrderStatus;

  order_items?: OrderItem[];
};

export type OrderItem = {
  id: number;
  annonce_id: number;
  annonce: annonce;
  order_id: number;
 
  quantity: number;
};

