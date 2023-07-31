"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useApiCall } from "@/lib/hooks";
import {
  UpdateVatRequestDtoSchema,
  type UpdateVatRequestDto,
  type VatRequest
} from "@/lib/model";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export function EditVatRequest({ data }: { data: VatRequest }) {
  const [isOpen, setIsOpen] = useState(false);
  const { execute, isBusy } = useApiCall("/api/update");

  const form = useForm({
    resolver: zodResolver(UpdateVatRequestDtoSchema),
    defaultValues: {
      telegramChatId: data.telegramChatId,
      vatNumber: `${data.countryCode}${data.vatNumber}`,
      newVatNumber: `${data.countryCode}${data.vatNumber}`
    }
  });

  const handleSubmit = (payload: UpdateVatRequestDto) => {
    return execute({
      payload: {
        telegramChatId: payload.telegramChatId,
        vatNumber: `${data.countryCode}${data.vatNumber}`,
        newVatNumber: payload.newVatNumber
      },
      onSuccess: () => {
        setIsOpen(false);
      }
    });
  };

  useEffect(() => {
    if (isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-blue-500 hover:bg-blue-600"
          title="Edit VAT Request"
        >
          <Edit />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit VAT Request</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            className="flex flex-col gap-4 mt-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            {/* Telegram Chat ID */}
            <FormField
              control={form.control}
              name="telegramChatId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telegram Chat ID</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isBusy} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* New VAT Number */}
            <FormField
              control={form.control}
              name="newVatNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>VAT Number</FormLabel>
                  <FormControl placeholder="PL123456789">
                    <Input {...field} disabled={isBusy} autoFocus={true} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Old VAT Number */}
            <FormField
              control={form.control}
              name="vatNumber"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isBusy}
                      autoFocus={true}
                      type="hidden"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant={"outline"}
                onClick={() => setIsOpen(false)}
                disabled={isBusy}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="flex gap-2 bg-blue-500 hover:bg-blue-600"
                disabled={isBusy}
              >
                {isBusy && <Loader2 className="animate-spin" />}
                Confirm
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
