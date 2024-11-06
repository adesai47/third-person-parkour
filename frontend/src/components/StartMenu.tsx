import React, { useState } from 'react';

interface StartMenuProps {
  onStartGame: () => void;
  onSelectLevel: (level: number) => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ onStartGame, onSelectLevel }) => {
  const [showLevels, setShowLevels] = useState(false);

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
      padding: '40px 60px',
      borderRadius: '15px',
      boxShadow: '0 0 30px rgba(0, 0, 0, 0.5)',
      display: 'flex',
      flexDirection: 'column' as 'column',
      alignItems: 'center',
      gap: '20px',
      border: '2px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      minWidth: '300px',
      animation: 'fadeIn 0.3s ease-out',
    },
    titleContainer: {
      marginBottom: '30px',
      textAlign: 'center' as 'center',
    },
    titleBlock: {
      fontSize: '4rem',
      fontFamily: '"Press Start 2P", cursive',
      color: '#fff',
      textShadow: `
        0 0 10px #00ff00,
        0 0 20px #00ff00,
        0 0 30px #00ff00,
        0 0 40px #00ff00
      `,
      WebkitTextStroke: '2px #00ff00',
      animation: 'pulse 2s infinite',
      marginBottom: '10px',
    },
    titleJump: {
      fontSize: '4rem',
      fontFamily: '"Press Start 2P", cursive',
      color: '#fff',
      textShadow: `
        0 0 10px #ff00ff,
        0 0 20px #ff00ff,
        0 0 30px #ff00ff,
        0 0 40px #ff00ff
      `,
      WebkitTextStroke: '2px #ff00ff',
      animation: 'pulse 2s infinite',
    },
    button: {
      padding: '15px 40px',
      fontSize: '1.5rem',
      backgroundColor: '#3498db',
      border: '3px solid #2980b9',
      borderRadius: '8px',
      cursor: 'pointer',
      color: '#fff',
      transition: 'all 0.2s ease',
      width: '100%',
      textAlign: 'center' as 'center',
      fontWeight: '500',
      boxShadow: '0 0 10px rgba(52, 152, 219, 0.5)',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      position: 'relative' as 'relative',
      overflow: 'hidden',
    },
    levelsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '15px',
      width: '100%',
    },
    levelButton: {
      padding: '15px 30px',
      fontSize: '1.2rem',
      backgroundColor: '#2ecc71',
      border: '3px solid #27ae60',
      borderRadius: '8px',
      cursor: 'pointer',
      color: '#fff',
      transition: 'all 0.2s ease',
      boxShadow: '0 0 10px rgba(46, 204, 113, 0.5)',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    backButton: {
      padding: '10px 20px',
      fontSize: '1rem',
      backgroundColor: '#e74c3c',
      border: '3px solid #c0392b',
      borderRadius: '8px',
      cursor: 'pointer',
      color: '#fff',
      transition: 'all 0.2s ease',
      marginTop: '20px',
      boxShadow: '0 0 10px rgba(231, 76, 60, 0.5)',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
  };

  // Add these styles to your index.html or global CSS
  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }

    @keyframes glow {
      0% { filter: brightness(100%); }
      50% { filter: brightness(150%); }
      100% { filter: brightness(100%); }
    }
  `;

  return (
    <div style={styles.overlay}>
      <style>{globalStyles}</style>
      <div style={styles.menuBox}>
        <div style={styles.titleContainer}>
          <div style={styles.titleBlock}>BLOCK</div>
          <div style={styles.titleJump}>JUMP</div>
        </div>
        
        {!showLevels ? (
          <>
            <button 
              style={styles.button}
              onClick={onStartGame}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#2980b9';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#3498db';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Play Game
            </button>
            <button 
              style={{...styles.button, backgroundColor: '#2ecc71', border: '3px solid #27ae60'}}
              onClick={() => setShowLevels(true)}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#27ae60';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#2ecc71';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Select Level
            </button>
          </>
        ) : (
          <>
            <div style={styles.levelsGrid}>
              {[1, 2, 3, 4].map(level => (
                <button
                  key={level}
                  style={styles.levelButton}
                  onClick={() => onSelectLevel(level)}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = '#27ae60';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = '#2ecc71';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  Level {level}
                </button>
              ))}
            </div>
            <button
              style={styles.backButton}
              onClick={() => setShowLevels(false)}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#c0392b';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#e74c3c';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Back
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default StartMenu;