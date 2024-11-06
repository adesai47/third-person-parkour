import { useState } from 'react';
import GameScene from './components/GameScene';
import StartMenu from './components/StartMenu';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleSelectLevel = (level: number) => {
    setCurrentLevel(level);
    setGameStarted(true);
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <GameScene 
        initialLevel={currentLevel}
        onBackToMenu={() => setGameStarted(false)}
        isActive={gameStarted}
      />
      {!gameStarted && (
        <StartMenu 
          onStartGame={handleStartGame}
          onSelectLevel={handleSelectLevel}
        />
      )}
    </div>
  );
}

export default App;
