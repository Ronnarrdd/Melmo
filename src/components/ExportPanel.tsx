import React, { useRef, useState } from 'react'
import type { WordGrid, GameSettings, ExportOptions } from '../types'
import { Download, Printer } from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

interface ExportPanelProps {
  wordGrid: WordGrid
  settings: GameSettings
}

const ExportPanel: React.FC<ExportPanelProps> = ({ wordGrid, settings }) => {
  const gridRef = useRef<HTMLDivElement>(null)
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    includeWordList: true,
    includeSolutions: false,
    showGridLines: true,
    pageSize: 'A4',
    orientation: 'portrait'
  })

  const exportToPDF = async () => {
    if (!gridRef.current) return

    try {
      // Créer un conteneur temporaire pour capturer la grille et les mots ensemble
      const tempContainer = document.createElement('div')
      tempContainer.style.position = 'absolute'
      tempContainer.style.left = '-9999px'
      tempContainer.style.top = '0'
      tempContainer.style.width = '800px' // Largeur optimisée pour A4
      tempContainer.style.backgroundColor = '#ffffff'
      tempContainer.style.padding = '20px'
      tempContainer.style.fontFamily = settings.fontFamily
      tempContainer.style.minHeight = 'auto'
      tempContainer.style.boxSizing = 'border-box'
      
      // Ajouter le logo en petit en haut à gauche
      const logoContainer = document.createElement('div')
      logoContainer.style.position = 'absolute'
      logoContainer.style.top = '5px'
      logoContainer.style.left = '5px'
      logoContainer.style.zIndex = '10'
      
      const logoImg = document.createElement('img')
      logoImg.src = './melmofeuille.png'
      logoImg.style.height = '30px'
      logoImg.style.width = 'auto'
      logoContainer.appendChild(logoImg)
      
      tempContainer.appendChild(logoContainer)
      
      // Créer une nouvelle grille pour l'export PDF
      const gridContainer = document.createElement('div')
      gridContainer.style.display = 'grid'
      gridContainer.style.gridTemplateColumns = `repeat(${wordGrid.size}, 1fr)`
      gridContainer.style.gap = '0px'
      gridContainer.style.background = '#8B4513'
      gridContainer.style.padding = '12px'
      gridContainer.style.borderRadius = '12px'
      gridContainer.style.margin = '0 auto 20px auto'
      gridContainer.style.maxWidth = 'fit-content'
      gridContainer.style.border = '3px solid #FF8C42'
      gridContainer.style.width = 'fit-content'
      
      // Calculer la taille des cellules en fonction de la grille
      const cellSize = Math.min(35, Math.floor(600 / wordGrid.size))
      
      // Créer les cellules de la grille
      wordGrid.grid.flat().forEach((letter) => {
        const cell = document.createElement('div')
        cell.textContent = letter
        cell.style.width = `${cellSize}px`
        cell.style.height = `${cellSize}px`
        cell.style.background = 'linear-gradient(145deg, #FFF8DC 0%, #FFE4B5 100%)'
        cell.style.display = 'flex'
        cell.style.alignItems = 'center'
        cell.style.justifyContent = 'center'
        cell.style.fontWeight = 'bold'
        cell.style.fontSize = `${Math.max(12, cellSize * 0.5)}px`
        cell.style.fontFamily = 'Comfortaa, sans-serif'
        cell.style.borderRadius = '0'
        cell.style.border = 'none'
        cell.style.margin = '0'
        cell.style.padding = '0'
        cell.style.color = '#8B4513'
        cell.style.boxShadow = 'inset 0 1px 2px rgba(255, 255, 255, 0.8)'
        gridContainer.appendChild(cell)
      })
      
      tempContainer.appendChild(gridContainer)
      
      // Ajouter la liste des mots si demandée
      if (exportOptions.includeWordList) {
        const wordsContainer = document.createElement('div')
        wordsContainer.style.marginTop = '20px'
        wordsContainer.style.textAlign = 'center'
        wordsContainer.style.background = 'linear-gradient(145deg, #FFF8DC 0%, #FFE4B5 100%)'
        wordsContainer.style.padding = '15px'
        wordsContainer.style.borderRadius = '12px'
        wordsContainer.style.border = '2px solid #FF8C42'
        wordsContainer.style.width = '100%'
        wordsContainer.style.boxSizing = 'border-box'
        
        const title = document.createElement('h3')
        title.textContent = 'Mots à trouver :'
        title.style.fontSize = '18px'
        title.style.marginBottom = '12px'
        title.style.color = '#8B4513'
        title.style.fontFamily = 'DynaPuff, cursive'
        title.style.textShadow = '1px 1px 2px rgba(255, 255, 255, 0.8)'
        wordsContainer.appendChild(title)
        
        const wordsList = document.createElement('div')
        wordsList.style.display = 'flex'
        wordsList.style.flexWrap = 'wrap'
        wordsList.style.justifyContent = 'center'
        wordsList.style.gap = '6px'
        wordsList.style.maxWidth = '100%'
        
        wordGrid.placedWords.forEach((placedWord) => {
          const wordSpan = document.createElement('span')
          wordSpan.textContent = placedWord.word.text
          wordSpan.style.background = 'linear-gradient(145deg, #FFB6C1 0%, #FFA0B4 100%)'
          wordSpan.style.padding = '6px 12px'
          wordSpan.style.borderRadius = '15px'
          wordSpan.style.fontSize = '12px'
          wordSpan.style.fontWeight = '700'
          wordSpan.style.fontFamily = 'Comfortaa, sans-serif'
          wordSpan.style.color = '#8B4513'
          wordSpan.style.border = '2px solid #FF8C42'
          wordSpan.style.boxShadow = '0 3px 8px rgba(255, 182, 193, 0.4)'
          wordSpan.style.textShadow = '1px 1px 2px rgba(255, 255, 255, 0.8)'
          wordSpan.style.display = 'inline-block'
          wordSpan.style.margin = '2px'
          wordsList.appendChild(wordSpan)
        })
        
        wordsContainer.appendChild(wordsList)
        tempContainer.appendChild(wordsContainer)
      }
      
      document.body.appendChild(tempContainer)
      
      // Attendre que les images se chargent
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const canvas = await html2canvas(tempContainer, {
        scale: 1.5, // Réduire l'échelle pour éviter les problèmes de mémoire
        backgroundColor: '#ffffff',
        useCORS: true,
        width: 800,
        height: tempContainer.scrollHeight,
        allowTaint: true
      })

      document.body.removeChild(tempContainer)

      const imgData = canvas.toDataURL('image/png', 0.9) // Compression pour réduire la taille
      const pdf = new jsPDF({
        orientation: exportOptions.orientation,
        unit: 'mm',
        format: exportOptions.pageSize
      })

      // Calculer les dimensions de la page
      const pageWidth = pdf.internal.pageSize.width
      const pageHeight = pdf.internal.pageSize.height
      const margin = 10 // Marge de 10mm de chaque côté
      const availableWidth = pageWidth - (margin * 2)
      const availableHeight = pageHeight - (margin * 2)
      
      // Calculer les dimensions de l'image pour qu'elle rentre dans la page
      const imgAspectRatio = canvas.width / canvas.height
      let imgWidth = availableWidth
      let imgHeight = availableWidth / imgAspectRatio
      
      // Si l'image est trop haute, ajuster selon la hauteur disponible
      if (imgHeight > availableHeight) {
        imgHeight = availableHeight
        imgWidth = availableHeight * imgAspectRatio
      }
      
      // Centrer l'image sur la page
      const x = (pageWidth - imgWidth) / 2
      const y = (pageHeight - imgHeight) / 2
      
      // Vérifier si l'image rentre sur une page
      if (imgHeight <= availableHeight) {
        pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight)
      } else {
        // Si l'image est trop grande, la diviser en plusieurs pages
        const totalPages = Math.ceil(imgHeight / availableHeight)
        
        for (let page = 0; page < totalPages; page++) {
          if (page > 0) {
            pdf.addPage()
          }
          
          const sourceY = page * availableHeight
          const sourceHeight = Math.min(availableHeight, imgHeight - sourceY)
          const destHeight = sourceHeight
          
          pdf.addImage(
            imgData, 
            'PNG', 
            x, 
            margin, 
            imgWidth, 
            destHeight
          )
        }
      }

      pdf.save(`mots-meles-${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
      alert('Erreur lors de l\'export PDF: ' + errorMessage)
    }
  }

  const printGrid = () => {
    try {
      // Créer un conteneur temporaire pour l'impression
      const printContainer = document.createElement('div')
      printContainer.style.position = 'absolute'
      printContainer.style.left = '-9999px'
      printContainer.style.top = '0'
      printContainer.style.width = '800px'
      printContainer.style.backgroundColor = '#ffffff'
      printContainer.style.padding = '20px'
      printContainer.style.fontFamily = settings.fontFamily
      printContainer.style.minHeight = 'auto'
      printContainer.style.boxSizing = 'border-box'
      
      // Ajouter le logo
      const logoContainer = document.createElement('div')
      logoContainer.style.position = 'absolute'
      logoContainer.style.top = '5px'
      logoContainer.style.left = '5px'
      logoContainer.style.zIndex = '10'
      
      const logoImg = document.createElement('img')
      logoImg.src = './melmofeuille.png'
      logoImg.style.height = '30px'
      logoImg.style.width = 'auto'
      logoContainer.appendChild(logoImg)
      printContainer.appendChild(logoContainer)
      
      // Créer la grille pour l'impression
      const gridContainer = document.createElement('div')
      gridContainer.style.display = 'grid'
      gridContainer.style.gridTemplateColumns = `repeat(${wordGrid.size}, 1fr)`
      gridContainer.style.gap = '0px'
      gridContainer.style.background = '#8B4513'
      gridContainer.style.padding = '12px'
      gridContainer.style.borderRadius = '12px'
      gridContainer.style.margin = '0 auto 20px auto'
      gridContainer.style.maxWidth = 'fit-content'
      gridContainer.style.border = '3px solid #FF8C42'
      gridContainer.style.width = 'fit-content'
      
      // Calculer la taille des cellules
      const cellSize = Math.min(35, Math.floor(600 / wordGrid.size))
      
      // Créer les cellules de la grille
      wordGrid.grid.flat().forEach((letter) => {
        const cell = document.createElement('div')
        cell.textContent = letter
        cell.style.width = `${cellSize}px`
        cell.style.height = `${cellSize}px`
        cell.style.background = 'linear-gradient(145deg, #FFF8DC 0%, #FFE4B5 100%)'
        cell.style.display = 'flex'
        cell.style.alignItems = 'center'
        cell.style.justifyContent = 'center'
        cell.style.fontWeight = 'bold'
        cell.style.fontSize = `${Math.max(12, cellSize * 0.5)}px`
        cell.style.fontFamily = 'Comfortaa, sans-serif'
        cell.style.borderRadius = '0'
        cell.style.border = 'none'
        cell.style.margin = '0'
        cell.style.padding = '0'
        cell.style.color = '#8B4513'
        cell.style.boxShadow = 'inset 0 1px 2px rgba(255, 255, 255, 0.8)'
        gridContainer.appendChild(cell)
      })
      
      printContainer.appendChild(gridContainer)
      
      // Ajouter la liste des mots si demandée
      if (exportOptions.includeWordList) {
        const wordsContainer = document.createElement('div')
        wordsContainer.style.marginTop = '20px'
        wordsContainer.style.textAlign = 'center'
        wordsContainer.style.background = 'linear-gradient(145deg, #FFF8DC 0%, #FFE4B5 100%)'
        wordsContainer.style.padding = '15px'
        wordsContainer.style.borderRadius = '12px'
        wordsContainer.style.border = '2px solid #FF8C42'
        wordsContainer.style.width = '100%'
        wordsContainer.style.boxSizing = 'border-box'
        
        const title = document.createElement('h3')
        title.textContent = 'Mots à trouver :'
        title.style.fontSize = '18px'
        title.style.marginBottom = '12px'
        title.style.color = '#8B4513'
        title.style.fontFamily = 'DynaPuff, cursive'
        title.style.textShadow = '1px 1px 2px rgba(255, 255, 255, 0.8)'
        wordsContainer.appendChild(title)
        
        const wordsList = document.createElement('div')
        wordsList.style.display = 'flex'
        wordsList.style.flexWrap = 'wrap'
        wordsList.style.justifyContent = 'center'
        wordsList.style.gap = '6px'
        wordsList.style.maxWidth = '100%'
        
        wordGrid.placedWords.forEach((placedWord) => {
          const wordSpan = document.createElement('span')
          wordSpan.textContent = placedWord.word.text
          wordSpan.style.background = 'linear-gradient(145deg, #FFB6C1 0%, #FFA0B4 100%)'
          wordSpan.style.padding = '6px 12px'
          wordSpan.style.borderRadius = '15px'
          wordSpan.style.fontSize = '12px'
          wordSpan.style.fontWeight = '700'
          wordSpan.style.fontFamily = 'Comfortaa, sans-serif'
          wordSpan.style.color = '#8B4513'
          wordSpan.style.border = '2px solid #FF8C42'
          wordSpan.style.boxShadow = '0 3px 8px rgba(255, 182, 193, 0.4)'
          wordSpan.style.textShadow = '1px 1px 2px rgba(255, 255, 255, 0.8)'
          wordSpan.style.display = 'inline-block'
          wordSpan.style.margin = '2px'
          wordsList.appendChild(wordSpan)
        })
        
        wordsContainer.appendChild(wordsList)
        printContainer.appendChild(wordsContainer)
      }
      
      // Ajouter le conteneur au DOM temporairement
      document.body.appendChild(printContainer)
      
      // Attendre que les images se chargent puis procéder
      setTimeout(() => {
        // Créer une nouvelle fenêtre pour l'impression
      const printWindow = window.open('', '_blank', 'width=800,height=600')
      if (!printWindow) {
        document.body.removeChild(printContainer)
        alert('Impossible d\'ouvrir la fenêtre d\'impression. Vérifiez que les pop-ups ne sont pas bloqués.')
        return
      }

      // Copier le contenu dans la nouvelle fenêtre
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Melmo - Mots Mêlés - ${new Date().toLocaleDateString()}</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=DynaPuff:wght@400;500;600;700&family=Comfortaa:wght@300;400;500;600;700&display=swap');
              
              body {
                font-family: 'Comfortaa', sans-serif;
                margin: 0;
                padding: 20px;
                background: white;
                color: #8B4513;
                min-height: 100vh;
              }
              
              .logo-container {
                margin-bottom: 20px;
                text-align: center;
              }
              
              .logo {
                height: 40px;
                width: auto;
              }
              
              .word-grid {
                display: grid;
                gap: 0px;
                background: #8B4513;
                padding: 15px;
                border-radius: 15px;
                margin: 20px auto;
                max-width: fit-content;
                border: 4px solid #FF8C42;
              }
              
              .word-grid-cell {
                background: linear-gradient(145deg, #FFF8DC 0%, #FFE4B5 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-family: 'Comfortaa', sans-serif;
                border-radius: 0;
                border: none;
                margin: 0;
                padding: 0;
                color: #8B4513;
                box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.8);
              }
              
              .words-list {
                margin-top: 30px;
                text-align: center;
                background: linear-gradient(145deg, #FFF8DC 0%, #FFE4B5 100%);
                padding: 20px;
                border-radius: 15px;
                border: 3px solid #FF8C42;
              }
              
              .words-list h3 {
                margin-bottom: 15px;
                font-size: 20px;
                color: #8B4513;
                font-family: 'DynaPuff', cursive;
                text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
              }
              
              .word-item {
                display: inline-block;
                background: linear-gradient(145deg, #FFB6C1 0%, #FFA0B4 100%);
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 700;
                font-family: 'Comfortaa', sans-serif;
                color: #8B4513;
                border: 2px solid #FF8C42;
                margin: 3px;
                box-shadow: 0 3px 8px rgba(255, 182, 193, 0.4);
                text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
              }
              
              @media print {
                body { 
                  margin: 0; 
                  padding: 10px; 
                  background: white !important;
                }
                .word-grid { margin: 15px auto; }
                .logo-container { margin-bottom: 15px; }
              }
            </style>
          </head>
          <body>
            <div class="logo-container">
              <img src="./melmofeuille.png" alt="Melmo" class="logo">
            </div>
            <div class="word-grid" style="grid-template-columns: repeat(${wordGrid.size}, 1fr);">
              ${wordGrid.grid.flat().map(letter =>
                `<div class="word-grid-cell" style="width: ${cellSize}px; height: ${cellSize}px; font-size: ${Math.max(12, cellSize * 0.5)}px;">${letter}</div>`
              ).join('')}
            </div>
            ${exportOptions.includeWordList ? `
              <div class="words-list">
                <h3>Mots à trouver :</h3>
                ${wordGrid.placedWords.map(placedWord =>
                  `<span class="word-item">${placedWord.word.text}</span>`
                ).join('')}
              </div>
            ` : ''}
          </body>
        </html>
      `)

      printWindow.document.close()
      
      // Nettoyer le conteneur temporaire
      document.body.removeChild(printContainer)
      
      // Attendre que la fenêtre soit prête puis imprimer
      printWindow.onload = () => {
        printWindow.focus()
        printWindow.print()
        
        // Fermer la fenêtre après impression
        printWindow.onafterprint = () => {
          printWindow.close()
        }
      }
      
      }, 500) // Attendre 500ms pour le chargement des images
      
    } catch (error) {
      console.error('Erreur lors de l\'impression:', error)
      alert('Erreur lors de l\'impression: ' + (error instanceof Error ? error.message : 'Erreur inconnue'))
    }
  }


  return (
    <div>
      <div className="controls mb-4">
        <button className="btn" onClick={exportToPDF}>
          <Download size={16} />
          Exporter PDF
        </button>
        
        <button className="btn btn-secondary" onClick={printGrid}>
          <Printer size={16} />
          Imprimer
        </button>
      </div>

      <div className="grid grid-2 mb-4">
        <div>
          <h4>Options d'export</h4>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={exportOptions.includeWordList}
                onChange={(e) => setExportOptions({
                  ...exportOptions,
                  includeWordList: e.target.checked
                })}
              />
              Inclure la liste des mots
            </label>
          </div>
          
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={exportOptions.includeSolutions}
                onChange={(e) => setExportOptions({
                  ...exportOptions,
                  includeSolutions: e.target.checked
                })}
              />
              Inclure les solutions
            </label>
          </div>
          
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={exportOptions.showGridLines}
                onChange={(e) => setExportOptions({
                  ...exportOptions,
                  showGridLines: e.target.checked
                })}
              />
              Afficher les lignes de grille
            </label>
          </div>
        </div>

        <div>
          <h4>Format</h4>
          <div className="form-group">
            <label>Taille de page</label>
            <select
              className="form-control"
              value={exportOptions.pageSize}
              onChange={(e) => setExportOptions({
                ...exportOptions,
                pageSize: e.target.value as 'A4' | 'A3' | 'Letter'
              })}
            >
              <option value="A4">A4</option>
              <option value="A3">A3</option>
              <option value="Letter">Letter</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Orientation</label>
            <select
              className="form-control"
              value={exportOptions.orientation}
              onChange={(e) => setExportOptions({
                ...exportOptions,
                orientation: e.target.value as 'portrait' | 'landscape'
              })}
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Paysage</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grille cachée pour l'export PDF - invisible mais nécessaire pour la référence */}
      <div
        ref={gridRef}
        style={{ display: 'none' }}
      >
        {/* Contenu de la grille pour l'export PDF */}
      </div>
    </div>
  )
}

export default ExportPanel
