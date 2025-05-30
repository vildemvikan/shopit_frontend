import { reactive } from 'vue';
import { Client } from '@stomp/stompjs';
import  useEventBus  from './EventBus'
import useEventsBus from './EventBus'
import { useTokenStore } from '@/stores/tokenStore.ts'
import { fetchUsername } from './Authentication.ts'

// Reactive state that can be imported by multiple components
const state = reactive({
  connected: false,
});

let stompClient: Client | null = null;

const websocketService = {
  connect(userId: string) {
    if (stompClient) {
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
      onConnect: async () => {

        // Subscribe to personal queue
        const username = await fetchUsername();
        if (!username) return;

        state.connected = true;
        client.subscribe(`/user/${username}/queue/messages`, (message) => {
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
    }
  },

  sendMessage(senderMail: string, recipientMail: string, itemId: number, content: string) {
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
      };

      stompClient.publish({
        destination: '/app/chat',
        body: JSON.stringify(message),
      });

      const { emit } = useEventsBus();
      emit('messageSent')
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
