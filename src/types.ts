export interface Word {
  text: string
  definition?: string
  category?: string
  difficulty?: 'easy' | 'medium' | 'hard'
}

export interface PlacedWord {
  word: Word
  startRow: number
  startCol: number
  direction: 'horizontal' | 'vertical' | 'diagonal' | 'horizontal-reverse' | 'vertical-reverse' | 'diagonal-reverse'
  length: number
}

export interface WordGrid {
  grid: string[][]
  placedWords: PlacedWord[]
  size: number
  difficulty: string
  generationTime: number
}

export interface GameSettings {
  gridSize: number
  difficulty: 'easy' | 'medium' | 'hard'
  allowDiagonal: boolean
  allowReverse: boolean
  allowHorizontal: boolean
  allowVertical: boolean
  fontFamily: string
  fontSize: number
}

export interface DictionaryEntry {
  word: string
  definition: string
  category: string
  difficulty: number
}

export interface GridCell {
  letter: string
  isPartOfWord: boolean
  wordId?: string
  isHighlighted?: boolean
}

export interface ExportOptions {
  includeWordList: boolean
  includeSolutions: boolean
  showGridLines: boolean
  pageSize: 'A4' | 'A3' | 'Letter'
  orientation: 'portrait' | 'landscape'
}
