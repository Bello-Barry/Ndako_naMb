// types/env.d.ts
declare module '@env' {
    export const SUPABASE_URL: string= process.env.EXPO_PUBLIC_SUPABASE_URL || '';
    export const SUPABASE_ANON_KEY: string= process.env.EXPO_PUBLIC_SUPABASE_ANON || '';
    // Autres variables d'environnement
}