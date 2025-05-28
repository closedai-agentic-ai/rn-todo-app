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
        ],
      });
    },
    removeItem(id) {
      const items = get().items;
      set({ items: items.filter((item) => item.id !== id) });
    },
    toggleItem(id) {
      const items = get().items;
      set({
        items: items.map((item) =>
          item.id === id ? { ...item, completed: !item.completed } : item
        ),
      });
    },
  });
});

export function useReset() {
  useStore.setState(initialState);
}
