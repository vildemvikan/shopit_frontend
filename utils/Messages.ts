import axios from 'axios'

const baseUrl: string = 'http://localhost:8080';


export async function fetchChatList(senderId: string, itemId: number): Promise<any> {
  const url = `${baseUrl}/chats/${itemId}/${senderId}`;
  try {
    const response = await axios.get(url)
    return response.data
  } catch (error) {
    console.error(error)
    return new Error("Could not retrieve chat list")
  }
}

export async function fetchChatMessages(senderId: string, recipientId: string, itemId: number): Promise<ChatMessage[] | []> {
  const url = `${baseUrl}/messages/${itemId}/${senderId}/${recipientId}`;

  try {
    const response = await axios.get(url)
    return await response.data
  } catch (error) {
    console.error("Error", error)
    return [];
  }
}
