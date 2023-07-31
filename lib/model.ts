import { z } from "zod";

export const VatRequestSchema = z.object({
  telegramChatId: z.string(),
  countryCode: z.string(),
  vatNumber: z.string(),
  expirationDate: z.string().pipe(z.coerce.date())
});

export const VatRequestErrorSchema = z.object({
  id: z.string(),
  error: z.string(),
  vatRequest: VatRequestSchema
});

export const VatRequestDtoSchema = z.object({
  telegramChatId: z
    .string()
    .min(3, "Telegram Chat ID must be at least 3 characters long"),
  vatNumber: z.string().min(3, "VAT number must be at least 3 characters long")
});

export const UpdateVatRequestDtoSchema = z.object({
  telegramChatId: z.string(),
  vatNumber: z.string(),
  newVatNumber: z.string()
});

export const VatRequestErrorDtoSchema = z.object({
  errorId: z.string(),
  silent: z.boolean().default(true)
});

export const VatRequestsResponseSchema = z.array(VatRequestSchema);
export const VatRequestErrorsResponseSchema = z.array(VatRequestErrorSchema);

export type VatRequest = z.infer<typeof VatRequestSchema>;
export type VatRequestError = z.infer<typeof VatRequestErrorSchema>;
export type VatRequestDto = z.infer<typeof VatRequestDtoSchema>;
export type VatRequestErrorDto = z.infer<typeof VatRequestErrorDtoSchema>;
export type UpdateVatRequestDto = z.infer<typeof UpdateVatRequestDtoSchema>;
