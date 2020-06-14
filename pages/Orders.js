import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SectionList,
  ActivityIndicator,
} from 'react-native';
import { StateContext, DispatchContext } from '../state/store';
import moment from 'moment';
import 'moment/locale/sv';

moment.locale('sv');

function Orders({ navigation }) {
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        fetch(`http://localhost:3000/orders?userId=${state.userId}`)
          .then(res => res.json())
          .then(res => dispatch({ type: 'setOrders', orders: res }))
          .then(() => setIsLoading(false))
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  const activeOrders = state.orders.filter(order => order.status !== 'collected');
  const orderHistory = state.orders.filter(order => order.status === 'collected');

  const formatStatus = (status) => status === 'awaiting response' ? 'Väntar på svar' : status === 'in progress' ? 'Behandlas' : status === 'completed' ? 'Redo att hämtas' : null

  return (
    <View style={styles.container}>
      <SectionList
        sections={[
          {
            title: 'Aktiva beställningar',
            data: activeOrders
          },
          {
            title: 'Beställningshistorik',
            data: orderHistory
          }
        ]}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item, section }) => {
          if (section.title === 'Aktiva beställningar') {
            return (
              <TouchableOpacity
                style={styles.listItem}
                onPress={() =>
                  navigation.navigate('Beställningsinfo', {
                    order: item
                  })
                }
              >
                <View style={styles.row}>
                  <Text style={styles.rowTitle}>Beställning:</Text>
                  <Text>{item.amount} {item.name}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.rowTitle}>Status:</Text>
                  <Text>{formatStatus(item.status)}</Text>
                </View>
                {item.status === 'completed' && (
                  <View style={styles.row}>
                    <Text style={styles.rowTitle}>Hämtas:</Text>
                    {new Date(item.orderTime) <= new Date(Date.now()) ?
                      (<Text>Nu</Text>)
                      :
                      (<Text>{moment(item.orderTime).calendar()}</Text>)
                    }
                  </View>
                )}
              </TouchableOpacity>
            )
          } else {
            return (
              <View style={styles.listItem}>
                <View style={styles.row}>
                  <Text style={styles.rowTitle}>Beställning:</Text>
                  <Text>{item.amount} {item.name}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.rowTitle}>Datum:</Text>
                  <Text>{moment(item.orderTime).format('YYYY-MM-DD')}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.rowTitle}>Pris:</Text>
                  <Text>{item.price}</Text>
                </View>
              </View>
            )
          }
        }}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.title}>{title}</Text>
        )}
        renderSectionFooter={({ section }) => {
          if (isLoading) {
            return (
              <View style={styles.loader}>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            )
          }

          if (!isLoading && section.title === 'Aktiva beställningar' && activeOrders.length === 0) {
            return (
              <Text style={styles.empty}>Inga aktiva beställningar.</Text>
            )
          } else if (!isLoading && section.title === 'Beställningshistorik' && orderHistory.length === 0) {
            return (
              <Text style={styles.empty}>Ingen beställningshistorik.</Text>
            )
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    marginVertical: 10
  },
  listItem: {
    backgroundColor: '#ffffff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    elevation: 3,
    marginHorizontal: 10
  },
  row: {
    flexDirection: 'row'
  },
  rowTitle: {
    width: '30%',
    fontWeight: 'bold'
  },
  loader: {
    marginTop: 20
  },
  empty: {
    paddingLeft: 10
  },
});

export default Orders;
