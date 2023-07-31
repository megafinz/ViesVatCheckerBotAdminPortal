import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { getAdminApiUrl } from "@/lib/api";
import {
  VatRequestErrorsResponseSchema,
  type VatRequestError
} from "@/lib/model";
import { ExpirationDate } from "../(components)/ExpirationDate";
import { TelegramChatId } from "../(components)/TelegramChatId";
import { RemoveVatRequestError } from "./(components)/RemoveVatRequestError";
import { ResolveVatRequestError } from "./(components)/ResolveVatRequestError";

export default async function VatRequestErrorList() {
  const url = getAdminApiUrl("listErrors");
  const response = await fetch(url);
  const json = await response.json();
  const vatRequestErrors = VatRequestErrorsResponseSchema.parse(json);
  vatRequestErrors.sort((x, y) =>
    x.vatRequest.expirationDate < y.vatRequest.expirationDate ? 1 : -1
  );
  const hasItems = vatRequestErrors.length > 0;
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          VAT Request Errors {hasItems && `(${vatRequestErrors.length})`}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Expires At</TableHead>
              <TableHead>VAT Number</TableHead>
              <TableHead className="py-2">Telegram Chat ID</TableHead>
              <TableHead>Error</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {hasItems &&
              vatRequestErrors.map((x) => (
                <TableRow key={x.id}>
                  <VatRequestError data={x} />
                </TableRow>
              ))}
            {!hasItems && (
              <TableRow>
                <TableCell colSpan={5}>
                  <p className="text-gray-400 text-2xl text-center my-4">
                    Nothing to show here
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function VatRequestError({ data }: { data: VatRequestError }) {
  return (
    <>
      {/* Expiration Date */}
      <TableCell>
        <ExpirationDate data={data.vatRequest.expirationDate} />
      </TableCell>

      {/* VAT Number */}
      <TableCell>
        {data.vatRequest.countryCode}
        {data.vatRequest.vatNumber}
      </TableCell>

      {/* Telegram Chat ID */}
      <TableCell>
        <TelegramChatId data={data.vatRequest.telegramChatId} />
      </TableCell>

      {/* Error */}
      <TableCell>{data.error}</TableCell>

      {/* Resolve / Remove */}
      <TableCell className="text-right">
        <div className="inline-flex gap-2">
          <ResolveVatRequestError data={data} />
          <RemoveVatRequestError data={data} />
        </div>
      </TableCell>
    </>
  );
}
