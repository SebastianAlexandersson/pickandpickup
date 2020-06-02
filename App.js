import 'react-native-gesture-handler';
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useReducer} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  StateContext,
  DispatchContext,
  initialState,
  reducer,
} from './state/store';
import Home from './pages/Home';
import ProductInfo from './pages/ProductInfo';
import Orders from './pages/Orders';
import data from './data.json';
import images from './assets/images/images';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const OrdersStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator initialRouteName="Home" headerMode="screen">
      <HomeStack.Screen name="Home" component={Home} />
      <HomeStack.Screen name="ProductInfo" component={ProductInfo} />
    </HomeStack.Navigator>
  );
}

function OrdersStackScreen() {
  return (
    <OrdersStack.Navigator initialRouteName="Orders">
      <OrdersStack.Screen name="Orders" component={Orders} />
    </OrdersStack.Navigator>
  );
}

const App: () => React$Node = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetch('http://localhost:3000/offers')
      .then(res => res.json())
      .then(res =>
        dispatch({type: 'setOfferList', offerList: [...data, ...res]}),
      )
      .catch(err => console.log(err));

    dispatch({type: 'setImages', images});
  }, [state.offerList]);
  return (
    <>
      <DispatchContext.Provider value={dispatch}>
        <StateContext.Provider value={state}>
          <NavigationContainer>
            <Tab.Navigator>
              <Tab.Screen name="Home" component={HomeStackScreen} />
              <Tab.Screen name="Orders" component={OrdersStackScreen} />
            </Tab.Navigator>
          </NavigationContainer>
        </StateContext.Provider>
      </DispatchContext.Provider>
    </>
  );
};

export default App;
