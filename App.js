import React, { useState, useEffect, useRef } from 'react'
import {
  StyleSheet,
  Keyboard,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList
} from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Feather } from '@expo/vector-icons'
import { Login } from './src/components/Login'
import { TaskList } from './src/components/TaskList'
import firebase from './src/services/firebaseConnection'

export default function App() {
  const inputRef = useRef(null)
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [keyState, setKeyState] = useState('')

  useEffect(() => {
    function getUser() {
      if (!user) {
        return
      }

      firebase
        .database()
        .ref('tasks')
        .child(user)
        .once('value', snapshot => {
          setTasks([])
          snapshot?.forEach(childItem => {
            let data = {
              key: childItem.key,
              name: childItem.val().name
            }
            setTasks(oldTasks => [...oldTasks, data])
          })
        })
    }

    getUser()
  }, [user])

  function handleAddTask() {
    if (newTask === '') {
      return
    }

    // Usuário quer editar uma tarefa.
    if (keyState !== '') {
      firebase
        .database()
        .ref('tasks')
        .child(user)
        .child(keyState)
        .update({
          name: newTask
        })
        .then(() => {
          const taskIndex = tasks.findIndex(item => item.key === keyState)
          const taskClone = tasks
          taskClone[taskIndex].name = newTask

          setTasks([...taskClone])
        })
      Keyboard.dismiss()
      setNewTask('')
      setKeyState('')
      return
    }

    let tasks = firebase.database().ref('tasks').child(user)
    let randomKey = tasks.push().key

    tasks
      .child(randomKey)
      .set({
        name: newTask
      })
      .then(() => {
        const data = {
          key: randomKey,
          name: newTask
        }

        setTasks(oldTasks => [...oldTasks, data])
      })
    setNewTask('')
    Keyboard.dismiss()
  }

  function handleDeleteTask(key) {
    firebase
      .database()
      .ref('tasks')
      .child(user)
      .child(key)
      .remove()
      .then(() => {
        const findTasks = tasks.filter(item => item.key !== key)
        setTasks(findTasks)
      })
  }

  function handleEditTask(data) {
    setKeyState(data.key)
    setNewTask(data.name)
    inputRef.current.focus()
  }

  if (!user) {
    return <Login changeStatus={user => setUser(user)} />
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.inputContainer}>
        <TextInput
          value={newTask}
          onChangeText={text => setNewTask(text)}
          ref={inputRef}
          style={styles.input}
          placeholder="Adicione sua tarefa..."
          underlineColorAndroid="transparent"
        />
        <TouchableOpacity onPress={handleAddTask} style={styles.buttonAddTask}>
          <Feather name="plus" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <TaskList
            data={item}
            deleteItem={handleDeleteTask}
            editItem={handleEditTask}
          />
        )}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    paddingHorizontal: 10,
    backgroundColor: '#f2f6fc'
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20
  },
  input: {
    flex: 1,
    height: 45,
    backgroundColor: '#fff',
    borderRadius: 4,
    fontSize: 16,
    padding: 10
  },
  buttonAddTask: {
    backgroundColor: '#3ea6f2',
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginLeft: 10,
    borderRadius: 5
  },
  btnText: {
    color: '#fff',
    fontSize: 20
  }
})
