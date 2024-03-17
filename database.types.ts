export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      order_items: {
        Row: {
          created_at: string
          id: number
          order_id: number
          annonce_id: number
          quantity: number
          
        }
        Insert: {
          created_at?: string
          id?: number
          order_id: number
          annonce_id: number
          quantity?: number

        }
        Update: {
          created_at?: string
          id?: number
          order_id?: number
          annonce_id?: number
          quantity?: number
         
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_annonce_id_fkey"
            columns: ["annonce_id"]
            referencedRelation: "annonce"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: number
          status: string
          total: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          status?: string
          total?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          status?: string
          total?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      annonce: {
        Row: {
          created_at: string
          id: number
          name: string
          description: string
          address: string
          regularPrice: number
          discountPrice: number
          bathrooms: number
          bedrooms: number
          furnished: boolean
          parking: boolean
          type: string
          offer: string
          imageUrls: string[]
          
          
          
        }
        Insert: {
          created_at?: string
          id?: number
         
          name: string
          description: string
          address: string
          regularPrice: number
          discountPrice: number
          bathrooms: number
          bedrooms: number
          furnished: boolean
          parking: boolean
          type: string
          offer: string
          imageUrls: string[]
          image: string 
        }
        Update: {
          created_at: string
          id: number
          name: string
          description: string
          address: string
          regularPrice: number
          discountPrice: number
          bathrooms: number
          bedrooms: number
          furnished: boolean
          parking: boolean
          type: string
          offer: string
          imageUrls: string[]
          image: string 
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          group: string
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          group?: string
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          group?: string
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}