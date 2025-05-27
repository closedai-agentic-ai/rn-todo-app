import React, { useState } from "react";
import {
  Button,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Dimensions,
} from "react-native";
import shallow from "zustand/shallow";

import { useReset, useStore } from "./store";

export default function App() {
  const { items, addItem, removeItem, toggleItem } = useStore(
    ({ addItem, items, removeItem, toggleItem }) => ({
      items,
      addItem,
      removeItem,
      toggleItem,
    }),
    shallow
  );

  const [newItemText, setNewItemText] = useState("");

  const handleAddItem = () => {
    if (newItemText.trim()) {
      addItem(newItemText.trim());
      setNewItemText("");
    }
  };

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Tasks</Text>
        <Text style={styles.headerSubtitle}>
          {completedCount} of {totalCount} completed
        </Text>
      </View>

      {/* Add Item Section */}
      <View style={styles.addItemContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Add a new task..."
          placeholderTextColor="#a0a0a0"
          value={newItemText}
          onChangeText={setNewItemText}
          onSubmitEditing={handleAddItem}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Todo List */}
      <TodoList />

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.resetButton} onPress={() => useReset()}>
          <Text style={styles.resetButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function TodoList() {
  const { items, removeItem, toggleItem } = useStore(
    ({ items, removeItem, toggleItem }) => ({ items, removeItem, toggleItem }),
    shallow
  );

  if (items.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateText}>No tasks yet</Text>
        <Text style={styles.emptyStateSubtext}>Add a task to get started!</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.todoList} showsVerticalScrollIndicator={false}>
      {items.map((item, index) => (
        <TodoItem
          key={item.id}
          item={item}
          onToggle={() => toggleItem(item.id)}
          onRemove={() => removeItem(item.id)}
          isLast={index === items.length - 1}
        />
      ))}
    </ScrollView>
  );
}

function TodoItem({ item, onToggle, onRemove, isLast }) {
  return (
    <View style={[styles.todoItem, isLast && styles.todoItemLast]}>
      <TouchableOpacity style={styles.todoContent} onPress={onToggle}>
        <View
          style={[styles.checkbox, item.completed && styles.checkboxCompleted]}>
          {item.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text
          style={[styles.todoText, item.completed && styles.todoTextCompleted]}>
          {item.text}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
        <Text style={styles.removeButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#667eea",
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#e2e8f0",
    opacity: 0.9,
  },
  addItemContainer: {
    flexDirection: "row",
    margin: 20,
    marginBottom: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    color: "#2d3748",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#48bb78",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#48bb78",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
  },
  todoList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#a0aec0",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: "#cbd5e0",
    textAlign: "center",
  },
  todoItem: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    marginBottom: 12,
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  todoItemLast: {
    marginBottom: 20,
  },
  todoContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxCompleted: {
    backgroundColor: "#48bb78",
    borderColor: "#48bb78",
  },
  checkmark: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
  },
  todoText: {
    fontSize: 16,
    color: "#2d3748",
    flex: 1,
  },
  todoTextCompleted: {
    textDecorationLine: "line-through",
    color: "#a0aec0",
  },
  removeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#fed7d7",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  removeButtonText: {
    color: "#e53e3e",
    fontSize: 18,
    fontWeight: "bold",
  },
  bottomActions: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 10,
  },
  resetButton: {
    backgroundColor: "#e53e3e",
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: "center",
    shadowColor: "#e53e3e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  resetButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
