import React, { useState, useEffect } from "react";
import "./history.css";
import HistoryIcon from '@mui/icons-material/History';

function History() {
  const [billingData, setBillingData] = useState([]);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [historyTab] = useState("bill"); // only billing for now

  const currentUser = localStorage.getItem("currentUser") || "admin";
  const historyKey = `${currentUser}_billHistory`;

  // Load bills from localStorage
  useEffect(() => {
    const savedBills = JSON.parse(localStorage.getItem(historyKey)) || [];
    setBillingData(savedBills);
  }, [historyKey]);

  // Filter bills based on search and date
  const filteredBills = billingData.filter(bill => {
    const customerName = bill.customer?.name || "";
    const itemsText = bill.cart?.map(p => p.name).join(" ") || "";
    const grandTotalText = bill.grandTotal || "";
    const text = `${customerName} ${itemsText} ${grandTotalText}`;
    const matchesSearch = text.toLowerCase().includes(search.toLowerCase());

    const billDate = new Date(bill.date);
    const afterFrom = fromDate ? billDate >= new Date(fromDate) : true;
    const beforeTo = toDate ? billDate <= new Date(toDate) : true;

    return matchesSearch && afterFrom && beforeTo;
  });

  return (
    <div className="container">
      <div className="logo-header"><HistoryIcon className="history_icon" />History Center</div>
      <div className="tagline">View and export billing records.</div>

      {/* Toolbar */}
      <div className="history-toolbar">
        <input
          type="text"
          placeholder="🔍 Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <input
          type="date"
          placeholder="from"
          value={fromDate}
          onChange={e => setFromDate(e.target.value)}
        />
        <input
          type="date"
          value={toDate}
          onChange={e => setToDate(e.target.value)}
        />

        <div style={{ position: "relative" }}>
          <div className="dropdown">
            <button className="dropbtn"> Download</button>
            <div className="dropdown-content">
              <button onClick={() => alert("Download Billing CSV")}>Billing (CSV)</button>
              <button onClick={() => { localStorage.removeItem(historyKey); setBillingData([]); }}>Clear Billing</button>
              <button onClick={() => window.print()}>Print</button>
            </div>
          </div>
        </div>
      </div>

      {/* Billing Table */}
      {historyTab === "bill" && (
        <div className="history-table">
          <table>
            <thead>
              <tr>
                <th>Bill No</th>
                <th>Customer</th>
                <th>Items (name * qty)</th>
                <th>Total (INR)</th>
                <th>Due (INR)</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>No bills found</td>
                </tr>
              ) : (
                filteredBills.map(bill => {
                  const balanceDue = Math.max(
                    0,
                    (bill.previousDue || 0) + (bill.grandTotal || 0) - (bill.payment?.paid || 0)
                  );

                  return (
                    <tr key={bill.id}>
                      <td>{bill.id}</td>
                      <td>{bill.customer?.name || "-"}</td>
                      <td>{bill.cart?.map(p => `${p.name} × ${p.qty}`).join(", ") || "-"}</td>
                      <td style={{ color: "green" }}>{bill.grandTotal || "-"}</td>
                      <td style={{ color: "red" }}>{balanceDue}</td> {/* Correct Due calculation */}
                      <td>{bill.date || "-"}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}


    </div>
  );
}

export default History;
