import io from 'socket.io-client';
import { localPushNotification } from './pushNotifications';

export function createSocket(state, dispatch) {
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
    fetch(`http://localhost:3000/orders?userId=${state.userId}`)
      .then(res => res.json())
      .then(data => {
        console.log('DATA!!!!: ', data)
        console.log('STATE!!!!: ', state)
        return data
      })
      .then(data => dispatch({ type: 'setOrders', orders: data }))
      .catch(err => console.log(err))
  })

  return socket
}
