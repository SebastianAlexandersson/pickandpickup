import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

function LoadingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Laddar...</Text>
      <View style={styles.spinner}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 200
  },
  title: {
    fontWeight: 'bold',
    fontSize: 32
  },
  spinner: {
    marginTop: 50
  }
})

export default LoadingScreen;
