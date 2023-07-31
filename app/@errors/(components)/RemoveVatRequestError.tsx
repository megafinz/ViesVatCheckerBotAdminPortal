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
import type { VatRequestError } from "@/lib/model";
import { Loader2, Trash } from "lucide-react";
import { useState } from "react";

export function RemoveVatRequestError({ data }: { data: VatRequestError }) {
  const [isOpen, setIsOpen] = useState(false);
  const { execute, isBusy } = useApiCall("/api/remove-error");

  const handleRemove = () => {
    return execute({
      payload: {
        errorId: data.id
      },
      onSuccess: () => {
        setIsOpen(false);
      }
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"} title="Remove VAT Request Error">
          <Trash />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove VAT Request Error</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove this VAT request error? VAT number
            will no longer be monitored and owner will not be notified of this
            action.
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
