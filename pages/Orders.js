import React, { useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Button,
} from 'react-native';
import { StateContext, DispatchContext } from '../state/store';
import AsyncStorage from '@react-native-community/async-storage';

function Orders() {
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.getItem('@activeOrders')
          .then(res => {
            if (res === null) {
              throw new Error('no active orders');
            } else {
              return res;
            }
          })
          .then(res => JSON.parse(res))
          .then(res =>
            dispatch({ type: 'setActiveOrders', activeOrders: res })
          );
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  const clearOrders = () => {
    (async () => {
      await AsyncStorage.clear().catch(err => console.log(err));
      dispatch({ type: 'setActiveOrders', activeOrders: [] });
    })();
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Aktiva Beställningar</Text>
        <View style={styles.container}>
          {state.activeOrders.length === 0 ? (
            <Text>Inga aktiva beställningar.</Text>
          ) : (
            <FlatList
              data={state.activeOrders}
              renderItem={({ item }) => (
                <TouchableOpacity>
                  <View>
                    <Text>{item.offer}</Text>
                    <Text>{item.amount}</Text>
                    <Text>{item.status}</Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.offerId.toString()}
            />
          )}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Historik</Text>
        <View style={styles.container}>
          {state.orderHistory.length === 0 ? (
            <Text>Ingen beställningshistorik.</Text>
          ) : (
            <FlatList
              data={state.orderHistory}
              renderItem={({ item }) => (
                <TouchableOpacity>
                  <View>
                    <Text>{item.offer}</Text>
                    <Text>{item.qty}</Text>
                    <Text>{item.status}</Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.id.toString()}
            />
          )}
        </View>
      </View>
      <Button onPress={clearOrders} title="Clear orders" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  section: {
    marginVertical: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
  },
});

export default Orders;
