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
        data={state.productList}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ProductInfo', {
                offer: item.offer,
                description: item.description,
                price: item.price,
                image: item.image,
              })
            }>
            <View style={styles.item}>
              {console.log(state.images)}
              <Image source={state.images[item.image]} style={styles.image} />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.offer}</Text>
                <Text style={styles.text}>{item.description}</Text>
                <Text style={styles.price}>{item.price + ':-'}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id.toString()}
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
