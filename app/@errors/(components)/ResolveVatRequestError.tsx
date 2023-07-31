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
import { AlertTriangle, BellOff, BellRing, Check, Loader2 } from "lucide-react";
import { useState } from "react";

export function ResolveVatRequestError({ data }: { data: VatRequestError }) {
  const isExpired = data.vatRequest.expirationDate < new Date();

  const [isOpen, setIsOpen] = useState(false);
  const { execute, isBusy } = useApiCall("/api/resolve-error");

  const handleResolve = (silent: boolean) => {
    return execute({
      payload: {
        errorId: data.id,
        silent
      },
      onSuccess: () => {
        setIsOpen(false);
      }
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          title="Resolve VAT Request Error"
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Check />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Resolve VAT Request Error</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="flex flex-col gap-4">
              {isExpired && (
                <div className="rounded-lg bg-yellow-100 p-4 text-yellow-700 grid grid-cols-[auto_1fr] grid-rows-[auto_auto] items-center gap-x-4">
                  <AlertTriangle className="row-span-2" size={36} />
                  <p className="text-xl">Warning</p>
                  <p>
                    This VAT request has already been expired. Consider removing
                    it instead.
                  </p>
                </div>
              )}
              <p>
                Resolving this VAT request error will put it back into the
                monitoring queue. You can choose to notify the owner of this
                action.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isBusy}>Cancel</AlertDialogCancel>

          {/* Confirm (Silent) */}
          <Button
            onClick={() => handleResolve(true)}
            className="flex gap-2 bg-blue-500 hover:bg-blue-600"
            disabled={isBusy}
            title="Resolve without notifying owner"
          >
            {isBusy && <Loader2 className="animate-spin" />}
            <BellOff />
            Confirm
          </Button>

          {/* Confirm (Notify) */}
          <Button
            onClick={() => handleResolve(false)}
            className="flex gap-2 bg-blue-500 hover:bg-blue-600"
            disabled={isBusy}
            title="Resolve and notify owner"
          >
            {isBusy && <Loader2 className="animate-spin" />}
            <BellRing />
            Confirm
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
