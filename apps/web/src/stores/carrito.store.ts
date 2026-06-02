import { create } from 'zustand';

interface NumeroSeleccionado {
  id: string;
  numeroVisible: number;
  sorteoId: string;
}

interface CarritoStore {
  seleccionados: NumeroSeleccionado[];
  agregar: (numero: NumeroSeleccionado) => void;
  quitar: (id: string) => void;
  limpiar: () => void;
  tiene: (id: string) => boolean;
}

export const useCarritoStore = create<CarritoStore>((set, get) => ({
  seleccionados: [],
  agregar: (numero) => set(s => ({
    seleccionados: s.seleccionados.some(n => n.id === numero.id)
      ? s.seleccionados
      : [...s.seleccionados, numero],
  })),
  quitar: (id) => set(s => ({ seleccionados: s.seleccionados.filter(n => n.id !== id) })),
  limpiar: () => set({ seleccionados: [] }),
  tiene: (id) => get().seleccionados.some(n => n.id === id),
}));
