import React, { useState, useEffect } from 'react'
import type { GameSettings, Word } from '../types'
import { Download, Star, RefreshCw } from 'lucide-react'

interface ExampleGrid {
  name: string
  description: string
  settings: GameSettings
  words: string[]
}

interface ExampleLoaderProps {
  onSettingsChange: (settings: GameSettings) => void
  onWordsChange: (words: Word[]) => void
}

const ExampleLoader: React.FC<ExampleLoaderProps> = ({ onSettingsChange, onWordsChange }) => {
  const [examples, setExamples] = useState<ExampleGrid[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadExamples()
  }, [])

  const loadExamples = async () => {
    try {
      const response = await fetch('./examples.json')
      const data = await response.json()
      setExamples(data.exampleGrids)
    } catch (error) {
      console.error('Erreur lors du chargement des exemples:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadExample = (example: ExampleGrid) => {
    // Convertir les mots en format Word
    const words: Word[] = example.words.map(word => ({
      text: word,
      difficulty: example.settings.difficulty
    }))

    // Appliquer les paramètres et mots
    onSettingsChange(example.settings)
    onWordsChange(words)
  }

  if (loading) {
    return (
      <div className="card">
        <h3>📚 Exemples Prédéfinis</h3>
        <div className="text-center">
          <div className="animate-spin" style={{ display: 'inline-block', margin: '20px' }}>
            <RefreshCw size={24} />
          </div>
          <p>Chargement des exemples...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <Star size={20} />
        Exemples Prédéfinis
      </h3>
      <p style={{ marginBottom: '20px', color: '#666', fontSize: '1.1rem' }}>
        🚀 Chargez rapidement des configurations prédéfinies pour commencer
      </p>
      
      <div className="grid grid-3">
        {examples.map((example, index) => (
          <div 
            key={index} 
            className="example-card" 
            onClick={() => loadExample(example)}
          >
            <div className="example-header">
              <h4>{example.name}</h4>
              <span className="badge info">{example.settings.gridSize}×{example.settings.gridSize}</span>
            </div>
            <p className="example-description">{example.description}</p>
            <div className="example-details">
              <div className="detail-item">
                <span className="detail-label">Difficulté:</span>
                <span className={`badge ${example.settings.difficulty === 'easy' ? 'success' : example.settings.difficulty === 'medium' ? 'warning' : 'info'}`}>
                  {example.settings.difficulty === 'easy' ? 'Facile' : example.settings.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Mots:</span>
                <span className="badge">{example.words.length}</span>
              </div>
            </div>
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '16px' }}
              onClick={(e) => {
                e.stopPropagation()
                loadExample(example)
              }}
            >
              <Download size={16} />
              Charger cet exemple
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExampleLoader
