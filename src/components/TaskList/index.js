import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native'
import { Feather } from '@expo/vector-icons'

export function TaskList({ data, deleteItem, editItem }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => deleteItem(data.key)}>
        <Feather name="trash" size={20} color="#fff" />
      </TouchableOpacity>

      <View style={{ paddingRight: 10 }}>
        <TouchableWithoutFeedback onPress={() => editItem(data)}>
          <Text style={{ color: '#fff', marginLeft: 10, paddingRight: 10 }}>
            {data.name}
          </Text>
        </TouchableWithoutFeedback>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 10,
    flexDirection: 'row',
    backgroundColor: '#454545',
    alignItems: 'center',
    padding: 10,
    borderRadius: 4
  }
})
