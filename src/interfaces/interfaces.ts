import type { PaymentMethod } from '@/enums/enums.ts'
import { Status } from '@/enums/enums.ts'

export interface ChatMessage {
  senderId: string,
  recipientId: string,
  itemId: number,
  content: string,
  timestamp: Date
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

export interface UserInfo {
  senderMail: string,
  recipientMail: string,
  itemId: number
}

export interface DisplayAdvertisement{
  id: number
  name: string,
  price: number,
  status: Status,
  images: Image[]
  publishedAt: string,
}

export interface ChatCard {
  lastMessageContent: string,
  lastMessageTimestamp: string,
  lastSenderId: string,
  senderId: string,
  recipientId: string,
  itemId: number,
  status: Status
  itemImage: Image
  itemTitle: string,
  recipientProfilePic: string,
}
