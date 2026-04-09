import '../../styles/components/LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium' }) => {
  return (
    <div className={`premium-loader-wrapper loader-${size}`}>
      <div className="loader-ring"></div>
      <div className="loader-inner-dot"></div>
      <div className="loader-pulse"></div>
    </div>
  );
};

export default LoadingSpinner;

