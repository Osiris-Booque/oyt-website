import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "POST") {
      const { action, accessToken, calendarId } = await req.json();

      if (action === "connect") {
        const { data: sync, error } = await supabase
          .from("instructor_calendar_sync")
          .upsert({
            instructor_id: user.id,
            calendar_type: "google",
            access_token: accessToken,
            calendar_id: calendarId,
            is_synced: true,
            last_sync_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ sync }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (action === "sync") {
        const { data: syncConfig } = await supabase
          .from("instructor_calendar_sync")
          .select("*")
          .eq("instructor_id", user.id)
          .eq("calendar_type", "google")
          .maybeSingle();

        if (!syncConfig) {
          return new Response(JSON.stringify({ error: "Google Calendar not connected" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        try {
          const calendarResponse = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/${syncConfig.calendar_id}/events`,
            {
              headers: {
                Authorization: `Bearer ${syncConfig.access_token}`,
              },
            }
          );

          if (!calendarResponse.ok) {
            throw new Error("Failed to fetch Google Calendar events");
          }

          const calendarData = await calendarResponse.json();
          const events = calendarData.items || [];

          for (const event of events) {
            const eventStart = event.start?.dateTime || event.start?.date;
            const eventEnd = event.end?.dateTime || event.end?.date;

            if (eventStart && eventEnd) {
              await supabase.from("instructor_unavailable_slots").upsert({
                instructor_id: user.id,
                blocked_start: eventStart,
                blocked_end: eventEnd,
                reason: "synced_event",
                external_event_id: event.id,
              });
            }
          }

          await supabase
            .from("instructor_calendar_sync")
            .update({ last_sync_at: new Date().toISOString() })
            .eq("id", syncConfig.id);

          return new Response(
            JSON.stringify({ success: true, synced_events: events.length }),
            {
              status: 200,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        } catch (err) {
          await supabase
            .from("instructor_calendar_sync")
            .update({ sync_errors: String(err) })
            .eq("id", syncConfig.id);

          return new Response(JSON.stringify({ error: String(err) }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }

      return new Response(JSON.stringify({ error: "Invalid action" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
