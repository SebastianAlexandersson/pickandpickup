import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  TextInput,
  ScrollView,
  Alert
} from 'react-native';
import images from '../assets/images/images';
import DateTimePicker from '@react-native-community/datetimepicker';
import MyButton from '../components/Button';
import moment from 'moment';
import 'moment/locale/sv';
import AsyncStorage from '@react-native-community/async-storage';
import {DispatchContext} from '../state/store';

moment.locale('sv');

function ProductInfo({route, navigation}) {
  const {offer, description, price, image, offerId} = route.params;

  const dispatch = useContext(DispatchContext);

  const str = ' + en lite längre produktbeskrivning etc...';

  const [date, setDate] = useState(new Date(Date.now()));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [name, setName] = useState('Ditt namn');

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
    const order = {
      orderdBy: name,
      offerId,
      amount: quantity,
      status: 'awaiting response',
      qrCode: '123',
      offer,
      pickupTime: date,
    };

    try {
      const res = await fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      if (res.status === 200) {
        Alert.alert('Tack!', 'Tack för din beställning. Du kan följa orderstatus på sidan Orders. Du blir även notifierad när orderstatus ändras')

        const data = await AsyncStorage.getItem('@activeOrders');

        if (data) {
          const previousData = await JSON.parse(data);
          const combinedData = [...previousData, order];
          const stringifiedCombinedData = JSON.stringify(combinedData);
          await AsyncStorage.setItem('@activeOrders', stringifiedCombinedData);
          const allData = await AsyncStorage.getItem('@activeOrders');
          dispatch({
            type: 'setActiveOrders',
            activeOrders: JSON.parse(allData),
          });
        } else {
          await AsyncStorage.setItem('@activeOrders', JSON.stringify([order]));
          const allData = await AsyncStorage.getItem('@activeOrders');
          dispatch({
            type: 'setActiveOrders',
            activeOrders: JSON.parse(allData),
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={images[image]} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{offer}</Text>
        <Text style={styles.description}>{description + str}</Text>
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
        <TextInput
          style={styles.nameInput}
          onChangeText={text => setName(text)}
          value={name}
        />
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
  nameInput: {
    borderWidth: 1,
    borderColor: 'black',
    borderStyle: 'solid',
    marginVertical: 10,
    fontWeight: 'bold',
    elevation: 3,
    backgroundColor: '#f7f7f7',
    textAlign: 'center',
  },
});

export default ProductInfo;
