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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { configurePushNotifications } from './pushNotifications';
import { localPushNotification } from './pushNotifications';
import io from 'socket.io-client';

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
    (async () => {
      console.log('Running app init')
      await AsyncStorage.getItem('@userid')
        .then(async userid => {
          console.log('USERID: ', userid)
          if (userid !== null) {
            dispatch({ type: 'setUserId', userId: JSON.parse(userid) })
            dispatch({ type: 'login', isLoggedIn: true })
          }

          if (!state.socket && userid) {
            const orderReq = await fetch(`http://localhost:3000/orders?userId=${userid}`)
            const orders = await orderReq.json();

            if (orders.length > 0) {
              const activeOrders = orders.filter(order => order.status !== 'collected')

              if (activeOrders.length > 0) {
                const socket = io('http://localhost:3000')

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
                  fetch(`http://localhost:3000/orders?userId=${userid}`)
                    .then(res => res.json())
                    .then(data => {
                      console.log('DATA!!!!: ', data)
                      console.log('USERID!!', userid)
                      return data
                    })
                    .then(data => dispatch({ type: 'setOrders', orders: data }))
                    .catch(err => console.log(err))
                })

                dispatch({ type: 'setSocket', socket })

                activeOrders.forEach(order => {
                  console.log('Creating new websocket for orderid: ', order.orderId);
                  socket.emit('userOrder', { orderId: order.orderId });
                })
              }
            }
          }
        })
        .then(() => setIsLoading(false))
        .then(() => {
          console.log('App init done');
        })
    })()

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
