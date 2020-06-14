import React, {useContext} from 'react';
import {StateContext} from '../state/store';
import {
  FlatList,
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';

function ProductList({navigation}) {
  const state = useContext(StateContext);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={state.offerList}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Erbjudande', {
                offer: item.name,
                description: item.description,
                price: item.offerPrice,
                image: item.image || 'placeholder',
                offerId: item.offerId,
              })
            }>
            <View style={styles.item}>
              <Image
                source={state.images[item.image] || state.images.placeholder}
                style={styles.image}
              />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.text}>{item.description}</Text>
                <Text style={styles.price}>{item.offerPrice + ':-'}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.offerId.toString()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    borderRadius: 10,
    width: 100,
    height: 100,
  },
  item: {
    marginVertical: 8,
    marginHorizontal: 5,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
  title: {
    fontWeight: 'bold',
  },
  text: {
    marginVertical: 10,
  },
  price: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  textContainer: {
    flexDirection: 'column',
    padding: 10,
  },
});

export default ProductList;
