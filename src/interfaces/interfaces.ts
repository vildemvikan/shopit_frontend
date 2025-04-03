import type { PaymentMethod } from '@/enums/enums.ts'

export interface ChatMessage {
  senderId: string,
  recipientId: string,
  itemId: number,
  content: string,
  timestamp: Date
}

export interface Image{
  src: string,
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
