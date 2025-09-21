import React, { useState } from 'react'
import { HelpCircle, X, ChevronRight, ChevronDown } from 'lucide-react'

const HelpGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const sections = [
    {
      id: 'quick-start',
      title: '🚀 Démarrage Rapide',
      content: (
        <div>
          <p><strong>1. Configuration Rapide :</strong> Cliquez sur une des cartes (Facile, Moyen, Difficile) pour commencer immédiatement.</p>
          <p><strong>2. Exemples Prédéfinis :</strong> Choisissez un thème prédéfini (Nature, Culture, Science) pour une expérience guidée.</p>
          <p><strong>3. Génération :</strong> Cliquez sur "Générer ma grille" pour créer votre mots mêlés.</p>
        </div>
      )
    },
    {
      id: 'customization',
      title: '⚙️ Personnalisation',
      content: (
        <div>
          <p><strong>Taille de grille :</strong> De 10×10 (facile) à 25×25 (expert)</p>
          <p><strong>Difficulté :</strong> Facile (mots courts), Moyen (mots variés), Difficile (mots complexes)</p>
          <p><strong>Directions :</strong> Activez/désactivez horizontal, vertical, diagonal, et inversé</p>
          <p><strong>Mots personnalisés :</strong> Ajoutez vos propres mots ou importez un fichier CSV</p>
        </div>
      )
    },
    {
      id: 'features',
      title: '✨ Fonctionnalités',
      content: (
        <div>
          <p><strong>Visualiseur de solutions :</strong> Cliquez sur "Afficher les solutions" pour voir les mots placés</p>
          <p><strong>Export PDF :</strong> Téléchargez votre grille en PDF pour l'imprimer</p>
          <p><strong>Statistiques :</strong> Consultez les détails de votre grille générée</p>
          <p><strong>Impression :</strong> Imprimez directement depuis le navigateur</p>
        </div>
      )
    },
    {
      id: 'tips',
      title: '💡 Conseils',
      content: (
        <div>
          <p><strong>Pour de meilleurs résultats :</strong></p>
          <ul>
            <li>Commencez par des grilles plus petites (10×10 ou 15×15)</li>
            <li>Utilisez des mots de longueurs variées</li>
            <li>Activez toutes les directions pour plus de flexibilité</li>
            <li>Testez différents niveaux de difficulté</li>
          </ul>
        </div>
      )
    }
  ]

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId)
  }

  return (
    <>
      <button
        className="help-button"
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        <HelpCircle size={24} />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1001,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            className="card"
            style={{
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              borderBottom: '2px solid #f0f0f0',
              paddingBottom: '12px'
            }}>
              <h2 style={{ margin: 0, color: '#333' }}>📚 Guide d'Utilisation</h2>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '4px',
                  color: '#666'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div>
              {sections.map((section) => (
                <div key={section.id} style={{ marginBottom: '16px' }}>
                  <button
                    onClick={() => toggleSection(section.id)}
                    style={{
                      width: '100%',
                      background: '#f8f9fa',
                      border: '1px solid #e9ecef',
                      borderRadius: '8px',
                      padding: '16px',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      textAlign: 'left',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#333'
                    }}
                  >
                    {section.title}
                    {expandedSection === section.id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  </button>
                  
                  {expandedSection === section.id && (
                    <div style={{
                      background: '#f8f9fa',
                      border: '1px solid #e9ecef',
                      borderTop: 'none',
                      borderRadius: '0 0 8px 8px',
                      padding: '16px',
                      marginTop: '-1px'
                    }}>
                      {section.content}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{
              marginTop: '20px',
              padding: '16px',
              background: '#e3f2fd',
              borderRadius: '8px',
              border: '1px solid #bbdefb'
            }}>
              <p style={{ margin: 0, color: '#1565c0', fontWeight: '600' }}>
                💡 <strong>Astuce :</strong> Vous pouvez commencer immédiatement en cliquant sur une des cartes de configuration rapide !
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default HelpGuide
