function newOrderAdminTemplate(orderData) {
    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>

<body style="margin:0;padding:0;background:#f4f6f9;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:40px 0;">
<tr>
<td align="center">

<table width="700" cellpadding="0" cellspacing="0"
style="background:#ffffff;border:1px solid #dcdcdc;border-radius:12px;overflow:hidden;">

<!-- Header -->
<tr>
<td style="background:#2563eb;padding:16px;text-align:center;">
<h2 style="margin:0;color:#ffffff;font-size:26px;font-weight:600;">
New Order Received
</h2>
</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:30px;">

<p style="margin-top:0;margin-bottom:20px;font-size:15px;color:#555;">
A new order has been placed on your store.
</p>

<!-- Order Details -->
<table width="100%" cellpadding="12" cellspacing="0"
style="border-collapse:collapse;border:1px solid #dcdcdc;">

<tr>
<td style="background:#f8f9fa;font-weight:600;border:1px solid #dcdcdc;width:35%;">
Order Number
</td>
<td style="border:1px solid #dcdcdc;font-weight:600;">
${orderData.order_number}
</td>
</tr>

<tr>
<td style="background:#f8f9fa;font-weight:600;border:1px solid #dcdcdc;">
Customer
</td>
<td style="border:1px solid #dcdcdc;">
${orderData.customer_name}
</td>
</tr>

<tr>
<td style="background:#f8f9fa;font-weight:600;border:1px solid #dcdcdc;">
Phone
</td>
<td style="border:1px solid #dcdcdc;">
${orderData.customer_phone}
</td>
</tr>

<tr>
<td style="background:#f8f9fa;font-weight:600;border:1px solid #dcdcdc;">
Address
</td>
<td style="border:1px solid #dcdcdc;">
${orderData.customer_address}
</td>
</tr>

${orderData.notes ? `
<tr>
<td style="background:#f8f9fa;font-weight:600;border:1px solid #dcdcdc;">
Notes
</td>
<td style="border:1px solid #dcdcdc;">
${orderData.notes}
</td>
</tr>
` : ""}

</table>

<h3 style="margin-top:30px;margin-bottom:15px;color:#333;">
Ordered Items
</h3>

<table width="100%" cellpadding="12" cellspacing="0"
style="border-collapse:collapse;border:1px solid #dcdcdc;">

<tr style="background:#f8f9fa;font-weight:600;">
<td style="border:1px solid #dcdcdc;">Product</td>
<td style="border:1px solid #dcdcdc;" align="center">Qty</td>
<td style="border:1px solid #dcdcdc;" align="right">Price</td>
<td style="border:1px solid #dcdcdc;" align="right">Total</td>
</tr>

${orderData.items.map(item => `
<tr>
<td style="border:1px solid #dcdcdc;">
${item.name}
</td>

<td style="border:1px solid #dcdcdc;" align="center">
${item.quantity}
</td>

<td style="border:1px solid #dcdcdc;" align="right">
Rs. ${item.price}
</td>

<td style="border:1px solid #dcdcdc;font-weight:600;" align="right">
Rs. ${Number(item.price) * Number(item.quantity)}
</td>
</tr>
`).join("")}

</table>

<table width="300" align="right" cellpadding="10" cellspacing="0"
style="margin-top:25px;border-collapse:collapse;">

<tr>
<td><b>Subtotal</b></td>
<td align="right">Rs. ${orderData.subtotal}</td>
</tr>

<tr>
<td><b>Shipping</b></td>
<td align="right">Rs. ${orderData.shipping_cost}</td>
</tr>

<tr style="font-size:17px;">
<td><b>Total</b></td>
<td align="right"><b>Rs. ${orderData.total}</b></td>
</tr>

</table>

<div style="clear:both;"></div>

</td>
</tr>

<!-- Footer -->
<tr>
<td style="background:#f8f9fa;padding:16px;text-align:center;font-size:13px;color:#777;">
Paper Register Inventory System
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
}

module.exports = newOrderAdminTemplate;