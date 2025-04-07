import type { PaymentMethod } from '@/enums/enums.ts'
import { Status } from '@/enums/enums.ts'

export interface ChatMessage {
  senderId: string,
  recipientId: string,
  itemId: number,
  content: string,
  timestamp: Date,
}

export interface Image{
  url: string,
  description: string
}

export interface PostalCodeInfo{
  result: string,
  valid: boolean,
  postalCodeType: string
}

export interface Option {
  text: string;
  value: PaymentMethod;
}

export interface DisplayAdvertisement{
  id: number
  name: string,
  price: number,
  status: Status,
  images: Image[]
  publishedAt: string,
}

export interface ChatCardInfo {
  lastMessageContent: string,
  lastMessageTimestamp: string,
  lastSenderId: string,
  senderId: string,
  recipientId: string,
  itemId: number,
  status: Status
  itemImage: string,
  itemTitle: string,
  recipientProfilePic: string,
}

export interface ChatRoomInfo {
  senderMail: string
  recipientMail: string
  itemId: number
}
