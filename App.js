import 'react-native-gesture-handler';
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useReducer, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  StateContext,
  DispatchContext,
  initialState,
  reducer,
} from './state/store';
import AsyncStorage from '@react-native-community/async-storage';
import Home from './pages/Home';
import ProductInfo from './pages/ProductInfo';
import Orders from './pages/Orders';
import OrderInfo from './pages/orderInfo';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';
import LoadingScreen from './pages/LoadingScreen';
import images from './assets/images/images';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { configurePushNotifications } from './pushNotifications';

configurePushNotifications();

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const OrdersStack = createStackNavigator();
const LoginStack = createStackNavigator();

function LoginStackScreen() {
  return (
    <LoginStack.Navigator initialRouteName="Inloggning">
      <LoginStack.Screen name="Inloggning" component={Login} />
      <LoginStack.Screen name="Registrering" component={Register} />
    </LoginStack.Navigator>
  )
}

function HomeStackScreen() {
  return (
    <HomeStack.Navigator initialRouteName="Erbjudanden" headerMode="screen">
      <HomeStack.Screen name="Erbjudanden" component={Home} />
      <HomeStack.Screen name="Erbjudande" component={ProductInfo} />
    </HomeStack.Navigator>
  );
}

function OrdersStackScreen() {
  return (
    <OrdersStack.Navigator initialRouteName="Beställningar">
      <OrdersStack.Screen name="Beställningar" component={Orders} />
      <OrdersStack.Screen name="Beställningsinfo" component={OrderInfo} />
    </OrdersStack.Navigator>
  );
}

const App: () => React$Node = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:3000/offers')
      .then(res => res.json())
      .then(res =>
        dispatch({type: 'setOfferList', offerList: res}),
      )
      .catch(err => console.log(err));

    (async () => {
      const userid = await AsyncStorage.getItem('@userid')

      if (userid !== null) {
        dispatch({ type: 'setUserId', userId: JSON.parse(userid) })
        dispatch({ type: 'login', isLoggedIn: true })
      }

      setIsLoading(false);
    })()

    dispatch({type: 'setImages', images});
  }, []);
  return (
    <>
      <DispatchContext.Provider value={dispatch}>
        <StateContext.Provider value={state}>
          {isLoading ?
            (<LoadingScreen />)
            :
            (
              <NavigationContainer>
                {state.isLoggedIn ? (
                    <Tab.Navigator>
                      <Tab.Screen
                        name="Erbjudanden"
                        options={{
                          tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="format-list-bulleted" color={color} size={size} />
                          ),
                        }}
                        component={HomeStackScreen}
                      />
                      <Tab.Screen
                        name="Beställningar"
                        options={{
                          tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="format-list-bulleted" color={color} size={size} />
                          ),
                        }}
                        component={OrdersStackScreen}
                      />
                      <Tab.Screen
                        name="Inställningar"
                        options={{
                          tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="settings" color={color} size={size} />
                          ),
                        }}
                        component={Settings}
                      />
                    </Tab.Navigator>
                )
                :
                  (<LoginStackScreen />)}
              </NavigationContainer>

            )
          }
        </StateContext.Provider>
      </DispatchContext.Provider>
    </>
  );
};

export default App;
