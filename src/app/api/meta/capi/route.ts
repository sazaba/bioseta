import { NextResponse } from "next/server";
import crypto from "crypto";

function sha256(value?: string | null) {
  if (!value) return undefined;
  return crypto
    .createHash("sha256")
    .update(value.trim().toLowerCase())
    .digest("hex");
}

// ✅ Para preflight (evita 405 en algunos navegadores)
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}

export async function POST(req: Request) {
  const pixelId = process.env.META_PIXEL_ID;
  const token = process.env.META_CAPI_TOKEN;

  if (!pixelId || !token) {
    return NextResponse.json(
      { ok: false, error: "Missing META_PIXEL_ID or META_CAPI_TOKEN" },
      { status: 500 }
    );
  }

  const body = await req.json();

  const {
    event_name,
    event_id,
    event_source_url,
    user = {},
    custom_data = {},
    fbp,
    fbc,
    client_user_agent,
    client_ip_address,
    test_event_code, // lo recibimos del cliente pero NO va en el payload
  } = body;

  // ✅ Autocompleta IP/UA desde el request si no vienen
  const ua = req.headers.get("user-agent") || undefined;
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined;

  // ✅ Payload SIN test_event_code (lo mandamos por querystring)
  const payload = {
    data: [
      {
        event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id,
        action_source: "website",
        event_source_url,
        user_data: {
          em: user.email ? [sha256(user.email)] : undefined,
          ph: user.phone ? [sha256(user.phone)] : undefined,
          fbp: fbp || undefined,
          fbc: fbc || undefined,
          client_user_agent: client_user_agent || ua,
          client_ip_address: client_ip_address || ip,
        },
        custom_data,
      },
    ],
  };

  // limpia undefined
  (payload.data[0] as any).user_data = Object.fromEntries(
    Object.entries((payload.data[0] as any).user_data).filter(
      ([, v]) => v !== undefined
    )
  );

  // ✅ test_event_code por query string (evita "Invalid parameter")
  const url =
    `https://graph.facebook.com/v20.0/${pixelId}/events?access_token=${token}` +
    (test_event_code
      ? `&test_event_code=${encodeURIComponent(String(test_event_code))}`
      : "");

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  return NextResponse.json({ ok: res.ok, meta: json });
}
