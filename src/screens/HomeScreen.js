import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from "react-native";
import shallow from "zustand/shallow";
import { useStore, useReset } from "../store";
import TodoList from "../components/TodoList";
import { styles } from "../styles/styles";

const HomeScreen = () => {
  const { items, addItem } = useStore(
    ({ addItem, items }) => ({
      items,
      addItem,
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
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
        <Text style={{ flex: 1 }}></Text>
        <TouchableOpacity
          style={[styles.resetButton, { marginBottom: 8 }]}
          onPress={() =>
            useStore.getState().clearItems({ onlyCompleted: true })
          }>
          <Text style={styles.resetButtonText}>Clear Completed</Text>
        </TouchableOpacity>
      </View>
      <TodoList />

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => useStore.getState().clearItems()}>
          <Text style={styles.resetButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;
