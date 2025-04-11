import axios from 'axios'
import type {ChatMessage} from '@/interfaces/interfaces.ts'
import { useTokenStore } from '@/stores/tokenStore.ts'

const baseUrl: string = 'http://localhost:8080';

export async function fetchChatMessages(recipientId: string, itemId: number): Promise<ChatMessage[] | []> {
  const url = `${baseUrl}/messages/${itemId}/${recipientId}`;
  const tokenStore = useTokenStore();
  const token = tokenStore.getToken;
  try {
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return await response.data.content
  } catch (error) {
    console.error("Error fetching chat messages: ", error)
    return [];
  }

}
  export async function fetchProfileInfo(recipientMail: string) {
    const url = `${baseUrl}/chat/recipient/${recipientMail}`;
    const tokenStore = useTokenStore();
    const token = tokenStore.getToken;
    try {
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return await response.data
    } catch(error) {
      console.error("Error fetching chat recipient profile: ", error)
      return null;
    }
}

export async function fetchChatList(size: number, page:number) {
  const url = `${baseUrl}/chats`;
  const tokenStore = useTokenStore();
  const token = tokenStore.getToken;
  try {
    const response = await axios.get(url, {
      params:{
        size:size,
        page:page
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return await response.data;
  } catch(error) {
    console.error("Error fetching chat list: ", error)
    return null;
  }
}

export async function contactSeller(id:string, message:string){
  const url = baseUrl + '/chat/' + id
  const tokenStore = useTokenStore();
  const token = tokenStore.getToken;
  try {
    const response = await axios.post(url, {message: message},{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.status;
  } catch(error) {
    throw error
  }
}
