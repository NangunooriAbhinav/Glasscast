export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface FavoriteCity {
  id: string;
  user_id: string;
  city_name: string;
  lat: number;
  lon: number;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at'>>;
      };
      favorite_cities: {
        Row: FavoriteCity;
        Insert: Omit<FavoriteCity, 'id' | 'created_at'>;
        Update: Partial<Omit<FavoriteCity, 'id' | 'created_at'>>;
      };
    };
  };
}