import React from 'react'
import type { WordGrid } from '../types'
import { Target, Grid3X3, BookOpen } from 'lucide-react'

interface GridStatsProps {
  wordGrid: WordGrid
}

const GridStats: React.FC<GridStatsProps> = ({ wordGrid }) => {
  const getDifficultyStats = () => {
    const stats = { easy: 0, medium: 0, hard: 0 }
    wordGrid.placedWords.forEach(placedWord => {
      stats[placedWord.word.difficulty || 'medium']++
    })
    return stats
  }

  const getDirectionStats = () => {
    const stats = { horizontal: 0, vertical: 0, diagonal: 0, reverse: 0 }
    wordGrid.placedWords.forEach(placedWord => {
      if (placedWord.direction.includes('reverse')) {
        stats.reverse++
      } else if (placedWord.direction === 'horizontal') {
        stats.horizontal++
      } else if (placedWord.direction === 'vertical') {
        stats.vertical++
      } else if (placedWord.direction === 'diagonal') {
        stats.diagonal++
      }
    })
    return stats
  }


  const difficultyStats = getDifficultyStats()
  const directionStats = getDirectionStats()

  return (
    <div className="grid grid-3">
      <div className="card">
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Target size={20} />
          Statistiques générales
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Mots placés :</span>
            <strong>{wordGrid.placedWords.length}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Taille grille :</span>
            <strong>{wordGrid.size}×{wordGrid.size}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Difficulté :</span>
            <strong style={{ textTransform: 'capitalize' }}>{wordGrid.difficulty}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Temps génération :</span>
            <strong>{wordGrid.generationTime}ms</strong>
          </div>
        </div>
      </div>

      <div className="card">
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Grid3X3 size={20} />
          Répartition par difficulté
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#28a745' }}>Facile :</span>
            <strong>{difficultyStats.easy}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#ffc107' }}>Moyen :</span>
            <strong>{difficultyStats.medium}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#dc3545' }}>Difficile :</span>
            <strong>{difficultyStats.hard}</strong>
          </div>
        </div>
      </div>

      <div className="card">
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <BookOpen size={20} />
          Directions utilisées
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Horizontal :</span>
            <strong>{directionStats.horizontal}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Vertical :</span>
            <strong>{directionStats.vertical}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Diagonal :</span>
            <strong>{directionStats.diagonal}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Inversé :</span>
            <strong>{directionStats.reverse}</strong>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GridStats
