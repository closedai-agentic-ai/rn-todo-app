# Task Manager - React Native Todo App

A beautiful, modern task management mobile application built with React Native and Expo, featuring a clean UI and smooth animations.

## 📱 Features

- ✅ Create, read, update, and delete tasks
- ✅ Mark tasks as completed
- ✅ Clear all tasks with a single button
- ✅ Clean, modern UI with smooth animations
- ✅ Optimized for iOS, Android, and Web
- ✅ Efficient state management with Zustand

## 📖 How to Use

1. **Add a new task**: Type your task in the input field at the top and press the "+" button or hit Enter.
2. **Mark a task as completed**: Tap the checkbox next to the task.
3. **Delete a task**: Tap the "×" button on the right side of the task.
4. **Clear all tasks**: Tap the "Clear All" button at the bottom.

## 🧩 State Management with Zustand

This project uses Zustand for state management, which offers several advantages:

- Minimal boilerplate compared to Redux
- No reducers, actions, or dispatchers
- Easy integration with React hooks
- Built-in state persistence capabilities
- Excellent TypeScript support

The store setup is simple and intuitive:

```javascript
// src/store/index.js
import create from "zustand";

export const useStore = create((set, get) => ({
  items: [],
  addItem: (text) => {
    /* implementation */
  },
  removeItem: (id) => {
    /* implementation */
  },
  toggleItem: (id) => {
    /* implementation */
  },
}));
```
