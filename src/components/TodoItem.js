import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { styles } from "../styles/styles";

const TodoItem = ({ item, onToggle, onRemove, isLast }) => {
  return (
    <View style={[styles.todoItem, isLast && styles.todoItemLast]}>
      <TouchableOpacity style={styles.todoContent} onPress={onToggle}>
        <View
          style={[styles.checkbox, item.completed && styles.checkboxCompleted]}
        >
          {item.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text
          style={[styles.todoText, item.completed && styles.todoTextCompleted]}
        >
          {item.text}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
        <Text style={styles.removeButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TodoItem;
