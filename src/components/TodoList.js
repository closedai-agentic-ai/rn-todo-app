import React from "react";
import { Text, View, ScrollView } from "react-native";
import shallow from "zustand/shallow";
import { useStore } from "../store";
import TodoItem from "./TodoItem";
import { styles } from "../styles/styles";

const TodoList = () => {
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
};

export default TodoList;
