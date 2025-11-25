import { useState } from 'react'
import './App.css'
import { GameBoard } from './components/screens/GameBoard'
import { LandingScreen } from './components/screens/LandingScreen'
import { GameProvider } from './context/GameContext'

type Screen = 'landing' | 'game'

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing')

  const handleGameStart = () => {
    setCurrentScreen('game')
  }

  const handleBackToLanding = () => {
    setCurrentScreen('landing')
  }

  if (currentScreen === 'landing') {
    return <LandingScreen onGameStart={handleGameStart} />
  }

  return <GameBoard onBackToLanding={handleBackToLanding} />
}

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  )
}

export default App
