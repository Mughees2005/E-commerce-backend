function orderConfirmationTemplate(orderData) {
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
<td style="background:#16a34a;padding:16px;text-align:center;">
<h2 style="margin:0;color:#ffffff;font-size:26px;font-weight:600;">
Order Confirmed
</h2>
</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:30px;">

<p style="margin-top:0;font-size:15px;color:#555;">
Dear <b>${orderData.customer_name}</b>,
</p>

<p style="font-size:15px;color:#555;line-height:1.6;">
Thank you for your order. We've received it successfully and will begin processing it shortly.
</p>

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
Payment Method
</td>

<td style="border:1px solid #dcdcdc;">
Cash on Delivery
</td>
</tr>

<tr>
<td style="background:#f8f9fa;font-weight:600;border:1px solid #dcdcdc;">
Delivery Address
</td>

<td style="border:1px solid #dcdcdc;">
${orderData.customer_address}
</td>
</tr>

</table>

<h3 style="margin-top:30px;margin-bottom:15px;color:#333;">
Order Items
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

<p style="margin-top:35px;font-size:15px;color:#555;line-height:1.6;">
Our team will review your order and prepare it for delivery. Please keep your phone available in case we need to contact you.
</p>

<p style="font-size:15px;color:#555;">
Thank you for choosing Paper Register. We appreciate your trust and look forward to serving you again.
</p>

</td>
</tr>

<tr>
<td style="background:#f8f9fa;padding:16px;text-align:center;font-size:13px;color:#777;">
Paper Register
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

module.exports = orderConfirmationTemplate;