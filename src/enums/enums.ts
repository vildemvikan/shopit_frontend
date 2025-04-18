export enum Condition {
  New = 'NEW',
  LikeNew = 'LIKE_NEW',
  Good = 'GOOD',
  Acceptable = 'ACCEPTABLE',
  ForParts = 'FOR_PARTS',
}

export enum PaymentMethod {
  Direct = 'DIRECT',
  Auction = 'BID',
  None = 'CONTACT',
}
export enum Status {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Sold = 'SOLD',
}

export enum County {
  Agder = 'Agder',
  Akershus = 'Akershus',
  Buskerud = 'Buskerud',
  Finnmark = 'Finnmark',
  Innlandet = 'Innladet',
  MøreOgRomsdal = 'Møre og Romsdal',
  Nordland = 'Nordland',
  Oslo = 'Oslo',
  Rogaland = 'Rogaland',
  Svalbar = 'Svalbar',
  Telemark = 'Telemark',
  Troms = 'Troms',
  Trøndelag = 'Trøndelag',
  Vestland = 'Vestland',
  Vestfold = 'Vestfold',
  Østland = 'Østland',
}

export enum MessageType {
  NORMAL = 'NORMAL',
  BID = 'BID',
  PURCHASE = 'PURCHASE',
  CHANGED = 'STATUS_CHANGED',
}

export enum BidStatus {
  Accepted = 'ACCEPTED',
  Rejected = 'REJECTED',
  Pending = 'PENDING',
}
