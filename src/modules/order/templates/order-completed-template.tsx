"use client";

import { Heading } from "@medusajs/ui"
import { cookies as nextCookies } from "next/headers"
import { useEffect, useState } from "react"

import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OnboardingCta from "@modules/order/components/onboarding-cta"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import ConfirmationEmail from "@modules/checkout/components/confirmation-email"
import { HttpTypes } from "@medusajs/types"
import { useCustomer } from "medusa-react"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const [isOnboarding, setIsOnboarding] = useState(false);
  const { customer } = useCustomer();
  
  useEffect(() => {
    // Get cookie value client-side
    const onboardingValue = document.cookie
      .split("; ")
      .find(row => row.startsWith("_medusa_onboarding="))
      ?.split("=")[1];
      
    setIsOnboarding(onboardingValue === "true");
  }, []);

  return (
    <div className="py-6 min-h-[calc(100vh-64px)]">
      <div className="content-container flex flex-col justify-center items-center gap-y-10 max-w-4xl h-full w-full">
        {isOnboarding && <OnboardingCta orderId={order.id} />}
        <div
          className="flex flex-col gap-4 max-w-4xl h-full bg-white w-full py-10"
          data-testid="order-complete-container"
        >
          <Heading
            level="h1"
            className="flex flex-col gap-y-3 text-ui-fg-base text-3xl mb-4"
          >
            <span>Thank you!</span>
            <span>Your order was placed successfully.</span>
          </Heading>
          <OrderDetails order={order} />
          <Heading level="h2" className="flex flex-row text-3xl-regular">
            Summary
          </Heading>
          <Items order={order} />
          <CartTotals totals={order} />
          <ShippingDetails order={order} />
          <PaymentDetails order={order} />
          <Help />
          
          {/* Send confirmation email if customer is logged in */}
          {customer && <ConfirmationEmail order={order} customer={customer} />}
        </div>
      </div>
    </div>
  )
}
