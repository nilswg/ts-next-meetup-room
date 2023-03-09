import { create } from 'zustand'

type Store = {
  open: boolean
  dropdown: {
    webcam: boolean
    audio: boolean
    microphone: boolean
  }
}

type Actions = {
  setOpen: (open: boolean) => void
  setWebcamOpen: (open: boolean) => void
  setAduioOpen: (open: boolean) => void
  setMicrophoneOpen: (open: boolean) => void
}

export const useSidebarStore = create<Store & Actions>((set) => ({
  open: false,
  dropdown: {
    webcam: false,
    audio: false,
    microphone: false,
  },
  setOpen: (open: boolean) => {
    if (!open) {
      set((state) => ({ open, dropdown: { webcam: false, audio: false, microphone: false } }))
    } else {
      set((state) => ({ open }))
    }
  },
  setWebcamOpen: (open: boolean) => {
    set((state) => ({ dropdown: { ...state.dropdown, webcam: open } }))
  },
  setAduioOpen: (open: boolean) => {
    set((state) => ({ dropdown: { ...state.dropdown, audio: open } }))
  },
  setMicrophoneOpen: (open: boolean) => {
    set((state) => ({ dropdown: { ...state.dropdown, microphone: open } }))
  },
}))
