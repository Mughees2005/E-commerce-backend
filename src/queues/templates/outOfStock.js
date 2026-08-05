function outOfStockTemplate(data) {
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

<table width="600" cellpadding="0" cellspacing="0"
style="background:#ffffff;border:1px solid #dcdcdc;border-radius:12px;overflow:hidden;">

<!-- Header -->
<tr>
<td style="background:#dc2626;padding:16px;text-align:center;">
<h2 style="margin:0;color:#ffffff;font-size:26px;font-weight:600;">
Out of Stock
</h2>
</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:30px;">

<p style="margin-top:0;margin-bottom:20px;font-size:15px;color:#555555;line-height:1.6;">
The following product is now out of stock.
</p>

<table width="100%" cellpadding="12" cellspacing="0"
style="border-collapse:collapse;border:1px solid #dcdcdc;">

<tr>
<td style="background:#f8f9fa;font-weight:600;border:1px solid #dcdcdc;width:45%;">
Product Name
</td>

<td style="border:1px solid #dcdcdc;font-weight:600;">
${data.product_name}
</td>
</tr>

<tr>
<td style="background:#f8f9fa;font-weight:600;border:1px solid #dcdcdc;">
Remaining Stock
</td>

<td style="border:1px solid #dcdcdc;font-weight:600;color:#dc2626;">
0
</td>
</tr>

<tr>
<td style="background:#f8f9fa;font-weight:600;border:1px solid #dcdcdc;">
Status
</td>

<td style="border:1px solid #dcdcdc;font-weight:600;color:#dc2626;">
Out of Stock
</td>
</tr>

</table>

<p style="margin-top:24px;color:#555555;font-size:15px;line-height:1.6;">
This product is no longer available for purchase. Please restock it as soon as possible to prevent order disruptions.
</p>

</td>
</tr>

<!-- Footer -->
<tr>
<td style="background:#f8f9fa;padding:16px;text-align:center;font-size:13px;color:#777777;">
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

module.exports = outOfStockTemplate;