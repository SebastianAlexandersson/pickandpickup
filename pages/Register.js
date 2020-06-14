import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import Button from '../components/Button';
import { DispatchContext } from '../state/store';

function Register({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  function handleSubmit() {
      fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })
      .then(res => {
        if (res.status !== 201) {
          throw Error('Oops')
        } else {
          navigation.navigate('Inloggning');
        }
      })
      .catch(() => setError('Något gick fel...'));
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', marginTop: 100 }}>
      <Text style={styles.title}>Skapa Konto</Text>
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
        label="Registrera"
        MyStyles={{ width: '80%', marginTop: 20 }}
        onPress={handleSubmit}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
  },
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

export default Register;
