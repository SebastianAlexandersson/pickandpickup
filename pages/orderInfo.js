import React, { useContext } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import Button from '../components/Button';
import QRCode from 'react-native-qrcode-svg';
import moment from 'moment';
import 'moment/locale/sv';
import { StateContext, DispatchContext } from '../state/store';

moment.locale('sv');

function OrderInfo({ route, navigation }) {
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const { name, offerPrice, amount, orderTime, orderId } = route.params.order;

  const cancelOrder = async () => {
    try {
      const res = await fetch(`http://localhost:3000/orders?userId=${state.userId}&orderId=${orderId}`, { method: 'DELETE' })
      const data = await res.json();
      dispatch({ type: 'setOrders', orders: data })
      navigation.navigate('Beställningar')
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.orderInfo}>
        <View style={styles.column}>
          <Text style={styles.title}>Beställning: </Text>
          <Text style={styles.title}>Antal: </Text>
          <Text style={styles.title}>Pris: </Text>
          <Text style={styles.title}>Hämtas: </Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.content}>{name}</Text>
          <Text style={styles.content}>{amount}</Text>
          <Text style={styles.content}>{`${offerPrice * amount}:-`}</Text>
          {new Date(orderTime) <= new Date(Date.now()) ?
            (<Text>Nu</Text>)
            :
            (<Text>{moment(orderTime).calendar()}</Text>)
          }
        </View>
      </View>
      <QRCode
        value={orderId.toString()}
      />
      <View style={styles.cancel}>
        <Button
          label="Avbryt order"
          MyStyles={{ width: 250 }}
          onPress={() => Alert.alert(
            'Bekräfta',
            'Är du säker?',
            [
              { text: 'Ja', onPress: () => cancelOrder()},
              { text: 'Nej'}
            ]
          )}
        />
      </View>
    </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50
  },
  cancel: {
    marginTop: 50
  },
  orderInfo: {
    flexDirection: 'row',
    marginBottom: 50
  },
  column: {
    paddingRight: 10
  },
  title: {
    fontWeight: 'bold'
  }
})

export default OrderInfo;
