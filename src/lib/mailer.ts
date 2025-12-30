import nodemailer from "nodemailer";

type OwnerOrderEmail = {
  orderId: number;
  productId: number;
  qty: number;
  unitPrice: number;
  total: number;

  fullName: string;
  phone: string;
  city: string;
  address: string;
};

export async function sendOwnerOrderEmail(data: OwnerOrderEmail) {
  const OWNER_EMAIL = process.env.OWNER_EMAIL;
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASS = process.env.SMTP_PASS;

  // Si no está configurado, no rompas el checkout
  if (!OWNER_EMAIL || !SMTP_USER || !SMTP_PASS) {
    console.warn("[mailer] Missing env vars. Skipping email.");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const subject = `✅ Nueva venta • ${data.qty} und • $${data.total.toLocaleString()}`;

  const html = `
  <div style="font-family:Arial,sans-serif;line-height:1.5">
    <h2>Nueva compra en tu landing ✅</h2>

    <p><b>Order ID:</b> ${data.orderId}</p>
    <p><b>Producto ID:</b> ${data.productId}</p>
    <p><b>Cantidad:</b> ${data.qty}</p>
    <p><b>Precio unitario:</b> $${data.unitPrice.toLocaleString()}</p>
    <p><b>Total:</b> <span style="font-size:16px"><b>$${data.total.toLocaleString()}</b></span></p>

    <hr />

    <h3>Datos del cliente</h3>
    <p><b>Nombre:</b> ${data.fullName}</p>
    <p><b>Teléfono:</b> ${data.phone}</p>
    <p><b>Ciudad:</b> ${data.city}</p>
    <p><b>Dirección:</b> ${data.address}</p>

    <hr />
    <p style="color:#666;font-size:12px">Enviado automáticamente desde tu landing.</p>
  </div>`;

  await transporter.sendMail({
    from: `"BIOSETA • Ventas" <${SMTP_USER}>`,
    to: OWNER_EMAIL,
    subject,
    html,
  });
}
