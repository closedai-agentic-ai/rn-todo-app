import create from "zustand";

const initialState = {
  items: [],
};

export const useStore = create((set, get) => {
  return Object.assign(initialState, {
    items: [],
    addItem(text) {
      const items = get().items;
      set({
        items: [
          ...items,
          {
            text,
            id: Math.random(),
            completed: false,
            createdAt: new Date().toISOString(),
          },
        ],
      });
    },
    removeItem(id) {
      const items = get().items;
      set({ items: items.filter(item => item.id !== id) });
    },
    toggleItem(id) {
      const items = get().items;
      set({
        items: items.map(item =>
          item.id === id ? { ...item, completed: !item.completed } : item
        ),
      });
    },
    clearItems({ onlyCompleted = false } = {}) {
      const items = get().items;
      if (onlyCompleted) {
        set({ items: items.filter(item => item.completed) });
      } else {
        set({ items: [] });
      }
    },
  });
});

export function useReset() {
  useStore.getState().clearItems();
}
