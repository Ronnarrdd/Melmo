import React from 'react'
import type { GameSettings } from '../types'

interface SettingsPanelProps {
  settings: GameSettings
  onSettingsChange: (settings: GameSettings) => void
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSettingsChange }) => {
  const handleChange = (key: keyof GameSettings, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value
    })
  }

  return (
    <div className="grid grid-2">
      <div className="form-group">
        <label>Taille de la grille</label>
        <select 
          className="form-control"
          value={settings.gridSize}
          onChange={(e) => handleChange('gridSize', parseInt(e.target.value))}
        >
          <option value={10}>10x10 (Facile)</option>
          <option value={15}>15x15 (Moyen)</option>
          <option value={20}>20x20 (Difficile)</option>
          <option value={25}>25x25 (Expert)</option>
        </select>
      </div>

      <div className="form-group">
        <label>Difficulté</label>
        <select 
          className="form-control"
          value={settings.difficulty}
          onChange={(e) => handleChange('difficulty', e.target.value)}
        >
          <option value="easy">Facile</option>
          <option value="medium">Moyen</option>
          <option value="hard">Difficile</option>
        </select>
      </div>

      <div className="form-group">
        <label>Police d'écriture</label>
        <select 
          className="form-control"
          value={settings.fontFamily}
          onChange={(e) => handleChange('fontFamily', e.target.value)}
        >
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
          <option value="Verdana">Verdana</option>
        </select>
      </div>

      <div className="form-group">
        <label>Taille de police</label>
        <input
          type="range"
          min="12"
          max="24"
          value={settings.fontSize}
          onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
          className="form-control"
        />
        <div className="text-center" style={{ fontSize: '14px', color: '#666' }}>
          {settings.fontSize}px
        </div>
      </div>

      <div className="form-group">
        <h4>Directions autorisées</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={settings.allowHorizontal}
              onChange={(e) => handleChange('allowHorizontal', e.target.checked)}
            />
            Horizontal
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={settings.allowVertical}
              onChange={(e) => handleChange('allowVertical', e.target.checked)}
            />
            Vertical
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={settings.allowDiagonal}
              onChange={(e) => handleChange('allowDiagonal', e.target.checked)}
            />
            Diagonal
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={settings.allowReverse}
              onChange={(e) => handleChange('allowReverse', e.target.checked)}
            />
            Mots inversés
          </label>
        </div>
      </div>
    </div>
  )
}

export default SettingsPanel
