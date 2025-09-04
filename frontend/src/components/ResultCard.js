import React from "react";

function ResultCard({ prediction }) {
  return (
    <div
      className={`result-card ${prediction === "Diabetic" ? "danger" : "safe"}`}
    >
      <h2>Result: {prediction}</h2>
    </div>
  );
}

export default ResultCard;
