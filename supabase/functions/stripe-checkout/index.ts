import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

function json(body: object, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: corsHeaders });
    }

    if (req.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405);
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'Missing authorization header' }, 401);

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return json({ error: 'Unauthorized' }, 401);
    }

    const { paymentMethodId, amount, programId } = await req.json();

    if (!paymentMethodId || !amount || !programId) {
      return json({ error: 'Missing required fields: paymentMethodId, amount, programId' }, 400);
    }

    const { data: program } = await supabase
      .from('programs')
      .select('id, title')
      .eq('id', programId)
      .maybeSingle();

    if (!program) {
      return json({ error: 'Program not found' }, 404);
    }

    const { data: existingPayment } = await supabase
      .from('payments')
      .select('id')
      .eq('user_id', user.id)
      .eq('program_id', programId)
      .eq('status', 'paid')
      .maybeSingle();

    if (existingPayment) {
      return json({ error: 'Already enrolled in this program' }, 409);
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: false,
      },
      metadata: {
        userId: user.id,
        programId,
      },
    });

    if (paymentIntent.status !== 'succeeded') {
      return json({ error: `Payment failed with status: ${paymentIntent.status}` }, 402);
    }

    const { error: paymentInsertError } = await supabase.from('payments').insert({
      user_id: user.id,
      program_id: programId,
      stripe_payment_intent_id: paymentIntent.id,
      amount,
      status: 'paid',
    });

    if (paymentInsertError) {
      console.error('Failed to record payment:', paymentInsertError);
      return json({ error: 'Payment succeeded but failed to record. Please contact support.' }, 500);
    }

    return json({ success: true, paymentIntentId: paymentIntent.id });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    const message =
      typeof err === 'object' && err !== null && 'raw' in err && typeof (err as { raw?: { message?: string } }).raw?.message === 'string'
        ? (err as { raw?: { message?: string } }).raw?.message
        : errorMessage;
    console.error('Stripe checkout error:', errorMessage);
    return json({ error: message }, 500);
  }
});
