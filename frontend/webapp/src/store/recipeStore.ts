import create from 'zustand';

interface Recipe {
  id: number;
  name: string;
  style?: string;
  og?: number;
}

interface RecipeState {
  recipes: Recipe[];
  setRecipes: (data: Recipe[]) => void;
}

export const useRecipeStore = create<RecipeState>()((set) => ({
  recipes: [],
  setRecipes: (data) => set({ recipes: data }),
}));
