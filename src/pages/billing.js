import React, { useState, useEffect } from "react";
import { sendBillEmail } from "./email";
import "../billing.css";
import Lottie from 'lottie-react';
import billingAnimation from '../Billing.json';




const productsList = [
  { name: "Cow Milk", price: 50 },
  { name: "Buffalo Milk", price: 60 },
  { name: "Toned Milk", price: 40 },
  { name: "Skimmed Milk", price: 45 },
  { name: "Curd", price: 30 },
  { name: "Butter", price: 120 },
];

const generateBillNo = () => {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  const todayKey = `${yyyy}${mm}${dd}`;
  const counterData = JSON.parse(localStorage.getItem("billCounter")) || {};
  const count = (counterData[todayKey] || 0) + 1;

  counterData[todayKey] = count;
  localStorage.setItem("billCounter", JSON.stringify(counterData));

  return `MP-${todayKey}-${String(count).padStart(3, "0")}`;
};

function BillingPage() {
  // ---------------- Customer ----------------
  const [customer, setCustomer] = useState({ name: "", mobile: "", email: "" });
  const [previousDue, setPreviousDue] = useState(0); // previous due amount

  // ---------------- Bill & Cart ----------------
  const [billNo, setBillNo] = useState(generateBillNo());
  const [product, setProduct] = useState(productsList[0].name);
  const [qty, setQty] = useState(1);
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [payment, setPayment] = useState({ mode: "Cash", paid: 0 });

  // ---------------- Date & Time ----------------
  const [dateTime, setDateTime] = useState(new Date().toLocaleString());

  // ---------------- Totals ----------------
  const subTotal = cart.reduce((sum, item) => sum + item.total, 0);
  const grandTotal = subTotal - discount;
  const totalPayable = previousDue + grandTotal;
  const balanceDue = Math.max(0, totalPayable - payment.paid);

  // ---------------- Effects ----------------
  useEffect(() => {
    const savedBill = JSON.parse(localStorage.getItem("billingData"));
    if (savedBill) {
      setCustomer(savedBill.customer);
      setCart(savedBill.cart);
      setDiscount(savedBill.discount);
      setPayment(savedBill.payment);
    }

    const interval = setInterval(() => {
      setDateTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const billingData = { customer, cart, discount, payment };
    localStorage.setItem("billingData", JSON.stringify(billingData));
  }, [customer, cart, discount, payment]);

  // ---------------- Handlers ----------------
  const handleAddProduct = () => {
    if (qty < 1) return;

    const selected = productsList.find(p => p.name === product);
    const existing = cart.find(item => item.name === product);

    if (existing) {
      setCart(
        cart.map(item =>
          item.name === product
            ? {
              ...item,
              qty: item.qty + qty,
              total: (item.qty + qty) * item.price,
            }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        { name: product, qty, price: selected.price, total: qty * selected.price },
      ]);
    }
    setQty(1);
  };

  const handleRemove = name => setCart(cart.filter(item => item.name !== name));

  const handleClearAll = () => {
    setCart([]);
    setCustomer({ name: "", mobile: "", email: "" });
    setDiscount(0);
    setPayment({ mode: "Cash", paid: 0 });
    setPreviousDue(0);
  };

  // ---------------- CUSTOMER MOBILE CHANGE ----------------
  const handleCustomerMobileChange = mobile => {
    setCustomer({ ...customer, mobile });
    if (mobile.length >= 10) {
      const dues = JSON.parse(localStorage.getItem("customerDues")) || {};
      setPreviousDue(dues[mobile] || 0);
    } else {
      setPreviousDue(0);
    }
  };

  // ---------------- SAVE BILL ----------------
  const handleSave = () => {
    if (!customer.name || !customer.mobile || !customer.email) {
      alert("Please enter Customer Name, Mobile and Email");
      return;
    }

    if (cart.length === 0) {
      alert("No products added to bill");
      return;
    }

    const bill = {
      id: billNo,
      customer,
      cart,
      discount,
      subTotal,
      grandTotal,
      previousDue,
      totalPayable,
      payment,
      balanceDue,
      date: dateTime,
    };

    const history = JSON.parse(localStorage.getItem("billHistory")) || [];
    history.push(bill);
    localStorage.setItem("billHistory", JSON.stringify(history));

    // Store updated due for customer
    const dues = JSON.parse(localStorage.getItem("customerDues")) || {};
    dues[customer.mobile] = balanceDue;
    localStorage.setItem("customerDues", JSON.stringify(dues));

    setBillNo(generateBillNo());
    alert(`Bill ${billNo} saved successfully!`);
  };

  // ---------------- WHATSAPP ----------------
  const handleWhatsApp = () => {
    const message = `Hello ${customer.name}, your bill total is INR ${totalPayable}, Balance Due: INR ${balanceDue}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="billing-container">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "15px" }}>
        <Lottie
          animationData={billingAnimation}
          loop
          autoplay
          style={{ width: 80, height: 80, marginTop: "-30px", marginLeft: "-5px" }}
        />
        <h2 className="billing-title">Milk Point Billing</h2>
      </div>

      {/* Bill Info */}
      <div className="card">
        <p><strong>Bill No:</strong> {billNo}</p>
        <p><strong>Date & Time:</strong> {dateTime}</p>

        {(customer.name || customer.mobile || customer.email) && (
          <>
            <p><strong>Name:</strong> {customer.name || "-"}</p>
            <p><strong>Mobile:</strong> {customer.mobile || "-"}</p>
            <p><strong>Email:</strong> {customer.email || "-"}</p>
            {previousDue > 0 && (
              <p style={{ color: "red" }}>Previous Due: INR {previousDue}</p>
            )}
          </>
        )}
      </div>

      {/* Customer Input */}
      <div className="card">
        <div className="form-row">
          <input
            placeholder="Customer Name *"
            value={customer.name}
            required
            onChange={e => setCustomer({ ...customer, name: e.target.value })}
          />
          <input
            placeholder="Mobile Number *"
            value={customer.mobile}
            required
            onChange={e => handleCustomerMobileChange(e.target.value)}
          />
        </div>
        <input
          placeholder="Email *"
          value={customer.email}
          required
          onChange={e => setCustomer({ ...customer, email: e.target.value })}
        />
      </div>

      {/* Product */}
      <div className="card">
        <select value={product} onChange={e => setProduct(e.target.value)}>
          {productsList.map(p => (
            <option key={p.name} value={p.name}>
              {p.name} - INR {p.price}
            </option>
          ))}
        </select>

        <input
          type="number"
          min="1"
          value={qty}
          required
          onChange={e => setQty(Number(e.target.value))}
          style={{ marginLeft: "20px" }}
        />

        <button
          onClick={handleAddProduct}
          style={{ marginLeft: "350px", marginTop: "15px" }}
        >
          Add to Bill
        </button>
      </div>

      {/* Cart */}
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cart.map(item => (
              <tr key={item.name}>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>INR {item.price}</td>
                <td>INR {item.total}</td>
                <td>
                  <button className="danger" onClick={() => handleRemove(item.name)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <input
          type="number"
          placeholder="Discount"
          value={discount}
          onChange={e => setDiscount(Math.max(0, Number(e.target.value)))}
        />

        {/* <p>Sub Total: ₹{subTotal}</p> */}
        <h3 style={{ color: "blue", marginBottom: "5px" }}>Grand Total: INR {grandTotal}</h3>

        {previousDue > 0 && (
          <p style={{ color: "red", fontWeight: "bold" }}>Previous Due: INR {previousDue}</p>
        )}

        <p style={{ fontWeight: "bold", marginBottom: "-5px" }}>Total Payable: INR {totalPayable}</p>
      </div>

      {/* Payment */}
      <div className="card">
        <select
          value={payment.mode}
          onChange={e => setPayment({ ...payment, mode: e.target.value })}
        >
          <option>Cash</option>
          <option>UPI</option>
          <option>Card</option>
        </select>

        <input
          type="number"
          placeholder="Paid Amount"
          value={payment.paid}
          onChange={e => setPayment({ ...payment, paid: Number(e.target.value) })}
          style={{ marginLeft: "25px" }}
        />

        <p style={{ color: "red", fontWeight: "bold" }}>
          Balance Due: INR {balanceDue}
        </p>
      </div>

      {/* Actions */}
      <div className="actions">
        <button onClick={handleSave} className="success">Save Bill</button>
        <button onClick={() => window.print()} className="print">Print Bill</button>
        <button
          onClick={() =>
            sendBillEmail({ customer, cart, discount, grandTotal, payment })
          }
          className="success"
        >
          Email
        </button>
        <button onClick={handleWhatsApp} className="success">WhatsApp</button>
        <button onClick={handleClearAll} className="reset">Clear</button>
      </div>
    </div>
  );
}

export default BillingPage;
