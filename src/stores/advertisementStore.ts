
import { defineStore } from 'pinia'

enum PaymentMethod {
  Direct = 'DIRECT',
  Auction = 'BID',
  None = 'CONTACT'
}

export enum Condition {
  New = 'NEW',
  LikeNew = 'LIKE_NEW',
  Good = 'GOOD',
  Acceptable = 'ACCEPTABLE',
  ForParts = 'FOR_PARTS'
}

interface Image {
  url: string,
  caption: string
  publicId: number|null
}

export const useAdvertisementStore = defineStore('advertisement', {
  state: () => ({
    title: '' as string,
    description: '' as string,
    condition: '' as Condition | string,
    category: '' as number|string,
    subCategory: '' as number|string,
    tags: [] as string[],
    images: [] as Image[],
    forSale: true as boolean,
    payment: PaymentMethod.None as PaymentMethod,
    price: 0 as number,
    postalNumber: '' as string,
  }),

  actions: {
    updateTitle(newTitle: string) {
      this.title = newTitle
    },
    updateDescription(newDescription: string) {
      this.description = newDescription
    },
    updateCondition(newCondition: Condition) {
      this.condition = newCondition
    },
    updateCategory(newCategory: number|string) {
      this.category = newCategory
    },
    updateSubCategory(newSubCategory: number|string) {
      this.subCategory = newSubCategory
    },
    updateTags(newTags: string[]) {
      this.tags = newTags
    },
    updateImages(newImages: Image[]) {
      this.images = newImages
    },
    updateForSale(newStatus: boolean) {
      this.forSale = newStatus
    },
    updatePrice(newPrice: number) {
      this.price = newPrice
    },
    updatePayment(newPaymentMethod: PaymentMethod) {
      this.payment = newPaymentMethod
    },
    updatePostalNumber(newPostalNumber: string) {
      this.postalNumber = newPostalNumber
    },

    resetStore() {
      this.$reset()
    }
  },

  persist: true

})
