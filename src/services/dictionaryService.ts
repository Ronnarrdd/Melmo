import type { Word } from '../types'

class DictionaryService {
  private static instance: DictionaryService
  private cache: Map<string, Word[]> = new Map()

  private constructor() {}

  public static getInstance(): DictionaryService {
    if (!DictionaryService.instance) {
      DictionaryService.instance = new DictionaryService()
    }
    return DictionaryService.instance
  }

  // Méthode pour obtenir des mots aléatoires depuis l'API trouve-mot.fr
  private async fetchRandomWords(count: number, difficulty: 'easy' | 'medium' | 'hard'): Promise<Word[]> {
    try {
      const validWords: Word[] = []
      const categories = this.getCategoriesByDifficulty(difficulty)
      
      // Mélanger les catégories pour avoir de la variété
      const shuffledCategories = this.shuffleArray([...categories])
      
      // Calculer combien de mots récupérer par catégorie
      const wordsPerCategory = Math.max(1, Math.ceil(count / shuffledCategories.length))
      
      // Récupérer des mots de plusieurs catégories différentes
      for (const category of shuffledCategories) {
        if (validWords.length >= count) break
        
        try {
          // Récupérer des mots de cette catégorie
          const fetchCount = Math.min(wordsPerCategory * 2, 20) // Récupérer plus pour compenser les filtres
          const response = await fetch(`https://trouve-mot.fr/api/categorie/${category}/${fetchCount}`)
          const data = await response.json()
          
          if (Array.isArray(data) && data.length > 0) {
            // Filtrer et traiter les mots valides
            const words = data
              .filter((item: any) => this.isValidWord(item.name))
              .map((item: any) => ({
                text: this.removeAccents(item.name).toUpperCase(),
                definition: `Mot de la catégorie ${this.getCategoryName(category)}`,
                category: this.getCategoryName(category),
                difficulty: difficulty
              }))
            
            validWords.push(...words)
          }
        } catch (categoryError) {
          console.warn(`Erreur lors du chargement de la catégorie ${category}:`, categoryError)
          // Continuer avec la catégorie suivante
        }
      }
      
      // Mélanger les mots pour avoir de la variété dans l'ordre
      const shuffledWords = this.shuffleArray(validWords)
      
      // Retourner seulement le nombre demandé
      return shuffledWords.slice(0, count)
    } catch (error) {
      console.warn('Erreur lors du chargement du dictionnaire en ligne:', error)
      return []
    }
  }

