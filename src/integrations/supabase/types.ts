export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          class_name: string
          content: string
          created_at: string
          id: string
          teacher_mobile: string
          teacher_name: string
          title: string
          type: Database["public"]["Enums"]["announcement_type"]
        }
        Insert: {
          class_name?: string
          content: string
          created_at?: string
          id?: string
          teacher_mobile: string
          teacher_name?: string
          title: string
          type?: Database["public"]["Enums"]["announcement_type"]
        }
        Update: {
          class_name?: string
          content?: string
          created_at?: string
          id?: string
          teacher_mobile?: string
          teacher_name?: string
          title?: string
          type?: Database["public"]["Enums"]["announcement_type"]
        }
        Relationships: []
      }
      attendance: {
        Row: {
          created_at: string
          date: string
          id: string
          marked_by: string
          status: string
          student_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          marked_by?: string
          status?: string
          student_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          marked_by?: string
          status?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_photos: {
        Row: {
          category: Database["public"]["Enums"]["gallery_category"]
          created_at: string
          description: string | null
          file_path: string
          id: string
          title: string | null
          uploaded_by: string | null
          url: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["gallery_category"]
          created_at?: string
          description?: string | null
          file_path: string
          id?: string
          title?: string | null
          uploaded_by?: string | null
          url: string
        }
        Update: {
          category?: Database["public"]["Enums"]["gallery_category"]
          created_at?: string
          description?: string | null
          file_path?: string
          id?: string
          title?: string | null
          uploaded_by?: string | null
          url?: string
        }
        Relationships: []
      }
      help_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          active_whatsapp: string | null
          class_name: string
          created_at: string
          father_name: string | null
          id: string
          mother_name: string | null
          primary_mobile: string | null
          register_number: string
          secondary_mobile: string | null
          student_name: string
        }
        Insert: {
          active_whatsapp?: string | null
          class_name: string
          created_at?: string
          father_name?: string | null
          id?: string
          mother_name?: string | null
          primary_mobile?: string | null
          register_number: string
          secondary_mobile?: string | null
          student_name: string
        }
        Update: {
          active_whatsapp?: string | null
          class_name?: string
          created_at?: string
          father_name?: string | null
          id?: string
          mother_name?: string | null
          primary_mobile?: string | null
          register_number?: string
          secondary_mobile?: string | null
          student_name?: string
        }
        Relationships: []
      }
      teachers: {
        Row: {
          class_assigned: string
          created_at: string
          id: string
          mobile: string
          name: string
          subject: string
        }
        Insert: {
          class_assigned?: string
          created_at?: string
          id?: string
          mobile: string
          name: string
          subject?: string
        }
        Update: {
          class_assigned?: string
          created_at?: string
          id?: string
          mobile?: string
          name?: string
          subject?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_hardcoded_admin: { Args: never; Returns: boolean }
      set_active_whatsapp: {
        Args: { p_active_whatsapp: string; p_register_number: string }
        Returns: undefined
      }
    }
    Enums: {
      announcement_type: "daily" | "subject_update" | "general"
      app_role: "admin" | "moderator" | "user"
      gallery_category:
        | "events"
        | "sports"
        | "cultural"
        | "academics"
        | "celebrations"
        | "campus"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      announcement_type: ["daily", "subject_update", "general"],
      app_role: ["admin", "moderator", "user"],
      gallery_category: [
        "events",
        "sports",
        "cultural",
        "academics",
        "celebrations",
        "campus",
      ],
    },
  },
} as const
