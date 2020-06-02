import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

function Button({onPress, label, MyStyles = {}}) {
  const combinedStyles = StyleSheet.flatten([styles.container, MyStyles]);

  return (
    <TouchableOpacity onPress={onPress} style={combinedStyles}>
      <View>
        <Text style={styles.label}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f7f7f7',
    borderColor: '#000000',
    borderStyle: 'solid',
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
    elevation: 3,
  },
  label: {
    fontWeight: 'bold',
  },
});

export default Button;
