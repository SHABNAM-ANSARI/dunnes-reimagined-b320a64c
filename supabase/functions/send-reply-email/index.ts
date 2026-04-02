import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

interface ReplyRequest {
  to_email: string;
  to_name: string;
  subject: string;
  original_message: string;
  reply_message: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify admin authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user: authUser }, error: userError } = await supabase.auth.getUser();

    if (userError || !authUser) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Verify admin role
    const userId = authUser.id;
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    const { data: isHardcodedAdmin } = await supabase.rpc("is_hardcoded_admin");

    if (!isAdmin && !isHardcodedAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden: admin access required" }), {
        status: 403,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { to_email, to_name, subject, original_message, reply_message }: ReplyRequest = await req.json();

    console.log("Sending reply to:", to_email);

    const safeName = escapeHtml(to_name);
    const safeSubject = escapeHtml(subject);
    const safeReply = escapeHtml(reply_message).replace(/\n/g, "<br>");
    const safeOriginal = escapeHtml(original_message);

    const emailResponse = await resend.emails.send({
      from: "Dunne's Institute <onboarding@resend.dev>",
      to: [to_email],
      subject: `Re: ${safeSubject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #1e3a5f; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-family: Georgia, serif;">Dunne's Institute</h1>
            <p style="color: #ca8a04; margin: 5px 0 0 0; font-size: 12px;">Opus Vincet Omnia</p>
          </div>
          
          <div style="padding: 30px; background-color: #ffffff;">
            <p style="color: #333;">Dear ${safeName},</p>
            
            <p style="color: #333; line-height: 1.6;">${safeReply}</p>
            
            <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;" />
            
            <p style="color: #666; font-size: 12px;">Your original enquiry:</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-left: 3px solid #1e3a5f; margin: 10px 0;">
              <p style="color: #666; font-size: 13px; margin: 0;"><strong>Subject:</strong> ${safeSubject}</p>
              <p style="color: #666; font-size: 13px; margin: 10px 0 0 0;">${safeOriginal}</p>
            </div>
          </div>
          
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
            <p style="margin: 0;">Dunne's Institute</p>
            <p style="margin: 5px 0;">Admiralty House, Wodehouse Road, Colaba, Mumbai - 400005</p>
            <p style="margin: 5px 0;">Phone: 8527665593 | Email: dunnesschool@gmail.com</p>
          </div>
        </div>
      `,
    });

    console.log("Reply sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending reply:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
