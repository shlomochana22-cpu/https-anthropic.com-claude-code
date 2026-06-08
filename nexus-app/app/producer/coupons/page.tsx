import { CouponsBoard } from "@/components/CouponsBoard";
import { getCoupons } from "@/lib/queries";

export default async function CouponsPage() {
  const dbCoupons = await getCoupons();
  return <CouponsBoard dbCoupons={dbCoupons} />;
}
