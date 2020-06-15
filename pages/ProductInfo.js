import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MyButton from '../components/Button';
import moment from 'moment';
import 'moment/locale/sv';
import AsyncStorage from '@react-native-community/async-storage';
import {DispatchContext, StateContext} from '../state/store';
import { localPushNotification } from '../pushNotifications';
import io from 'socket.io-client';

moment.locale('sv');

function ProductInfo({route, navigation}) {
  const {offer, description, price, image, offerId} = route.params;

  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const [date, setDate] = useState(new Date(Date.now()));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');

    setDate(currentDate);
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const [quantity, setQuantity] = useState(1);

  const submitOrder = async () => {
    const useridstr = await AsyncStorage.getItem('@userid');
    const userid = JSON.parse(useridstr)

    const order = {
      userId: userid,
      offerId,
      amount: quantity,
      qrCode: '123',
      offer,
      orderTime: date,
    };

    try {
      const res = await fetch(`http://localhost:3000/orders?userId=${state.userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      if (res.status === 201) {
        Alert.alert(
          'Tack!',
          'Tack för din beställning. Du kan följa orderstatus på sidan Orders. Du blir även notifierad när orderstatus ändras',
          [
            { text: 'Ok', onPress: () => navigation.navigate('Beställningar')}
          ]
        );

        const orderdata = await res.json();

        if (!state.socket) {
          const socket = io('http://localhost:3000')
          console.log('USING NEW SOCKET')

          socket.on('connect', () => {
            console.log('Websocket connected: ', socket.id)
          })

          socket.on('msg', data => {
            console.log('STATUS UPDATE, NEW STATUS: ', data)

            if (data.status === 'awaiting response') {
              return
            }

            if (data.status !== 'collected') {
              if (data.status === 'in progress') {
                localPushNotification('Din beställning behandlas just nu. Du blir notifierad när den är redo att hämtas.');
              } else {
                localPushNotification('Din beställning är redo att hämtas.')
              }

            } else {
              localPushNotification('Tack och välkommen åter!')
            }
            fetch(`http://localhost:3000/orders?userId=${state.userId}`)
              .then(res => res.json())
              .then(data => {
                console.log('DATA!!!!: ', data)
                console.log('USERID!!!: ', state.userId)
                return data
              })
              .then(data => dispatch({ type: 'setOrders', orders: data }))
              .catch(err => console.log(err))
          })
            
            dispatch({ type: 'setSocket', socket })

            socket.emit('userOrder', {
              orderId: orderdata.orderId
            })

        } else {
          console.log('USING SOCKET FROM STATE')
          state.socket.emit('userOrder', { orderId: orderdata.orderId })
        }

        const getOrders = await fetch(`http://localhost:3000/orders?userId=${state.userId}`);
        const data = await getOrders.json();
        dispatch({ type: 'setOrders', orders: data })
        
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: `http://localhost:3000/${image}`}} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{offer}</Text>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.price}>{`Pris: ${price}:-`}</Text>
        <View>
          <View style={styles.datePickerContainer}>
            <MyButton onPress={showDatepicker} label="Välj Datum" />
            <MyButton onPress={showTimepicker} label="Välj Tid" />
          </View>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              timeZoneOffsetInMinutes={0}
              value={date}
              mode={mode}
              is24Hour={true}
              onChange={onChange}
              minimumDate={new Date(Date.now())}
              display="spinner"
            />
          )}
        </View>
        <Text style={styles.quantityText}>
          {date < new Date(Date.now() + 300000)
            ? 'Hämtas nu'
            : 'Hämtas ' + moment(date).calendar()}
        </Text>
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityText}>{'Antal: ' + quantity}</Text>
          <MyButton
            label="+"
            MyStyles={{
              paddingVertical: 2,
            }}
            onPress={() => setQuantity(quantity + 1)}
          />
          <MyButton
            label="-"
            MyStyles={{
              paddingVertical: 2,
              marginHorizontal: 5,
            }}
            onPress={() => (quantity === 1 ? null : setQuantity(quantity - 1))}
          />
        </View>
        <MyButton label="Beställ Nu" onPress={submitOrder} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  image: {
    width: '100%',
    height: 200,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 32,
  },
  content: {
    padding: 20,
  },
  description: {
    marginVertical: 10,
  },
  price: {
    fontSize: 20,
    marginVertical: 20,
  },
  quantityContainer: {
    marginVertical: 30,
    flexDirection: 'row',
  },
  quantityText: {
    fontSize: 16,
    marginRight: 10,
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    marginBottom: 10,
  },
});

export default ProductInfo;
