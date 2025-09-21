import React, { useState } from 'react'
import type { WordGrid, PlacedWord } from '../types'
import { Eye, EyeOff, RotateCcw } from 'lucide-react'

interface SolutionViewerProps {
  wordGrid: WordGrid
}

const SolutionViewer: React.FC<SolutionViewerProps> = ({ wordGrid }) => {
  const [showSolutions, setShowSolutions] = useState(false)
  const [highlightedWord, setHighlightedWord] = useState<string | null>(null)

  const highlightWord = (placedWord: PlacedWord) => {
    setHighlightedWord(placedWord.word.text)
    setTimeout(() => setHighlightedWord(null), 2000)
  }

  const getWordPosition = (placedWord: PlacedWord) => {
    const directions = {
      horizontal: [0, 1],
      vertical: [1, 0],
      diagonal: [1, 1],
      'horizontal-reverse': [0, -1],
      'vertical-reverse': [-1, 0],
      'diagonal-reverse': [-1, -1]
    }

    const [dRow, dCol] = directions[placedWord.direction]
    const positions = []
    
    for (let i = 0; i < placedWord.word.text.length; i++) {
      positions.push({
        row: placedWord.startRow + i * dRow,
        col: placedWord.startCol + i * dCol
      })
    }
    
    return positions
  }

  const renderGridWithHighlights = () => {
    const highlightedPositions = new Set<string>()
    
    if (highlightedWord) {
      const placedWord = wordGrid.placedWords.find(pw => pw.word.text === highlightedWord)
      if (placedWord) {
        const positions = getWordPosition(placedWord)
        positions.forEach(pos => {
          highlightedPositions.add(`${pos.row}-${pos.col}`)
        })
      }
    }

    return wordGrid.grid.map((row, rowIndex) =>
      row.map((letter, colIndex) => {
        const isHighlighted = highlightedPositions.has(`${rowIndex}-${colIndex}`)
        return (
          <div
            key={`${rowIndex}-${colIndex}`}
            className="word-grid-cell"
            style={{
              backgroundColor: isHighlighted ? '#ffeb3b' : 'white',
              border: isHighlighted ? '2px solid #ff9800' : '1px solid #ccc',
              transform: isHighlighted ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.3s ease',
              zIndex: isHighlighted ? 10 : 1
            }}
          >
            {letter}
          </div>
        )
      })
    )
  }

  return (
    <div>
      <div className="controls mb-4">
        <button 
          className="btn" 
          onClick={() => setShowSolutions(!showSolutions)}
        >
          {showSolutions ? <EyeOff size={16} /> : <Eye size={16} />}
          {showSolutions ? 'Masquer les solutions' : 'Afficher les solutions'}
        </button>
        
        <button 
          className="btn btn-secondary" 
          onClick={() => setHighlightedWord(null)}
        >
          <RotateCcw size={16} />
          Réinitialiser
        </button>
      </div>

      {showSolutions && (
        <div className="mb-4">
          <h4>Solutions détaillées :</h4>
          <div className="word-list">
            {wordGrid.placedWords.map((placedWord, index) => (
              <div 
                key={index} 
                className="word-item" 
                style={{ 
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => highlightWord(placedWord)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e3f2fd'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#e9ecef'
                }}
              >
                <strong>{placedWord.word.text}</strong>
                <small style={{ marginLeft: '8px', color: '#666' }}>
                  ({placedWord.startRow + 1}, {placedWord.startCol + 1}) - {placedWord.direction}
                </small>
                {placedWord.word.definition && (
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                    {placedWord.word.definition}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div 
        className={`word-grid ${wordGrid.size >= 15 ? 'large-grid' : ''} ${wordGrid.size >= 20 ? 'xlarge-grid' : ''} ${wordGrid.size >= 25 ? 'xxlarge-grid' : ''}`} 
        style={{ 
          gridTemplateColumns: `repeat(${wordGrid.size}, 1fr)`,
          position: 'relative'
        }}
      >
        {renderGridWithHighlights()}
      </div>
    </div>
  )
}

export default SolutionViewer
