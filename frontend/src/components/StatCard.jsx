import React from 'react';

function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <h5>{label}</h5>
      <p>{value}</p>
    </div>
  );
}

export default StatCard;
