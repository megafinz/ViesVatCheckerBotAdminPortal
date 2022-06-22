export interface VatRequest {
  telegramChatId: string;
  countryCode: string;
  vatNumber: string;
  expirationDate: Date;
}

export interface VatRequestError {
  id: string;
  vatRequest: VatRequest;
  error: string;
}
