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
import { VatRequestDto, VatRequestDtoSchema } from "@/lib/model";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export function AddVatRequest() {
  const [isOpen, setIsOpen] = useState(false);
  const { execute, isBusy } = useApiCall("/api/check");

  const form = useForm({
    resolver: zodResolver(VatRequestDtoSchema),
    defaultValues: {
      telegramChatId: "",
      vatNumber: ""
    }
  });

  const handleSubmit = (data: VatRequestDto) => {
    return execute({
      payload: data,
      onSuccess: () => {
        setIsOpen(false);
      }
    });
  };

  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-2 bg-blue-500 hover:bg-blue-600">
          <Plus />
          <span className="whitespace-nowrap">VAT Request</span>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>New VAT Request</DialogTitle>
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
                  <FormControl placeholder="123456789">
                    <Input {...field} disabled={isBusy} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* VAT Number */}
            <FormField
              control={form.control}
              name="vatNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>VAT Number</FormLabel>
                  <FormControl placeholder="PL123456789">
                    <Input {...field} disabled={isBusy} />
                  </FormControl>
                  <FormMessage />
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
