import React, { useState, useContext } from 'react';
import { ScrollView, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Button from '../components/Button';
import { DispatchContext } from '../state/store';
import AsyncStorage from '@react-native-community/async-storage';

function Login({ navigation }) {
  const dispatch = useContext(DispatchContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  function handleSubmit() {
      fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })
      .then(res => {
        console.log(res.status)
        if (res.status !== 201) {
          if (res.status === 401) {
            setError('Felaktigt användarnamn eller lösenord.')
          } else {
            throw Error('Oops')
          }
        } else {
          return res.json();
        }
      })
      .then(async res => {
        await AsyncStorage.setItem('@userid', JSON.stringify(res.userid))
        dispatch({ type: 'login', isLoggedIn: true })
      })
      .catch(() => setError('Något gick fel...'));
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', marginTop: 100 }}>
      <Text style={styles.title}>Pick and Pickup</Text>
      {error && (<Text styles={styles.error}>{error}</Text>)}
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={(text) => setUsername(text)}
        placeholder="Användarnamn"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={(text) => setPassword(text)}
        placeholder="Lösenord"
        secureTextEntry={true}
      />
      <Button
        label="Logga in"
        MyStyles={{ width: '80%', marginTop: 20 }}
        onPress={handleSubmit}
      />
      <TouchableOpacity style={styles.register} onPress={() => navigation.navigate('Registrering')}>
        <Text style={styles.registerText}>Inget konto? Registrera här!</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 32,
    marginBottom: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    borderStyle: 'solid',
    marginVertical: 5,
    fontWeight: 'bold',
    elevation: 3,
    backgroundColor: '#f7f7f7',
    textAlign: 'center',
    width: '80%'
  },
  register: {
    marginTop: 50,
  },
  registerText: {
    fontWeight: 'bold',
  },
});

export default Login;
