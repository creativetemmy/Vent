export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      farcaster_users: {
        Row: {
          avatar_url: string | null
          connected_at: string | null
          did: string | null
          display_name: string | null
          fid: number
          id: string
          last_reset: string | null
          points: number | null
          user_id: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          connected_at?: string | null
          did?: string | null
          display_name?: string | null
          fid: number
          id?: string
          last_reset?: string | null
          points?: number | null
          user_id?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          connected_at?: string | null
          did?: string | null
          display_name?: string | null
          fid?: number
          id?: string
          last_reset?: string | null
          points?: number | null
          user_id?: string | null
          username?: string
        }
        Relationships: []
      }
      points_history: {
        Row: {
          action: string
          created_at: string | null
          description: string | null
          id: string
          points: number
          tx_hash: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          description?: string | null
          id?: string
          points: number
          tx_hash?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          description?: string | null
          id?: string
          points?: number
          tx_hash?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          ens_name: string | null
          id: string
          is_verified: boolean | null
          points: number | null
          updated_at: string | null
          wallet_address: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          ens_name?: string | null
          id: string
          is_verified?: boolean | null
          points?: number | null
          updated_at?: string | null
          wallet_address?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          ens_name?: string | null
          id?: string
          is_verified?: boolean | null
          points?: number | null
          updated_at?: string | null
          wallet_address?: string | null
        }
        Relationships: []
      }
      user_votes: {
        Row: {
          created_at: string | null
          id: string
          user_id: string
          vent_id: string
          vote_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id: string
          vent_id: string
          vote_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string
          vent_id?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_votes_vent_id_fkey"
            columns: ["vent_id"]
            isOneToOne: false
            referencedRelation: "vents"
            referencedColumns: ["id"]
          },
        ]
      }
      vents: {
        Row: {
          content: string
          content_hash: string | null
          created_at: string | null
          downvotes: number | null
          evidence: string | null
          hashtags: string[] | null
          id: string
          ipfs_cid: string | null
          mentions: string[] | null
          parent_id: string | null
          tx_hash: string | null
          upvotes: number | null
          user_id: string
        }
        Insert: {
          content: string
          content_hash?: string | null
          created_at?: string | null
          downvotes?: number | null
          evidence?: string | null
          hashtags?: string[] | null
          id?: string
          ipfs_cid?: string | null
          mentions?: string[] | null
          parent_id?: string | null
          tx_hash?: string | null
          upvotes?: number | null
          user_id: string
        }
        Update: {
          content?: string
          content_hash?: string | null
          created_at?: string | null
          downvotes?: number | null
          evidence?: string | null
          hashtags?: string[] | null
          id?: string
          ipfs_cid?: string | null
          mentions?: string[] | null
          parent_id?: string | null
          tx_hash?: string | null
          upvotes?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vents_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "vents"
            referencedColumns: ["id"]
          },
        ]
      }
      verified_projects: {
        Row: {
          created_at: string | null
          ens_name: string
          id: string
          logo_url: string | null
          name: string
        }
        Insert: {
          created_at?: string | null
          ens_name: string
          id?: string
          logo_url?: string | null
          name: string
        }
        Update: {
          created_at?: string | null
          ens_name?: string
          id?: string
          logo_url?: string | null
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      upsert_farcaster_user: {
        Args: {
          p_fid: number
          p_username: string
          p_display_name: string
          p_avatar_url: string
          p_did: string
          p_user_id?: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
