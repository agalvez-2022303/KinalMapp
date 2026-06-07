'use client'
import { useState, useEffect, useCallback } from 'react'
import { albumSections, type AlbumSection } from './kinal-data'

const STORAGE_KEY = 'kinalmap-album-v1'
const CHECKPOINTS_STORAGE_KEY = 'kinalmap-checkpoints-v1'

export type View = 'home' | 'map' | 'scanner' | 'album' | 'historia'

export interface AppState {
  sections: AlbumSection[]
  unlockedCheckpoints: string[]
  totalStickers: number
  unlockedStickers: number
  progressPercent: number
}

function computeState(sections: AlbumSection[]): Pick<AppState, 'totalStickers' | 'unlockedStickers' | 'progressPercent'> {
  const total = sections.reduce((s, sec) => s + sec.stickers.length, 0)
  const unlocked = sections.reduce((s, sec) => s + sec.stickers.filter(st => st.unlocked).length, 0)
  return {
    totalStickers: total,
    unlockedStickers: unlocked,
    progressPercent: total > 0 ? Math.round((unlocked / total) * 100) : 0,
  }
}

function loadSections(): AlbumSection[] {
  if (typeof window === 'undefined') return albumSections
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return albumSections
    const saved: { id: string; stickers: { id: string; unlocked: boolean }[] }[] = JSON.parse(raw)
    return albumSections.map(sec => {
      const savedSec = saved.find(s => s.id === sec.id)
      if (!savedSec) return sec
      return {
        ...sec,
        stickers: sec.stickers.map(st => {
          const savedSt = savedSec.stickers.find(s => s.id === st.id)
          return savedSt ? { ...st, unlocked: savedSt.unlocked } : st
        }),
      }
    })
  } catch {
    return albumSections
  }
}

function saveSections(sections: AlbumSection[]) {
  if (typeof window === 'undefined') return
  const data = sections.map(sec => ({
    id: sec.id,
    stickers: sec.stickers.map(st => ({ id: st.id, unlocked: st.unlocked })),
  }))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function loadCheckpoints(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(CHECKPOINTS_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveCheckpoints(checkpoints: string[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(CHECKPOINTS_STORAGE_KEY, JSON.stringify(checkpoints))
}

export function useAppStore() {
  const [sections, setSections] = useState<AlbumSection[]>(albumSections)
  const [unlockedCheckpoints, setUnlockedCheckpoints] = useState<string[]>([])

  useEffect(() => {
    setSections(loadSections())
    setUnlockedCheckpoints(loadCheckpoints())
  }, [])

  const unlockCheckpoint = useCallback((checkpointId: string): { newlyUnlocked: string[] } => {
    if (unlockedCheckpoints.includes(checkpointId)) {
      return { newlyUnlocked: [] }
    }
    const nextCheckpoints = [...unlockedCheckpoints, checkpointId]
    setUnlockedCheckpoints(nextCheckpoints)
    saveCheckpoints(nextCheckpoints)

    const newlyUnlocked: string[] = []
    setSections(prev => {
      const updated = prev.map(sec => ({
        ...sec,
        stickers: sec.stickers.map(st => {
          if (st.checkpointId === checkpointId && !st.unlocked) {
            newlyUnlocked.push(st.name)
            return { ...st, unlocked: true }
          }
          return st
        }),
      }))
      saveSections(updated)
      return updated
    })
    return { newlyUnlocked }
  }, [unlockedCheckpoints])

  const autocompleteAlbum = useCallback((): { newlyUnlocked: string[] } => {
    const allCheckpoints = ['CP-A', 'CP-B', 'CP-C', 'CP-D']
    setUnlockedCheckpoints(allCheckpoints)
    saveCheckpoints(allCheckpoints)

    const newlyUnlocked: string[] = []
    setSections(prev => {
      const updated = prev.map(sec => ({
        ...sec,
        stickers: sec.stickers.map(st => {
          if (!st.unlocked) {
            newlyUnlocked.push(st.name)
            return { ...st, unlocked: true }
          }
          return st
        }),
      }))
      saveSections(updated)
      return updated
    })
    return { newlyUnlocked }
  }, [])

  const resetAlbum = useCallback(() => {
    setUnlockedCheckpoints([])
    saveCheckpoints([])
    setSections(albumSections.map(sec => ({
      ...sec,
      stickers: sec.stickers.map(st => ({ ...st, unlocked: false }))
    })))
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(CHECKPOINTS_STORAGE_KEY)
    }
  }, [])

  const { totalStickers, unlockedStickers, progressPercent } = computeState(sections)

  return {
    sections,
    unlockedCheckpoints,
    totalStickers,
    unlockedStickers,
    progressPercent,
    unlockCheckpoint,
    autocompleteAlbum,
    resetAlbum,
  }
}
