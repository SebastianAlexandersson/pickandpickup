import React, {createContext} from 'react';

export const StateContext = createContext();

export const DispatchContext = createContext();

export const initialState = {
  images: {},
  offerList: [],
  orders: [],
  isLoggedIn: false,
  userId: null,
};

export function reducer(state, action) {
  switch (action.type) {
    case 'setImages':
      return {
        ...state,
        images: action.images,
      };
    case 'setOfferList':
      return {
        ...state,
        offerList: action.offerList,
      };
    case 'setOrders':
      return {
        ...state,
        orders: action.orders,
      };
    case 'login':
      return {
        ...state,
        isLoggedIn: action.isLoggedIn,
      };
    case 'setUserId':
      return {
        ...state,
        userId: action.userId,
      };
    default:
      return state;
  }
}
