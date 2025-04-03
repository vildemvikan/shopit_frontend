import type { PaymentMethod } from '@/enums/enums.ts'
import { Status } from '@/enums/enums.ts'

export interface ChatMessage {
  id: number,
  senderId: string,
  recipientId: string,
  itemId: number,
  chatId: string,
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
