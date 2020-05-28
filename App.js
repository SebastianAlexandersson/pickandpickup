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
import {
  StateContext,
  DispatchContext,
  initialState,
  reducer,
} from './state/store';
import Home from './pages/Home';
import ProductInfo from './pages/ProductInfo';
import data from './data.json';
import images from './assets/images/images';

const Stack = createStackNavigator();

const App: () => React$Node = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({type: 'setProductList', productList: data});
    dispatch({type: 'setImages', images});
  }, []);
  return (
    <>
      <DispatchContext.Provider value={dispatch}>
        <StateContext.Provider value={state}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Home" headerMode="screen">
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="ProductInfo" component={ProductInfo} />
            </Stack.Navigator>
          </NavigationContainer>
        </StateContext.Provider>
      </DispatchContext.Provider>
    </>
  );
};

export default App;
