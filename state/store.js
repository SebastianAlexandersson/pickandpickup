import React, {createContext} from 'react';

export const StateContext = createContext();

export const DispatchContext = createContext();

export const initialState = {
  images: {},
  productList: [],
};

export function reducer(state, action) {
  switch (action.type) {
    case 'setImages':
      return {
        ...state,
        images: action.images,
      };
    case 'setProductList':
      return {
        ...state,
        productList: action.productList,
      };
    default:
      return state;
  }
}
