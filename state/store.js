import React, {createContext} from 'react';

export const StateContext = createContext();

export const DispatchContext = createContext();

export const initialState = {
  images: {},
  offerList: [],
  activeOrders: [],
  orderHistory: [],
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
    case 'setActiveOrders':
      return {
        ...state,
        activeOrders: action.activeOrders,
      };
    case 'setOrderHistory':
      return {
        ...state,
        orderHistory: action.orderHistory,
      };
    default:
      return state;
  }
}
