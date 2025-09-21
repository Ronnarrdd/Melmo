import React, { useState } from 'react'
import type { WordGrid, GameSettings, Word, PlacedWord } from '../types'
import { Shuffle, RefreshCw } from 'lucide-react'
import DictionaryService from '../services/dictionaryService'

interface WordGridGeneratorProps {
  settings: GameSettings
  customWords: Word[]
  onGridGenerated: (grid: WordGrid) => void
}

const WordGridGenerator: React.FC<WordGridGeneratorProps> = ({ 
  settings, 
  customWords, 
  onGridGenerated 
}) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedGrid, setGeneratedGrid] = useState<WordGrid | null>(null)

  const dictionaryService = DictionaryService.getInstance()

  // Fonction pour traduire la difficulté en français
  const getDifficultyLabel = (difficulty: string): string => {
    switch (difficulty) {
      case 'easy': return 'Facile'
      case 'medium': return 'Moyen'
      case 'hard': return 'Difficile'
      default: return difficulty
    }
  }

  const getAvailableWords = async (): Promise<Word[]> => {
    // Utiliser getNewWordsByDifficulty pour avoir de nouveaux mots à chaque génération
    const dictionaryWords = await dictionaryService.getNewWordsByDifficulty(settings.difficulty)
    const allWords = [...dictionaryWords, ...customWords]
    
    return allWords.filter(word => {
      const wordLength = word.text.length
      const maxLength = Math.floor(settings.gridSize * 0.8)
      
      if (wordLength > maxLength) return false
      
      // Filtrage supplémentaire basé sur la difficulté
      switch (settings.difficulty) {
        case 'easy':
          return word.difficulty === 'easy' || wordLength <= 6
        case 'medium':
          return word.difficulty !== 'hard' || wordLength <= 8
        case 'hard':
          return true
        default:
          return true
      }
    })
  }

  const canPlaceWord = (
    grid: string[][],
    word: string,
    row: number,
    col: number,
    direction: PlacedWord['direction']
  ): boolean => {
    const directions = {
      horizontal: [0, 1],
      vertical: [1, 0],
      diagonal: [1, 1],
      'horizontal-reverse': [0, -1],
      'vertical-reverse': [-1, 0],
      'diagonal-reverse': [-1, -1]
    }

    const [dRow, dCol] = directions[direction]
    const endRow = row + (word.length - 1) * dRow
    const endCol = col + (word.length - 1) * dCol

    // Vérifier les limites
    if (endRow < 0 || endRow >= settings.gridSize || 
        endCol < 0 || endCol >= settings.gridSize) {
      return false
    }

    // Vérifier les conflits
    for (let i = 0; i < word.length; i++) {
      const checkRow = row + i * dRow
      const checkCol = col + i * dCol
      const existingLetter = grid[checkRow][checkCol]
      
      if (existingLetter && existingLetter !== word[i]) {
        return false
      }
    }

    return true
  }

  const placeWord = (
    grid: string[][],
    word: string,
    row: number,
    col: number,
    direction: PlacedWord['direction']
  ): void => {
    const directions = {
      horizontal: [0, 1],
      vertical: [1, 0],
      diagonal: [1, 1],
      'horizontal-reverse': [0, -1],
      'vertical-reverse': [-1, 0],
      'diagonal-reverse': [-1, -1]
    }

    const [dRow, dCol] = directions[direction]
    
    for (let i = 0; i < word.length; i++) {
      const placeRow = row + i * dRow
      const placeCol = col + i * dCol
      grid[placeRow][placeCol] = word[i]
    }
  }

  const generateGrid = async (): Promise<WordGrid> => {
    const startTime = Date.now()
    const grid: string[][] = Array(settings.gridSize)
      .fill(null)
      .map(() => Array(settings.gridSize).fill(''))
    
    const availableWords = await getAvailableWords()
    const placedWords: PlacedWord[] = []
    
    // Trier les mots par longueur (plus longs en premier)
    const sortedWords = [...availableWords].sort((a, b) => b.text.length - a.text.length)
    
    const directions: PlacedWord['direction'][] = []
    if (settings.allowHorizontal) directions.push('horizontal')
    if (settings.allowVertical) directions.push('vertical')
    if (settings.allowDiagonal) directions.push('diagonal')
    if (settings.allowReverse) {
      if (settings.allowHorizontal) directions.push('horizontal-reverse')
      if (settings.allowVertical) directions.push('vertical-reverse')
      if (settings.allowDiagonal) directions.push('diagonal-reverse')
    }

    for (const word of sortedWords) {
      let placed = false
      const maxAttempts = 100
      let attempts = 0

      while (!placed && attempts < maxAttempts) {
        const row = Math.floor(Math.random() * settings.gridSize)
        const col = Math.floor(Math.random() * settings.gridSize)
        const direction = directions[Math.floor(Math.random() * directions.length)]

        if (canPlaceWord(grid, word.text, row, col, direction)) {
          placeWord(grid, word.text, row, col, direction)
          placedWords.push({
            word,
            startRow: row,
            startCol: col,
            direction,
            length: word.text.length
          })
          placed = true
        }
        attempts++
      }
    }

    // Remplir les cases vides avec des lettres aléatoires
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    for (let i = 0; i < settings.gridSize; i++) {
      for (let j = 0; j < settings.gridSize; j++) {
        if (!grid[i][j]) {
          grid[i][j] = letters[Math.floor(Math.random() * letters.length)]
        }
      }
    }

    const generationTime = Date.now() - startTime

    return {
      grid,
      placedWords,
      size: settings.gridSize,
      difficulty: settings.difficulty,
      generationTime
    }
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const newGrid = await generateGrid()
      setGeneratedGrid(newGrid)
      onGridGenerated(newGrid)
    } catch (error) {
      console.error('Erreur lors de la génération:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div>
      <div style={{ 
        background: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        border: '1px solid #e9ecef'
      }}>
        <h3 style={{ marginBottom: '12px', color: '#333' }}>Configuration actuelle :</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <span className="badge">Grille {settings.gridSize}×{settings.gridSize}</span>
          <span className="badge">Difficulté: {getDifficultyLabel(settings.difficulty)}</span>
          <span className="badge">Mots: {customWords.length} personnalisés</span>
        </div>
        
        <div className="controls">
          <button 
            className="btn btn-primary" 
            onClick={handleGenerate}
            disabled={isGenerating}
            style={{ fontSize: '18px', padding: '16px 32px' }}
          >
            {isGenerating ? (
              <RefreshCw size={20} className="animate-spin" />
            ) : (
              <Shuffle size={20} />
            )}
            {isGenerating ? 'Génération en cours...' : '🎯 Générer ma grille'}
          </button>
        </div>
      </div>

      {generatedGrid && (
        <div className="results-section">
          <h3>
            ✅ Grille générée avec succès !
            <span className="badge success">{generatedGrid.placedWords.length} mots placés</span>
          </h3>
          
          <div className={`word-grid ${generatedGrid.size >= 15 ? 'large-grid' : ''} ${generatedGrid.size >= 20 ? 'xlarge-grid' : ''} ${generatedGrid.size >= 25 ? 'xxlarge-grid' : ''}`} style={{ 
            gridTemplateColumns: `repeat(${generatedGrid.size}, 1fr)`,
            fontSize: `${settings.fontSize}px`,
            fontFamily: settings.fontFamily
          }}>
            {generatedGrid.grid.flat().map((letter, index) => (
              <div key={index} className="word-grid-cell">
                {letter}
              </div>
            ))}
          </div>
          
          <div style={{ marginTop: '24px' }}>
            <h4 style={{ marginBottom: '16px', color: '#333' }}>📝 Mots à trouver :</h4>
            <div className="word-list">
              {generatedGrid.placedWords.map((placedWord, index) => (
                <div key={index} className="word-item" style={{
                  background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                  border: '1px solid #2196f3',
                  color: '#1565c0',
                  fontWeight: '600'
                }}>
                  {placedWord.word.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WordGridGenerator
