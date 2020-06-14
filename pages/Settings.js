import React, { useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Button from '../components/Button';
import { DispatchContext } from '../state/store';
import AsyncStorage from '@react-native-community/async-storage';

function Settings() {
  const dispatch = useContext(DispatchContext);

  function logout() {
    AsyncStorage.removeItem('@userid')
      .then(() => dispatch({ type: 'login', isLoggedIn: false }))
      .catch(err => console.log(err));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inställningar</Text>
      <Button label="Logga ut" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
})

export default Settings;
