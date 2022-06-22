export interface VatRequest {
  telegramChatId: string;
  countryCode: string;
  vatNumber: string;
  expirationDate: Date;
}

export interface VatRequestError {
  vatRequest: VatRequest;
  error: string;
}
