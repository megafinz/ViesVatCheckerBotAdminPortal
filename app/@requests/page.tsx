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
import { VatRequestsResponseSchema, type VatRequest } from "@/lib/model";
import { ExpirationDate } from "../(components)/ExpirationDate";
import { TelegramChatId } from "../(components)/TelegramChatId";
import { AddVatRequest } from "./(components)/AddVatRequest";
import { EditVatRequest } from "./(components)/EditVatRequest";
import { RemoveVatRequest } from "./(components)/RemoveVatRequest";

// TODO: paging.
export default async function VatRequestList() {
  const url = getAdminApiUrl("list");
  const response = await fetch(url);
  const json = await response.json();
  const vatRequests = VatRequestsResponseSchema.parse(json);
  vatRequests.sort((x, y) => (x.expirationDate < y.expirationDate ? 1 : -1));
  const hasItems = vatRequests.length > 0;
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          VAT Requests {hasItems && `(${vatRequests.length})`}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Expires At</TableHead>
              <TableHead>VAT Number</TableHead>
              <TableHead>Telegram Chat ID</TableHead>
              <TableHead className="text-right py-2">
                <div className="inline-flex">
                  <AddVatRequest />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {hasItems &&
              vatRequests.map((x) => (
                <TableRow key={x.vatNumber + x.telegramChatId}>
                  <VatRequest data={x} />
                </TableRow>
              ))}
            {!hasItems && (
              <TableRow>
                <TableCell colSpan={4}>
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

function VatRequest({ data }: { data: VatRequest }) {
  return (
    <>
      {/* Expiration Date */}
      <TableCell>
        <ExpirationDate data={data.expirationDate} />
      </TableCell>

      {/* VAT Number */}
      <TableCell>
        {data.countryCode}
        {data.vatNumber}
      </TableCell>

      {/* Telegram Chat ID */}
      <TableCell>
        <TelegramChatId data={data.telegramChatId} />
      </TableCell>

      {/* Remove */}
      <TableCell className="text-right">
        <div className="inline-flex gap-2">
          <EditVatRequest data={data} />
          <RemoveVatRequest data={data} />
        </div>
      </TableCell>
    </>
  );
}
