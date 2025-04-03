import axios from 'axios'
import type { ChatMessage } from '@/interfaces/interfaces.ts'

const baseUrl: string = 'http://localhost:8080';

export async function fetchChatMessages(senderId: string, recipientId: string, itemId: number): Promise<ChatMessage[] | []> {
  const url = `${baseUrl}/messages/${itemId}/${senderId}/${recipientId}`;
  console.log(url)

  try {
    const response = await axios.get(url)
    return await response.data
  } catch (error) {
    console.error("Error fetching chat messages: ", error)
    return [];
  }

}
  export async function fetchProfileInfo(recipientMail: string) {
    const url = `${baseUrl}/chat/recipient/${recipientMail}`;

    try {
      const response = await axios.get(url);
      return await response.data;
    } catch(error) {
      console.error("Error fetching chat recipient profile: ", error)
      return null;
    }
}

export async function fetchChatList(userMail: string) {
  const url = `${baseUrl}/chats/${userMail}`;

  try {
    const response = await axios.get(url);
    return await response.data;
  } catch(error) {
    console.error("Error fetching chat list: ", error)
    return null;
  }
}
