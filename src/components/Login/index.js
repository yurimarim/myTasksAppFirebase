import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Keyboard
} from 'react-native'
import firebase from '../../services/firebaseConnection'

export function Login({ changeStatus }) {
  const [type, setType] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleLogin() {
    if (type === 'login') {
      const user = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(value => {
          // alert(`Logado com sucesso! ${value.user.email}`)
          changeStatus(value.user.uid)
        })
        .catch(err => {
          alert('Ops... parece que algo estranho aconteceu! 😥')
          return
        })
      setEmail('')
      setPassword('')
      Keyboard.dismiss()
    } else {
      const user = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(value => {
          // alert(`Usuário cadastrado com sucesso! 🚀🔥`)
          changeStatus(value.user.uid)
        })
        .catch(err => {
          alert('Não foi possível cadastrar! 😭')
          return
        })
      setEmail('')
      setPassword('')
      Keyboard.dismiss()
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <TextInput
        value={email}
        onChangeText={text => setEmail(text)}
        placeholder="Seu e-mail"
        style={styles.input}
        underlineColorAndroid="transparent"
      />

      <TextInput
        value={password}
        onChangeText={text => setPassword(text)}
        placeholder="***********"
        style={styles.input}
        underlineColorAndroid="transparent"
        secureTextEntry={true}
      />

      <TouchableOpacity
        onPress={handleLogin}
        style={[
          styles.handleButtonLogin,
          { backgroundColor: type === 'login' ? '#3ea6f2' : '#ff5252' }
        ]}
      >
        <Text style={styles.btnText}>
          {type === 'login' ? 'ACESSAR' : 'CADASTRAR'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setType(type => (type === 'login' ? 'signUp' : 'login'))}
      >
        <Text style={{ textAlign: 'center' }}>
          {type === 'login'
            ? 'Criar uma conta'
            : 'Já possuo conta, fazer login'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

// #996DFF

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 10,
    backgroundColor: '#f2f6fc'
  },
  input: {
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 4,
    height: 45,
    padding: 10
  },
  handleButtonLogin: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    marginBottom: 10
  },
  btnText: {
    color: '#fff',
    fontSize: 17
  }
})
