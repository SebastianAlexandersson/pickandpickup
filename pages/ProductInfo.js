import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import images from '../assets/images/images';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import 'moment/locale/sv';

moment.locale('sv');

function ProductInfo({route, navigation}) {
  const {offer, description, price, image} = route.params;

  const str = ' + en lite längre produktbeskrivning etc...';

  const [date, setDate] = useState(new Date(Date.now()));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');

    if (currentDate < new Date(Date.now())) {
      Alert.alert('Fel', 'Välj en giltlig tid');
      return;
    }

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

  return (
    <View style={styles.container}>
      <Image source={images[image]} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{offer}</Text>
        <Text style={styles.description}>{description + str}</Text>
        <Text style={styles.price}>{`Pris: ${price}:-`}</Text>
        <View>
          <View style={styles.datePickerContainer}>
            <Button onPress={showDatepicker} title="Välj Datum" />
            <Button onPress={showTimepicker} title="Välj Tid" />
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
        <Text>{'Hämtas ' + moment(date).calendar()}</Text>
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityText}>{'Antal: ' + quantity}</Text>
          <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
            <View style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>{'+'}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => (quantity === 1 ? null : setQuantity(quantity - 1))}>
            <View style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>{'-'}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Button title="Beställ nu" />
      </View>
    </View>
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
    fontSize: 18,
    marginRight: 10,
  },
  quantityButton: {
    backgroundColor: '#2196F3',
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    marginHorizontal: 3,
  },
  quantityButtonText: {
    color: '#ffffff',
    fontSize: 18,
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '55%',
  },
});

export default ProductInfo;
