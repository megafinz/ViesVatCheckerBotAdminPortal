"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useApiCall } from "@/lib/hooks";
import type { VatRequest } from "@/lib/model";
import { Loader2, Trash } from "lucide-react";
import { useState } from "react";

export function RemoveVatRequest({ data }: { data: VatRequest }) {
  const [isOpen, setIsOpen] = useState(false);
  const { execute, isBusy } = useApiCall("/api/uncheck");

  const handleRemove = () => {
    return execute({
      payload: {
        telegramChatId: data.telegramChatId,
        vatNumber: `${data.countryCode}${data.vatNumber}`
      },
      onSuccess: () => {
        setIsOpen(false);
      }
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"} title="Remove VAT Request">
          <Trash />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove VAT Request</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove VAT request{" "}
            <b>
              {data.countryCode}
              {data.vatNumber}
            </b>{" "}
            from monitoring?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isBusy}>Cancel</AlertDialogCancel>

          <Button
            variant={"destructive"}
            onClick={handleRemove}
            className="flex gap-2"
            disabled={isBusy}
          >
            {isBusy && <Loader2 className="animate-spin" />}
            Confirm
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
