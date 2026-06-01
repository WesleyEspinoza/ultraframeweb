import { redirect } from "next/navigation";

type CheckoutSuccessProps = {
  searchParams: Promise<{ session_id?: string }>;
};

/** Legacy Stripe success URL → canonical /success route. */
export default async function CheckoutSuccessRedirect({
  searchParams,
}: CheckoutSuccessProps) {
  const { session_id: sessionId } = await searchParams;
  if (sessionId) {
    redirect(`/success?session_id=${encodeURIComponent(sessionId)}`);
  }
  redirect("/success");
}
