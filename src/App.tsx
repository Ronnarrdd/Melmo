import { useState } from 'react'
import WordGridGenerator from './components/WordGridGenerator'
import WordListManager from './components/WordListManager'
import SettingsPanel from './components/SettingsPanel'
import ExportPanel from './components/ExportPanel'
import SolutionViewer from './components/SolutionViewer'
import ExampleLoader from './components/ExampleLoader'
import HelpGuide from './components/HelpGuide'
import type { WordGrid, GameSettings, Word } from './types'

function App() {
  const [wordGrid, setWordGrid] = useState<WordGrid | null>(null)
  const [customWords, setCustomWords] = useState<Word[]>([])
  const [settings, setSettings] = useState<GameSettings>({
    gridSize: 15,
    difficulty: 'medium',
    allowDiagonal: true,
    allowReverse: true,
    allowHorizontal: true,
    allowVertical: true,
    fontFamily: 'Arial',
    fontSize: 18
  })


  return (
    <div className="container">
      <header className="text-center mb-4">
        <div className="logo-container">
          <img 
            src="/melmofeuille.png" 
            alt="Melmo" 
            className="logo-image"
          />
        </div>
        <p className="subtitle">
          Générateur de Mots Mêlés Magique ✨
        </p>
      </header>

      {/* Interface en étapes ultra-simple */}
      <div className="steps-container">
        
        {/* Étape 1: Choix rapide */}
        <div className="step-card">
          <div className="step-number">1</div>
          <h2 className="step-title">Choisis ta difficulté !</h2>
          <div className="difficulty-cards">
            <div className="difficulty-card easy" onClick={() => {
              setSettings({...settings, gridSize: 10, difficulty: 'easy'})
              setCustomWords([])
            }}>
              <div className="difficulty-emoji">😊</div>
              <h3>Facile</h3>
              <p>10×10</p>
            </div>
            <div className="difficulty-card medium" onClick={() => {
              setSettings({...settings, gridSize: 15, difficulty: 'medium'})
              setCustomWords([])
            }}>
              <div className="difficulty-emoji">🤔</div>
              <h3>Moyen</h3>
              <p>15×15</p>
            </div>
            <div className="difficulty-card hard" onClick={() => {
              setSettings({...settings, gridSize: 20, difficulty: 'hard'})
              setCustomWords([])
            }}>
              <div className="difficulty-emoji">🧠</div>
              <h3>Difficile</h3>
              <p>20×20</p>
            </div>
          </div>
        </div>

        {/* Étape 2: Génération */}
        <div className="step-card">
          <div className="step-number">2</div>
          <h2 className="step-title">Génère ta grille !</h2>
          <WordGridGenerator 
            settings={settings}
            customWords={customWords}
            onGridGenerated={setWordGrid}
          />
        </div>

        {/* Étape 3: Résultats */}
        {wordGrid && (
          <div className="step-card">
            <div className="step-number">3</div>
            <h2 className="step-title">Voilà ta grille !</h2>
            <SolutionViewer wordGrid={wordGrid} />
            <ExportPanel 
              wordGrid={wordGrid}
              settings={settings}
            />
          </div>
        )}

        {/* Options avancées (collapsible) */}
        <div className="advanced-options">
          <button 
            className="toggle-advanced"
            onClick={() => {
              const element = document.querySelector('.advanced-content')
              if (element) {
                element.classList.toggle('show')
              }
            }}
          >
            ⚙️ Options avancées
          </button>
          
          <div className="advanced-content">
            <div className="grid grid-2">
              <div className="card">
                <h3>Paramètres</h3>
                <SettingsPanel 
                  settings={settings} 
                  onSettingsChange={setSettings}
                />
              </div>
              <div className="card">
                <h3>Mots personnalisés</h3>
                <WordListManager 
                  customWords={customWords}
                  onWordsChange={setCustomWords}
                />
              </div>
            </div>
            <div className="card">
              <ExampleLoader 
                onSettingsChange={setSettings}
                onWordsChange={setCustomWords}
              />
            </div>
          </div>
        </div>
      </div>
      
      <HelpGuide />
    </div>
  )
}

export default App
