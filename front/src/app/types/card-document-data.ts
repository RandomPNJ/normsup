export class CardDocumentData {
  id?: string;
  name: string;
  btnLabel: string;
  btnIcon: string;
  expirationDate: string;
  expirationStatus: ExpirationStatus;
}

export enum ExpirationStatus {
  NOT_EXIST = 'NOT_EXIST',
  EXPIRED = 'EXPIRED',
  EXPIRED_SOON = 'EXPIRED_SOON',
  UP_TO_DATE = 'UP_TO_DATE'
}
