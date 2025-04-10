import type { PaymentMethod } from '@/enums/enums.ts'
import { Condition, MessageType, Status } from '@/enums/enums.ts'

export interface ChatMessage {
  senderId: string,
  recipientId: string,
  itemId: number,
  content: string,
  timestamp: Date,
  type: MessageType,
}

export interface Image{
  url: string,
  caption: string
}

export interface CategoryImage{
  url: string
  publicId: string
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

export interface Location{
  postalCode: number,
  city: string
  county: string,
  latitude: number,
  longitude: number,
}

export interface SubCategory{
  id: number
  name: string
}
export interface Category{
  id: number
  name: string
  image: CategoryImage
  subcategories: SubCategory[] |null
}

export interface DisplayAdvertisement{
  id: number,
  name: string,
  price: number,
  location: Location,
  status: Status,
  images: Image[],
  publishedAt: string,
  isBookmarked: boolean
}

export interface Advertisement{
  id: number,
  name: string,
  description: string
  condition: Condition
  price: number,
  location: Location,
  publishedAt: string
  status: Status,
  images: Image[],
  tags: string[],
  isOwner: boolean,
  isBookmarked: boolean,
  sellerFullName: string,
  categoryName: string,
  categoryId: number
  subCategoryName: string
  subCategoryId: number
  listingType: PaymentMethod
  forSale: boolean
}

export interface MenuFilter{
  categoryId: number | null,
  subCategoryId: number | null,
  minPrice: number | null,
  maxPrice: number | null,
  conditions: Condition[] | null,
  counties: string[] | null,
  forSale: boolean | null,
  forFree: boolean| null
  published: boolean | null
}

export interface Search{
  categoryFacet: any
  conditionFacet: any
  countyFacet: any
  forSaleFacet: any
  subCategoryFacet: any
  publishedTodayFacet: any
  items: SearchItems
}

export interface SearchItems{
  content: Advertisement[]
  totalElements:number
  totalPages: number
  pageable: Pageable
}

export interface Pageable{
  pageNumber: number,
  pageSize: number,
}

export interface ChatCardInfo {
  lastMessageContent: string,
  lastMessageTimestamp: string,
  lastSenderId: string,
  senderId: string,
  recipientId: string,
  itemId: number,
  status: Status
  image: string,
  itemTitle: string,
  recipientProfilePic: string,
}

export interface ChatRoomInfo {
  senderMail: string
  recipientMail: string
  itemId: number
}
