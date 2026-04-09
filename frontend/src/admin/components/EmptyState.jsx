const EmptyState = ({ title, description, icon, buttonText, onButtonClick }) => {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      {buttonText && (
        <button className="btn-primary" onClick={onButtonClick}>
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

