import type { PaymentMethod } from '@/views/CreateAdvertisementView.vue'

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
