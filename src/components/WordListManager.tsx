import React, { useState } from 'react'
import type { Word } from '../types'
import { Plus, X, Upload, Download } from 'lucide-react'

interface WordListManagerProps {
  customWords: Word[]
  onWordsChange: (words: Word[]) => void
}

const WordListManager: React.FC<WordListManagerProps> = ({ customWords, onWordsChange }) => {
  const [newWord, setNewWord] = useState('')
  const [newDefinition, setNewDefinition] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [newDifficulty, setNewDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')

  const addWord = () => {
    if (newWord.trim()) {
      const word: Word = {
        text: newWord.trim().toUpperCase(),
        definition: newDefinition.trim() || undefined,
        category: newCategory.trim() || undefined,
        difficulty: newDifficulty
      }
      onWordsChange([...customWords, word])
      setNewWord('')
      setNewDefinition('')
      setNewCategory('')
    }
  }

  const removeWord = (index: number) => {
    const updatedWords = customWords.filter((_, i) => i !== index)
    onWordsChange(updatedWords)
  }

  const importWords = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          const lines = content.split('\n').filter(line => line.trim())
          const importedWords: Word[] = lines.map(line => {
            const parts = line.split(',')
            return {
              text: parts[0].trim().toUpperCase(),
              definition: parts[1]?.trim() || undefined,
              category: parts[2]?.trim() || undefined,
              difficulty: (parts[3]?.trim() as 'easy' | 'medium' | 'hard') || 'medium'
            }
          })
          onWordsChange([...customWords, ...importedWords])
        } catch (error) {
          alert('Erreur lors de l\'importation du fichier')
        }
      }
      reader.readAsText(file)
    }
  }

  const exportWords = () => {
    const csvContent = customWords.map(word => 
      `${word.text},${word.definition || ''},${word.category || ''},${word.difficulty || 'medium'}`
    ).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mots-personnalises.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="form-group">
        <label>Ajouter un mot</label>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <input
            type="text"
            placeholder="Mot à ajouter..."
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            className="form-control"
            style={{ flex: 1 }}
            onKeyPress={(e) => e.key === 'Enter' && addWord()}
          />
          <button className="btn" onClick={addWord}>
            <Plus size={16} />
          </button>
        </div>
        
        <div className="grid grid-3" style={{ marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="Définition (optionnel)"
            value={newDefinition}
            onChange={(e) => setNewDefinition(e.target.value)}
            className="form-control"
          />
          <input
            type="text"
            placeholder="Catégorie (optionnel)"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="form-control"
          />
          <select
            value={newDifficulty}
            onChange={(e) => setNewDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
            className="form-control"
          >
            <option value="easy">Facile</option>
            <option value="medium">Moyen</option>
            <option value="hard">Difficile</option>
          </select>
        </div>
      </div>

      <div className="controls">
        <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
          <Upload size={16} />
          Importer CSV
          <input
            type="file"
            accept=".csv"
            onChange={importWords}
            style={{ display: 'none' }}
          />
        </label>
        
        {customWords.length > 0 && (
          <button className="btn btn-secondary" onClick={exportWords}>
            <Download size={16} />
            Exporter CSV
          </button>
        )}
      </div>

      {customWords.length > 0 && (
        <div>
          <h4>Mots personnalisés ({customWords.length})</h4>
          <div className="word-list">
            {customWords.map((word, index) => (
              <div key={index} className="word-item" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{word.text}</span>
                {word.definition && <small>({word.definition})</small>}
                <button
                  onClick={() => removeWord(index)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#dc3545', 
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default WordListManager
