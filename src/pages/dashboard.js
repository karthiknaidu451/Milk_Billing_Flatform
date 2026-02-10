import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import "./daschboard.css";
import DashboardIcon from "@mui/icons-material/Dashboard";

const Dashboard = () => {
  const [billingData, setBillingData] = useState([]);
  const [phoneFilter, setPhoneFilter] = useState("");

  // Load billing history from localStorage
  useEffect(() => {
    const savedBills = JSON.parse(localStorage.getItem("billHistory")) || [];
    setBillingData(savedBills);
  }, []);

  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // -------------------- SAFE PHONE FILTER --------------------
  const filteredData = billingData.filter(
    (bill) => (bill.customer?.mobile || "").includes(phoneFilter)
  );

  // -------------------- SAFE DATE FORMAT --------------------
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
  };

  // ---------------- SALES ----------------
  const totalSalesToday = filteredData
    .filter((bill) => formatDate(bill.date) === today)
    .reduce((sum, bill) => sum + Number(bill.grandTotal || 0), 0);

  const totalSalesMonth = filteredData
    .filter((bill) => {
      const d = new Date(bill.date);
      return !isNaN(d.getTime()) && d.getMonth() === currentMonth;
    })
    .reduce((sum, bill) => sum + Number(bill.grandTotal || 0), 0);

  const totalSalesYear = filteredData
    .filter((bill) => {
      const d = new Date(bill.date);
      return !isNaN(d.getTime()) && d.getFullYear() === currentYear;
    })
    .reduce((sum, bill) => sum + Number(bill.grandTotal || 0), 0);

  // ---------------- CUSTOMERS ----------------
  const customersToday = new Set(
    filteredData
      .filter((bill) => formatDate(bill.date) === today)
      .map((b) => b.customer?.mobile || "")
  ).size;

  const customersMonth = new Set(
    filteredData
      .filter((bill) => {
        const d = new Date(bill.date);
        return !isNaN(d.getTime()) && d.getMonth() === currentMonth;
      })
      .map((b) => b.customer?.mobile || "")
  ).size;

  const customersYear = new Set(
    filteredData
      .filter((bill) => {
        const d = new Date(bill.date);
        return !isNaN(d.getTime()) && d.getFullYear() === currentYear;
      })
      .map((b) => b.customer?.mobile || "")
  ).size;

  // ---------------- PRODUCT AGGREGATION ----------------
  const aggregateProductSales = (data) => {
    const productMap = {};
    data.forEach((bill) => {
      (bill.cart || []).forEach((p) => {
        productMap[p.name] = (productMap[p.name] || 0) + p.qty;
      });
    });
    return Object.keys(productMap).map((key) => ({
      name: key,
      qty: productMap[key],
    }));
  };

  const productSalesToday = aggregateProductSales(
    filteredData.filter((bill) => formatDate(bill.date) === today)
  );

  const productSalesMonth = aggregateProductSales(
    filteredData.filter((bill) => {
      const d = new Date(bill.date);
      return !isNaN(d.getTime()) && d.getMonth() === currentMonth;
    })
  );

  const productSalesYear = aggregateProductSales(
    filteredData.filter((bill) => {
      const d = new Date(bill.date);
      return !isNaN(d.getTime()) && d.getFullYear() === currentYear;
    })
  );

  // ---------------- CUSTOMERS TABLE DATA ----------------
  const customerMap = {};
  filteredData.forEach((bill) => {
    const mobile = bill.customer?.mobile || "-";
    const name = bill.customer?.name || "-";

    if (!customerMap[mobile]) {
      customerMap[mobile] = {
        name,
        mobile,
        bills: 0,
        total: 0,
        due: 0,
      };
    }

    customerMap[mobile].bills += 1;
    customerMap[mobile].total += Number(bill.grandTotal || 0);
    customerMap[mobile].due += Number(bill.due ?? bill.balanceDue ?? 0);
  });

  const customerList = Object.values(customerMap);

  return (
    <div className="dashboard-container">
      {/* Phone Filter */}
      <div className="dashboard-filter">
        <h2>
          <DashboardIcon className="dashboard_icon" /> Dashboard
        </h2>
        <input
          type="text"
          placeholder="Filter by Customer Mobile"
          value={phoneFilter}
          onChange={(e) => setPhoneFilter(e.target.value)}
        />
      </div>

      {/* Stats Cards */}
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-title">Total Sales Today</div>
          <div className="card-value">INR {totalSalesToday}</div>
        </div>

        <div className="dashboard-card">
          <div className="card-title">Total Sales This Month</div>
          <div className="card-value">INR {totalSalesMonth}</div>
        </div>

        <div className="dashboard-card">
          <div className="card-title">Total Sales This Year</div>
          <div className="card-value">INR {totalSalesYear}</div>
        </div>

        <div className="dashboard-card">
          <div className="card-title">Customers Today</div>
          <div className="card-value">{customersToday}</div>
        </div>

        <div className="dashboard-card">
          <div className="card-title">Customers This Month</div>
          <div className="card-value">{customersMonth}</div>
        </div>

        <div className="dashboard-card">
          <div className="card-title">Customers This Year</div>
          <div className="card-value">{customersYear}</div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="customers-table">
        <h3>Customers Overview</h3>
        <table>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Mobile</th>
              <th>Total Bills</th>
              <th>Total Amount (₹)</th>
              <th  >Due Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {customerList.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No customers found
                </td>
              </tr>
            ) : (
              customerList.map((c) => (
                <tr key={c.mobile}>
                  <td>{c.name}</td>
                  <td>{c.mobile}</td>
                  <td>{c.bills}</td>
                  <td style={{ color: "green" }}>INR {c.total.toLocaleString()}</td>
                  <td style={{ color: "red" }}>INR {c.due.toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Charts */}
      <div className="chart_main">
        <div className="chart-container">
          <h3>Product Sales Today</h3>
          <BarChart width={600} height={300} data={productSalesToday}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="qty" fill="#42a5f5" />
          </BarChart>
        </div>

        <div className="chart-container">
          <h3>Product Sales This Month</h3>
          <BarChart width={600} height={300} data={productSalesMonth}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="qty" fill="#ff7043" />
          </BarChart>
        </div>

        <div className="chart-container">
          <h3>Product Sales This Year</h3>
          <BarChart width={600} height={300} data={productSalesYear}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="qty" fill="#66bb6a" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
