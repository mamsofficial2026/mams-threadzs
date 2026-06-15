from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import time

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class OrderRequest(BaseModel):
    orderDetails: dict

@app.post("/api/qikink-order")
def push_to_qikink(req: OrderRequest):
    order_data = req.orderDetails
    print(f"1. Received Order: {order_data.get('order_id')}")

    client_id = "894261266877758"
    client_secret = "a219a65c5fc34b88741c800f1a56ff478b74eea8111b0cfbd7f10356b5ebce1b"

    # --- STEP 1: GET TOKEN ---
    print("2. Requesting Token...")
    token_res = requests.post(
        "https://sandbox.qikink.com/api/token", 
        data={'ClientId': client_id, 'client_secret': client_secret}
    )
    
    if token_res.status_code != 200:
        raise HTTPException(status_code=400, detail=f"Token Failed: {token_res.text}")
        
    token_json = token_res.json()
    access_token = token_json.get('Accesstoken') or token_json.get('access_token')
    
    if not access_token:
        raise HTTPException(status_code=400, detail="Token not found in response")

    # --- STEP 2: PUSH ORDER ---
    order_url = "https://sandbox.qikink.com/api/order/create"
    
    # Auth in Headers ONLY
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}",
        "ClientId": client_id,
        "client_id": client_id,
        "Accesstoken": access_token,
        "access_token": access_token
    }

    # Format items
    incoming_items = order_data.get('items', [])
    line_items = []
    for item in incoming_items:
        line_items.append({
            "sku": item.get("sku", "v-9Rmg3yKEaVZW0sELNBQoubTRrQva9neZ"),
            "quantity": item.get("quantity", 1)
        })

    if not line_items:
        line_items = [{"sku": "v-9Rmg3yKEaVZW0sELNBQoubTRrQva9neZ", "quantity": 1}]

    # 🔥 FIX: Generate a short order ID strictly under 15 characters
    # Example: "TZ-12345678" (11 characters total)
    short_order_id = f"TZ-{str(int(time.time()))[-8:]}"

    # Clean Payload
    qikink_payload = {
        "order_number": short_order_id, 
        "qikink_shipping": 1,
        "gateway": "Prepaid", 
        "total_order_value": 449,
        "shipping_address": {
            "first_name": order_data.get('first_name', 'Customer'),
            "last_name": "",
            "address1": order_data.get('address1', 'Test Address'),
            "address2": "",
            "phone": order_data.get('phone', '9043241335'),
            "email": "contact@threadzs.in",
            "city": order_data.get('city', 'Madurai'),
            "zip": str(order_data.get('zip', '625011')),
            "province": "Tamil Nadu",
            "country_code": "IN"
        },
        "line_items": line_items
    }

    print("3. Sending Clean Order Payload to Qikink...")
    order_res = requests.post(order_url, json=qikink_payload, headers=headers)
    
    print(f"4. Qikink Response Code: {order_res.status_code}")
    print(f"5. Qikink Response Body: {order_res.text}")

    if order_res.status_code != 200:
        raise HTTPException(status_code=400, detail=f"Order Push Failed: {order_res.text}")

    return {"success": True, "message": "Order sent!", "data": order_res.json()}