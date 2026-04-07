import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const STATIC_CONTEXT = `You are a helpful assistant for Dunne's Institute, a prestigious school in Colaba, Mumbai established in 1949.
Motto: "Opus Vincet Omnia" (Work Conquers All)
ISO 9001:2000 Certified

Campuses:
1. Pre-Primary Section: K. R. Cama Oriental Institute Building, Opp. Lion Gate, Near Kala Ghoda, Mumbai - 400023
2. Primary & Secondary Section: Admiralty House, Wodehouse Road, Colaba, Mumbai - 400005

School Timings: Monday to Saturday, 8:00 AM - 3:00 PM

Mission: To redefine education where learning is a pleasure and every child is encouraged to celebrate it.
Activities offered: Art & Craft, Music & Dance, Sports, Science Club, Literary activities, Computer Education.

Admissions:
- Open for Pre-Primary to Secondary sections
- Parents should contact the school office for admission forms
- Documents required: Birth certificate, previous school records, passport photos

IMPORTANT RULES:
1. Keep ALL responses SHORT and CONCISE — maximum 2-3 sentences per answer. Be direct and to the point.
2. NEVER share the Principal's personal phone number in any response. This is strictly private. If asked for the Principal's number, say "Please contact the school office for the Principal's details."
3. For contact info, only share the school office number and email.
4. If you don't know specific details, suggest parents contact the school directly.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Fetch dynamic settings from site_settings table
    let dynamicContext = "";
    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
      const sb = createClient(supabaseUrl, supabaseKey);
      const { data } = await sb.from("site_settings").select("key, value");
      if (data && data.length > 0) {
        const settings: Record<string, string> = {};
        data.forEach((row: { key: string; value: string }) => {
          settings[row.key] = row.value;
        });
        dynamicContext = `\n\nCurrent Contact Information (USE THESE, they are the latest):
- Principal Name: ${settings["principal_name"] || "Mrs. Kiran Singh"} (DO NOT share her phone number)
- School Office Phone: ${settings["contact_phone_1"] || "+91 7020981168"}
- Email: ${settings["contact_email"] || "dunnesschool@gmail.com"}
- Address: ${settings["school_address"] || "Admiralty House, Wodehouse Road, Colaba, Mumbai - 05"}
- Education Advisor: ${settings["education_advisor"] || "Mr. Shahbehram Khushrushahi"}
- Fees Info: ${settings["school_fees_info"] || "Please contact the school office for detailed fee structure."}
REMINDER: NEVER reveal the Principal's personal phone number. Keep answers short (2-3 sentences max).`;
      }
    } catch (e) {
      console.error("Error fetching site settings for chatbot:", e);
    }

    const SCHOOL_CONTEXT = STATIC_CONTEXT + dynamicContext;

    console.log("Received chat request with", messages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SCHOOL_CONTEXT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
