import React, { useContext, useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { StateContext, DispatchContext } from '../state/store';
import {
  FlatList,
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';

function ProductList({navigation}) {
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const isFocused = useIsFocused();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/offers')
      .then(res => res.json())
      .then(res =>
        dispatch({type: 'setOfferList', offerList: res}),
      )
      .then(() => setIsLoading(false))
      .catch(err => console.log(err));
  }, [])

  useEffect(() => {
    if (isFocused) {
      fetch('http://localhost:3000/offers')
        .then(res => res.json())
        .then(res =>
          dispatch({type: 'setOfferList', offerList: res}),
        )
        .catch(err => console.log(err));
    }
  }, [isFocused])

  const Loader = ({ loading }) => {
    if (loading) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )
    } else {
      return null
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Loader loading={isLoading} />
      <FlatList
        data={state.offerList}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Erbjudande', {
                offer: item.name,
                description: item.description,
                price: item.offerPrice,
                image: item.offerPicture,
                offerId: item.offerId,
              })
            }>
            <View style={styles.item}>
              <Image
                source={{ uri: `http://localhost:3000/${item.offerPicture}`}}
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
  loader: {
    marginTop: 100
  }
});

export default ProductList;
