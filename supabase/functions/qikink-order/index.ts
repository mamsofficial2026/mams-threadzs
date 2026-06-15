import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { orderDetails } = await req.json()
    console.log("1. Received Data:", orderDetails);

    // 🔑 Hardcoded Sandbox Keys
    const clientId = "894261266877758" 
    const clientSecret = "a219a65c5fc34b88741c800f1a56ff478b74eea8111b0cfbd7f10356b5ebce1b"

    // --- STEP 1: GET TOKEN ---
    const tokenParams = new URLSearchParams();
    tokenParams.append('ClientId', clientId); 
    tokenParams.append('client_secret', clientSecret);

    const tokenResponse = await fetch('https://sandbox.qikink.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenParams.toString()
    })

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.Accesstoken || tokenData.access_token; // Handling both cases

    if (!tokenResponse.ok || !accessToken) {
      throw new Error(`Auth Failed. Error: ${JSON.stringify(tokenData)}`)
    }

    // --- STEP 2: PUSH ORDER ---
    
    // 🚨 BRUTE-FORCE FIX: Adding keys in exact format expected by PHP
    const qikinkOrderPayload = {
      ClientId: clientId,
      Accesstoken: accessToken,
      access_token: accessToken, // Added just in case
      order_number: `ORD-${Date.now()}`, 
      qikink_shipping: 1,
      gateway: "Prepaid", 
      total_order_value: 449,
      search_from_my_products: 1, 
      shipping_address: {
        first_name: orderDetails.first_name || "Madhavan",
        last_name: "Puppy",
        address1: orderDetails.address1 || "Solai Alagupuram 1st Street",
        address2: "Mahalakshmi Kovil",
        Phone: orderDetails.phone || "9043241335",
        email: "contact@threadzs.in",
        city: orderDetails.city || "Madurai",
        zip: orderDetails.zip || "625011",
        province: "Tamil Nadu",
        country_code: "IN"
      },
      line_items: orderDetails.items && orderDetails.items.length > 0 ? orderDetails.items : [
        { sku: "dummy-test-sku", quantity: 1 } // Fallback testing SKU
      ]
    };

    const orderResponse = await fetch('https://sandbox.qikink.com/api/order/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'ClientId': clientId,            // Passing in header too
        'Accesstoken': accessToken       // Passing in header too
      },
      body: JSON.stringify(qikinkOrderPayload) 
    })

    const orderResult = await orderResponse.json()

    if (!orderResponse.ok) {
       throw new Error(`Order Push Failed: ${JSON.stringify(orderResult)}`)
    }

    return new Response(
      JSON.stringify({ success: true, message: "Order Sent!", data: orderResult }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    console.error("❌ BACKEND ERROR CAUGHT:", error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})