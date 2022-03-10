import React, { useState, useEffect, useRef } from 'react'
import {
  StyleSheet,
  Keyboard,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Text
} from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Feather } from '@expo/vector-icons'
import { Login } from './src/components/Login'
import { TaskList } from './src/components/TaskList'
import firebase from './src/services/firebaseConnection'

export default function App() {
  const inputRef = useRef(null)
  const [user, setUser] = useState(null)
  const [task, setTask] = useState([])
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
          setTask([])
          snapshot?.forEach(childItem => {
            let data = {
              key: childItem.key,
              name: childItem.val().name
            }
            setTask(oldTask => [...oldTask, data])
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
          const taskIndex = task.findIndex(item => item.key === keyState)
          const taskClone = task
          taskClone[taskIndex].name = newTask

          setTask([...taskClone])
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

        setTask(oldTask => [...oldTask, data])
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
        const findTasks = task.filter(item => item.key !== key)
        setTask(findTasks)
      })
  }

  function handleEditTask(data) {
    setKeyState(data.key)
    setNewTask(data.name)
    inputRef.current.focus()
  }

  function cancelEdit() {
    setKeyState('')
    setNewTask('')
    Keyboard.dismiss()
  }

  function handleLogOut() {
    firebase.auth().signOut()
    setUser(null)
  }

  if (!user) {
    return <Login changeStatus={user => setUser(user)} />
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {keyState.length > 0 && (
        <View style={styles.editAlert}>
          <TouchableOpacity onPress={cancelEdit}>
            <Feather name="x-circle" size={25} color="#ff5252" />
          </TouchableOpacity>
          <Text style={{ marginLeft: 10, color: '#ff5252', fontSize: 18 }}>
            Você está editando uma tarefa!!
          </Text>
        </View>
      )}

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
        data={task}
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <TaskList
            data={item}
            deleteItem={handleDeleteTask}
            editItem={handleEditTask}
          />
        )}
        showsVerticalScrollIndicator={false}
      />

      {user && (
        <TouchableOpacity onPress={handleLogOut} style={styles.buttonLogout}>
          <Feather name="log-out" size={25} color="#fff" />
          <Text style={[styles.btnText, { marginLeft: 20, fontSize: 22 }]}>
            LOGOUT
          </Text>
        </TouchableOpacity>
      )}
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
  editAlert: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 8
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
  },
  logoutContainer: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#323232',
    marginBottom: 10,
    alignItems: 'center'
  },
  buttonLogout: {
    backgroundColor: '#323232',
    marginTop: 10,
    marginBottom: 10,
    padding: 8,
    borderRadius: 4,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
