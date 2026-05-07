import { useNavigate } from 'react-router-dom';
import { useHardwareAcceleration } from '../hooks/useHardwareAcceleration';
import './hardware-acceleration-warning.css';

export function HardwareAccelerationWarning() {
  const isAccelerationAvailable = useHardwareAcceleration();
  const navigate = useNavigate();

  if (isAccelerationAvailable) {
    return null;
  }

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleFallbackMode = () => {
    navigate('/projects/parallax');
  };

  return (
    <div className="hw-acceleration-warning">
      <div className="warning-content">
        <div className="warning-icon">⚠️</div>
        <div className="warning-text">
          <h2>Hardware Acceleration Required</h2>
          <p>
            Your browser has hardware acceleration disabled. This is required for optimal viewing of 3D
            elements and animations.
          </p>
          <div className="warning-steps">
            <p><strong>Steps to enable:</strong></p>
            <ol>
              <li>Open your browser settings</li>
              <li>Find "Hardware acceleration" option</li>
              <li>Enable the toggle</li>
              <li>Restart your browser</li>
            </ol>
          </div>
        </div>
        <div className="warning-actions">
          <button onClick={handleRefresh} className="refresh-button">
            Refresh After Enabling
          </button>
          <button onClick={handleFallbackMode} className="refresh-button secondary">
            Use Non-GPU Version
          </button>
        </div>
      </div>
    </div>
  );
}
