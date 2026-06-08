"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "./Icon";
import { createOrder, type CartItem, type Buyer, type Participant } from "@/lib/orders";
import { bumpCouponUsage } from "@/lib/coupons";

export function PayButton({
  eventId,
  items,
  subtotal,
  coupon = null,
  buyer,
  participants,
  disabled = false,
}: {
  eventId: string;
  items: string;
  subtotal: number;
  coupon?: { id: string; used: number } | null;
  buyer?: Buyer;
  participants?: Participant[];
  disabled?: boolean;
}) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "processing">("idle");

  const pay = async () => {
    setState("processing");
    const cart: CartItem[] = items
      .split(",")
      .filter(Boolean)
      .map((p) => {
        const [tierSlug, qty] = p.split(":");
        return { tierSlug, qty: Number(qty) || 0 };
      });
    const { orderId } = await createOrder(eventId, cart, subtotal, buyer, participants);
    if (coupon) await bumpCouponUsage(coupon.id, coupon.used + 1);
    router.push(`/confirmation?event=${eventId}&order=${orderId}&items=${encodeURIComponent(items)}`);
  };

  return (
    <button
      onClick={pay}
      disabled={state === "processing" || disabled}
      className="w-full h-16 bg-primary-fixed text-on-primary-fixed text-headline-md font-bold rounded-xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_0_30px_rgba(191,245,32,0.4)] disabled:opacity-50"
    >
      {state === "processing" ? (
        <>
          מעבד תשלום... <Icon name="sync" className="animate-spin" />
        </>
      ) : (
        <>
          בצע תשלום מאובטח <Icon name="lock" />
        </>
      )}
    </button>
  );
}
