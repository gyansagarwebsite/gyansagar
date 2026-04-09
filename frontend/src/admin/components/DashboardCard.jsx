import './DashboardCard.css';

const DashboardCard = ({ icon, title, value, trend, subsidiary = '' }) => {
  return (
    <div className="dashboard-card">
      <div className="card-icon">{icon}</div>
      <div className="card-content">
        <p className="card-label">{title}</p>
        <div className="card-value-group">
          <h3 className="card-value">{value}</h3>
          {subsidiary && <span className="card-subsidiary">{subsidiary}</span>}
        </div>
        {trend && (
          <p className={`card-trend ${trend > 0 ? 'positive' : 'negative'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
