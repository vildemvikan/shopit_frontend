import { ref, reactive } from 'vue';
import { Client } from '@stomp/stompjs';
import  useEventBus  from './EventBus'
import { string } from 'yup'

// Reactive state that can be imported by multiple components
const state = reactive({
  connected: false,
});

let stompClient: Client | null = null;

const websocketService = {
  connect(userId: string) {
    if (stompClient) {
      console.log('Already connected to WebSocket');
      return;
    }

    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      connectHeaders: {
        login: 'guest',
        passcode: 'guest',
      },
      debug: (str) => {
        console.log('STOMP:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        state.connected = true;
        console.log('Connected to WebSocket as user:', userId);

        // Subscribe to personal queue
        client.subscribe(`/user/${userId}/queue/messages`, (message) => {
          try {

            // on message received method
            // emit to messageview.
            // message view use child props and feed them data
            // in chat: update list (and refresh api call?)
            // in chat list: check if message and current user is the same - style thereafter
            const { emit } = useEventBus()
            emit('messageReceived', message);
          } catch (error) {
            console.error('Error parsing received message:', error);
          }
        });
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
      },
      onWebSocketError: (event) => {
        console.error('WebSocket error:', event);
      }
    });

    client.activate();
    stompClient = client;
  },

  disconnect() {
    if (stompClient) {
      stompClient.deactivate();
      stompClient = null;
      state.connected = false;
      console.log('Disconnected from WebSocket');
    }
  },

  sendMessage(senderMail: string, recipientMail: string, itemId: number, content: string, timestamp: Date) {
    if (!stompClient || !state.connected || !content.trim()) {
      console.warn('Cannot send message: not connected or empty message');
      return false;
    }

    try {
      const message = {
        senderId: senderMail,
        recipientId: recipientMail,
        itemId,
        content,
        timestamp
      };

      console.log("Message", message)
      stompClient.publish({
        destination: '/app/chat',
        body: JSON.stringify(message)
      });

      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  },

  isConnected() {
    return state.connected;
  },
};

export default websocketService;
