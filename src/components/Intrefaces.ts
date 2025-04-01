interface Image{
  url: string,
  caption: string
  publicId: number|null
}

interface Category {
  id: number,
  name: string,
  subcategories: any[]
}

