"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { ErrorMessage } from "../(components)/ErrorMessage";

export default function Error({
  error,
  reset
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <ErrorMessage
      title="VAT Request Error List is broken!"
      message={error.message}
      reset={reset}
    />
  );
}
