import create from 'zustand';

interface RawMaterial {
  id: number;
  name: string;
  category: string;
  stock: number;
}

interface InventoryState {
  items: RawMaterial[];
  setItems: (data: RawMaterial[]) => void;
}

export const useInventoryStore = create<InventoryState>()((set) => ({
  items: [],
  setItems: (data) => set({ items: data }),
}));
