import React, { useState, useEffect } from 'react'
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
import { Feather } from 'react-native-vector-icons'
import { Login } from './src/components/Login'
import { TaskList } from './src/components/TaskList'
import firebase from './src/services/firebaseConnection'

export default function App() {
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')

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
            setTasks(oldTasks => [...oldTasks, data].reverse())
          })
        })
    }

    getUser()
  }, [user])

  function handleAddTask() {
    if (newTask === '') {
      return
    }

    let tasks = firebase.database().ref('tasks').child(user)
    let key = tasks.push().key

    tasks
      .child(key)
      .set({
        name: newTask
      })
      .then(() => {
        const data = {
          key: key,
          name: newTask
        }

        setTasks(oldTasks => [...oldTasks, data].reverse())
      })
    setNewTask('')
    Keyboard.dismiss()
  }

  function handleDeleteTask(id) {
    console.log(id)
  }

  function handleEditTask(data) {
    console.log('ITEM CLICADO ' + JSON.stringify(data))
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
        keyExtractor={item => item.id}
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
