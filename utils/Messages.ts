const baseUrl = "http://localhost:8080";

export async function fetchChatList(senderId: string, itemId: number): Promise<any> {
  const url = `${this.baseUrl}/chats/${itemId}/${senderId}`;
  try {
    const response = await fetch(url)
    if (!response.ok) {
      console.log(response)
      return null
    }
    return await response.json()
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function fetchChatLog(senderId: string, recipientId, itemId: number): Promise<any> {
  const url = `${this.baseUrl}/messages/${itemId}/${senderId}/${recipientId}`;

  try {
    const response = await fetch(url)
    if (!response.ok) {
      console.log(response)
      return null
    }
    return await response.json()
  } catch (error) {
    console.error(error)
    return null
  }
}
