import emailjs from "@emailjs/browser";

// Accept all required data as arguments
export const sendBillEmail = ({ customer, cart, discount, grandTotal, payment }) => {
  if (!customer.email) {
    alert("Please enter customer email!");
    return;
  }

  const subTotal = cart.reduce((sum, item) => sum + item.total, 0);
  const balance = grandTotal - payment.paid;

  const message = `Your bill:
Products: ${cart.map(i => `${i.name} x${i.qty}`).join(", ")}
Subtotal: INR ${subTotal}
Discount: INR ${discount}
Grand Total: INR ${grandTotal}
Paid: INR ${payment.paid}
Balance: INR ${balance}`;

  const emailContent = `
<div style="font-family: system-ui, sans-serif, Arial; font-size: 12px">
  <div>A message by ${customer.name} has been received. Kindly respond at your earliest convenience.</div>
  <div style="margin-top: 20px; padding: 15px 0; border-width: 1px 0; border-style: dashed; border-color: lightgrey;">
    <table role="presentation">
      <tr>
        <td style="vertical-align: top">
          <div style="padding: 6px 10px; margin: 0 10px; background-color: aliceblue; border-radius: 5px; font-size: 26px;" role="img">
            👤
          </div>
        </td>
        <td style="vertical-align: top">
          <div style="color: #2c3e50; font-size: 16px"><strong>${customer.name}</strong></div>
          <div style="color: #cccccc; font-size: 13px">${new Date().toLocaleString()}</div>
          <p style="font-size: 16px">${message}</p>
        </td>
      </tr>
    </table>
  </div>
</div>
`;

  emailjs.send(
    "YOUR_SERVICE_ID",
    "YOUR_TEMPLATE_ID",
    {
      customer_name: customer.name,
      customer_email: customer.email,
      email_html: emailContent
    },
    "YOUR_PUBLIC_KEY"
  )
    .then(() => alert("Email sent successfully!"))
    .catch(err => alert("Failed to send email: " + err.text));
};