  // Obtenir les catégories selon la difficulté
  private getCategoriesByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): number[] {
    switch (difficulty) {
      case 'easy':
        // Catégories simples : animaux, nature, couleurs, etc.
        return [19, 21, 2, 5, 6, 7, 8, 12, 15, 16, 17, 20]
      case 'medium':
        // Catégories moyennes : école, travail, communication, etc.
        return [1, 3, 4, 9, 10, 11, 13, 14, 18, 22, 23, 24]
      case 'hard':
        // Catégories complexes : gouvernement, armée, médecine, etc.
        return [25, 26, 27, 1, 3, 4, 7, 9, 10, 11, 13, 14, 18, 22, 23, 24]
      default:
        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27]
    }
  }

  // Obtenir le nom de la catégorie
  private getCategoryName(categoryId: number): string {
    const categories: { [key: number]: string } = {
      1: 'École',
      2: 'Paysages',
      3: 'Qualités',
      4: 'Calcul',
      5: 'Aliments',
      6: 'Corps humain',
      7: 'Sens',
      8: 'Intérieur',
      9: 'Industrie',
      10: 'Arts',
      11: 'Agriculture',
      12: 'Nature',
      13: 'Mouvements',
      14: 'Temps',
      15: 'Vêtements',
      16: 'Sports',
      17: 'Maison',
      18: 'Voyages',
      19: 'Animaux',
      20: 'Ville',
      21: 'Eaux',
      22: 'Commerce',
      23: 'Communication',
      24: 'Émotions',
      25: 'Gouvernement',
      26: 'Armée',
      27: 'Santé'
    }
    return categories[categoryId] || 'Général'
  }

  public async getWordsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Promise<Word[]> {
    const cacheKey = difficulty
    
    // Vérifier le cache d'abord
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!
    }

    // Obtenir des mots en ligne
    const onlineWords = await this.fetchRandomWords(50, difficulty)
    
    // Mélanger les mots
    const shuffledWords = this.shuffleArray([...onlineWords])
    
    // Mettre en cache et retourner
    this.cache.set(cacheKey, shuffledWords)
    return shuffledWords
  }

  // Fonction utilitaire pour supprimer les accents
  private removeAccents(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  }

  // Fonction utilitaire pour vérifier si un mot est valide pour la grille
  private isValidWord(word: string): boolean {
    const cleanWord = this.removeAccents(word).toUpperCase()
    // Exclure les mots avec des tirets, espaces, ou caractères spéciaux
    return /^[A-Z]+$/.test(cleanWord) && cleanWord.length >= 3
  }

  // Fonction utilitaire pour mélanger un tableau
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Méthode pour vider le cache et forcer de nouveaux mots
  public clearCache(): void {
    this.cache.clear()
  }

  // Méthode pour obtenir de nouveaux mots (force le rechargement)
  public async getNewWordsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Promise<Word[]> {
    this.clearCache()
    return this.getWordsByDifficulty(difficulty)
  }

  // Méthode pour obtenir des mots par catégorie
  public async getWordsByCategory(categoryId: number, count: number = 20): Promise<Word[]> {
    try {
      const response = await fetch(`https://trouve-mot.fr/api/categorie/${categoryId}/${count}`)
      const data = await response.json()
      
      if (Array.isArray(data) && data.length > 0) {
        return data
          .filter((item: any) => this.isValidWord(item.name))
          .map((item: any) => ({
            text: this.removeAccents(item.name).toUpperCase(),
            definition: `Mot de la catégorie ${this.getCategoryName(categoryId)}`,
            category: this.getCategoryName(categoryId),
            difficulty: 'medium'
          }))
      }
      
      return []
    } catch (error) {
      console.warn('Erreur lors du chargement des mots par catégorie:', error)
      return []
    }
  }

  // Méthode pour obtenir des mots par longueur
  public async getWordsByLength(length: number, count: number = 20): Promise<Word[]> {
    try {
      const response = await fetch(`https://trouve-mot.fr/api/size/${length}/${count}`)
      const data = await response.json()
      
      if (Array.isArray(data) && data.length > 0) {
        return data
          .filter((item: any) => this.isValidWord(item.name))
          .map((item: any) => ({
            text: this.removeAccents(item.name).toUpperCase(),
            definition: `Mot français de ${length} lettres`,
            category: 'Général',
            difficulty: length <= 6 ? 'easy' : length <= 8 ? 'medium' : 'hard'
          }))
      }
      
      return []
    } catch (error) {
      console.warn('Erreur lors du chargement des mots par longueur:', error)
      return []
    }
  }

  // Méthode pour obtenir des mots aléatoires
  public async getRandomWords(count: number = 20): Promise<Word[]> {
    try {
      const response = await fetch(`https://trouve-mot.fr/api/random/${count}`)
      const data = await response.json()
      
      if (Array.isArray(data) && data.length > 0) {
        return data
          .filter((item: any) => this.isValidWord(item.name))
          .map((item: any) => ({
            text: this.removeAccents(item.name).toUpperCase(),
            definition: 'Mot français aléatoire',
            category: 'Général',
            difficulty: item.name.length <= 6 ? 'easy' : item.name.length <= 8 ? 'medium' : 'hard'
          }))
      }
      
      return []
    } catch (error) {
      console.warn('Erreur lors du chargement des mots aléatoires:', error)
      return []
    }
  }

  // Obtenir toutes les catégories disponibles
  public getAvailableCategories(): { id: number; name: string }[] {
    return [
      { id: 1, name: 'École' },
      { id: 2, name: 'Paysages' },
      { id: 3, name: 'Qualités' },
      { id: 4, name: 'Calcul' },
      { id: 5, name: 'Aliments' },
      { id: 6, name: 'Corps humain' },
      { id: 7, name: 'Sens' },
      { id: 8, name: 'Intérieur' },
      { id: 9, name: 'Industrie' },
      { id: 10, name: 'Arts' },
      { id: 11, name: 'Agriculture' },
      { id: 12, name: 'Nature' },
      { id: 13, name: 'Mouvements' },
      { id: 14, name: 'Temps' },
      { id: 15, name: 'Vêtements' },
      { id: 16, name: 'Sports' },
      { id: 17, name: 'Maison' },
      { id: 18, name: 'Voyages' },
      { id: 19, name: 'Animaux' },
      { id: 20, name: 'Ville' },
      { id: 21, name: 'Eaux' },
      { id: 22, name: 'Commerce' },
      { id: 23, name: 'Communication' },
      { id: 24, name: 'Émotions' },
      { id: 25, name: 'Gouvernement' },
      { id: 26, name: 'Armée' },
      { id: 27, name: 'Santé' }
    ]
  }
}

export default DictionaryService