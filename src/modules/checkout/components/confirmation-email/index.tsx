"use client";

import { useEffect, useState } from "react";
import { HttpTypes } from '@medusajs/types';

interface ConfirmationEmailProps {
  order: HttpTypes.StoreOrder;
  customer: HttpTypes.StoreCustomer;
}

const ConfirmationEmail = ({ order, customer }: ConfirmationEmailProps) => {
  const [emailSent, setEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sendOrderConfirmation = async () => {
      if (emailSent || !order || !customer) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "order_confirmation",
            data: {
              email: customer.email,
              order: order,
            },
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to send confirmation email");
        }

        setEmailSent(true);
      } catch (err) {
        console.error("Error sending confirmation email:", err);
        setError(
          err instanceof Error ? err.message : "Failed to send confirmation email"
        );
      } finally {
        setIsLoading(false);
      }
    };

    sendOrderConfirmation();
  }, [order, customer, emailSent]);

  // This component doesn't render anything visible, it just handles the email sending
  return null;
};

export default ConfirmationEmail; 