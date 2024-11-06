import React, { useState } from 'react';

interface PauseMenuProps {
  onResume: () => void;
  onMainMenu: () => void;
  onUpdateSettings: (settings: GameSettings) => void;
  currentSettings: GameSettings;
}

export interface PlayerStyle {
  color: string;
  design: 'cube' | 'sphere' | 'diamond';
  material: 'normal' | 'neon';
}

export interface GameSettings {
  playerStyle: PlayerStyle;
  backgroundMode: 'day' | 'night';
}

const PauseMenu: React.FC<PauseMenuProps> = ({
  onResume,
  onMainMenu,
  onUpdateSettings,
  currentSettings
}) => {
  const [selectedSettings, setSelectedSettings] = useState<GameSettings>(currentSettings);

  const styles = {
    overlay: {
      position: 'fixed' as 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    menuBox: {
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      padding: '25px 40px',
      borderRadius: '15px',
      boxShadow: '0 0 30px rgba(0, 0, 0, 0.5)',
      display: 'flex',
      flexDirection: 'column' as 'column',
      alignItems: 'center',
      gap: '15px',
      border: '2px solid rgba(255, 255, 255, 0.1)',
      minWidth: '400px',
      maxHeight: '80vh',
    },
    title: {
      fontFamily: '"Press Start 2P", cursive',
      fontSize: '2rem',
      color: '#fff',
      textShadow: '0 0 10px #00ff00',
      marginBottom: '20px',
    },
    section: {
      width: '100%',
      marginBottom: '15px',
    },
    sectionTitle: {
      fontFamily: '"Press Start 2P", cursive',
      fontSize: '0.9rem',
      color: '#fff',
      marginBottom: '8px',
    },
    optionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '8px',
      width: '100%',
    },
    colorOption: {
      width: '100%',
      height: '35px',
      border: '2px solid #fff',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'transform 0.2s',
    },
    button: {
      padding: '12px 30px',
      fontSize: '0.9rem',
      backgroundColor: '#3498db',
      border: '3px solid #2980b9',
      borderRadius: '8px',
      cursor: 'pointer',
      color: '#fff',
      transition: 'all 0.2s ease',
      width: '100%',
      fontFamily: '"Press Start 2P", cursive',
      marginTop: '8px',
    },
    optionButton: {
      padding: '8px',
      fontSize: '0.75rem',
      backgroundColor: '#2ecc71',
      border: '2px solid #27ae60',
      borderRadius: '8px',
      cursor: 'pointer',
      color: '#fff',
      transition: 'all 0.2s ease',
      fontFamily: '"Press Start 2P", cursive',
    },
    backgroundOption: {
      padding: '8px',
      fontSize: '0.75rem',
      borderRadius: '8px',
      cursor: 'pointer',
      color: '#fff',
      transition: 'all 0.2s ease',
      fontFamily: '"Press Start 2P", cursive',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      width: '100%',
      border: '2px solid #27ae60',
    },
    backgroundIcon: {
      width: '24px',
      height: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.2rem',
    }
  };

  const colors = [
    '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff',
    '#ffffff', '#ff8800', '#8800ff'
  ];

  const designs = ['cube', 'sphere', 'diamond'];
  const materials = ['normal', 'neon'];

  return (
    <div style={styles.overlay}>
      <div style={styles.menuBox}>
        <h1 style={styles.title}>PAUSED</h1>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Color</h2>
          <div style={styles.optionsGrid}>
            {colors.map((color) => (
              <div
                key={color}
                style={{
                  ...styles.colorOption,
                  backgroundColor: color,
                  transform: selectedSettings.playerStyle.color === color ? 'scale(1.1)' : 'scale(1)',
                }}
                onClick={() => setSelectedSettings({
                  ...selectedSettings,
                  playerStyle: { ...selectedSettings.playerStyle, color }
                })}
              />
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Design</h2>
          <div style={styles.optionsGrid}>
            {designs.map((design) => (
              <button
                key={design}
                style={{
                  ...styles.optionButton,
                  backgroundColor: selectedSettings.playerStyle.design === design ? '#27ae60' : '#2ecc71',
                }}
                onClick={() => setSelectedSettings({
                  ...selectedSettings,
                  playerStyle: { ...selectedSettings.playerStyle, design: design as PlayerStyle['design'] }
                })}
              >
                {design}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Material</h2>
          <div style={styles.optionsGrid}>
            {materials.map((material) => (
              <button
                key={material}
                style={{
                  ...styles.optionButton,
                  backgroundColor: selectedSettings.playerStyle.material === material ? '#27ae60' : '#2ecc71',
                }}
                onClick={() => setSelectedSettings({
                  ...selectedSettings,
                  playerStyle: { ...selectedSettings.playerStyle, material: material as PlayerStyle['material'] }
                })}
              >
                {material}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Background</h2>
          <div style={styles.optionsGrid}>
            <button
              style={{
                ...styles.backgroundOption,
                backgroundColor: selectedSettings.backgroundMode === 'day' ? '#27ae60' : '#2ecc71',
              }}
              onClick={() => setSelectedSettings({
                ...selectedSettings,
                backgroundMode: 'day'
              })}
            >
              <span style={styles.backgroundIcon}>☀️</span>
              Day
            </button>
            <button
              style={{
                ...styles.backgroundOption,
                backgroundColor: selectedSettings.backgroundMode === 'night' ? '#27ae60' : '#2ecc71',
              }}
              onClick={() => setSelectedSettings({
                ...selectedSettings,
                backgroundMode: 'night'
              })}
            >
              <span style={styles.backgroundIcon}>🌙</span>
              Night
            </button>
          </div>
        </div>

        <button
          style={styles.button}
          onClick={() => {
            onUpdateSettings(selectedSettings);
            onResume();
          }}
        >
          Resume
        </button>
        
        <button
          style={{...styles.button, backgroundColor: '#e74c3c', borderColor: '#c0392b'}}
          onClick={onMainMenu}
        >
          Main Menu
        </button>
      </div>
    </div>
  );
};

export default PauseMenu; 