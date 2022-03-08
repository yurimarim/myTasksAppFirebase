import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView
} from 'react-native'
import { Login } from './src/components/Login'

export default function App() {
  const [user, setUser] = useState(null)

  if (!user) {
    return <Login changeStatus={user => setUser(user)} />
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Text>DENTRO DA TELA TAREFAS!!!</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    paddingHorizontal: 10,
    backgroundColor: '#f2f6fc'
  }
})
