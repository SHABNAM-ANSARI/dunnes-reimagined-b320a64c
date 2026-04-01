import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SiteSettings {
  [key: string]: string;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value");

      if (error) throw error;

      const mapped: SiteSettings = {};
      data?.forEach((row: { key: string; value: string }) => {
        mapped[row.key] = row.value;
      });
      setSettings(mapped);
    } catch (err) {
      console.error("Error fetching site settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const getSetting = (key: string, fallback: string = "") => {
    return settings[key] || fallback;
  };

  return { settings, loading, getSetting, refetch: fetchSettings };
}
