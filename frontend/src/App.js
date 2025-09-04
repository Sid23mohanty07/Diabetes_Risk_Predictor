import React, { useState } from "react";
import { FaHeartbeat, FaUserMd } from "react-icons/fa";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    pregnancies: "",
    glucose: "",
    bloodpressure: "",
    skinthickness: "",
    insulin: "",
    bmi: "",
    dpf: "",
    age: "",
  });

  const [result, setResult] = useState(null);
  const [probability, setProbability] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.values(formData)),
    });
    const data = await response.json();
    setResult(data.prediction);
    if (data.probability !== undefined) {
      setProbability(data.probability);
    }
  };

  const chartData = [
    { name: "No Diabetes", value: probability ? (1 - probability) * 100 : 0 },
    { name: "Diabetes", value: probability ? probability * 100 : 0 },
  ];

  return (
    <div className="dashboard">
      <header className="header">
        <FaHeartbeat className="logo" />
        <h1>Diabetes Risk Predictor</h1>
        <MdOutlineHealthAndSafety className="logo" />
      </header>

      <div className="content">
        <div className="card form-card">
          <h2>
            <FaUserMd /> Enter Patient Details
          </h2>
          <form onSubmit={handleSubmit}>
            {Object.keys(formData).map((field, idx) => (
              <div key={idx} className="form-group">
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  type="number"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
            <button type="submit" className="btn">
              Predict
            </button>
          </form>
        </div>

        {result !== null && (
          <div className="card result-card">
            <h2>Prediction Result</h2>
            <p className={result === 1 ? "positive" : "negative"}>
              {result === 1
                ? "⚠️ High Risk of Diabetes"
                : "✅ Low Risk of Diabetes"}
            </p>

            {probability !== null && (
              <div style={{ width: "100%", height: 300, marginTop: "20px" }}>
                <ResponsiveContainer>
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#0077ff" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
