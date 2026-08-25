import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { CreditCard, Cookie, ExternalLink } from "lucide-react";
import type { Product } from "@/lib/data/catalog";
import { formatUsd } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StripeBuyButton } from "@/components/checkout/stripe-buy-button";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

const CART_KEY = "examhub.checkout_history";
const LAST_KEY = "examhub.last_checkout";

function rememberCheckout(product: Product) {
  try {
    const entry = {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      priceUsd: product.priceUsd,
      at: Date.now(),
    };
    const prev = JSON.parse(localStorage.getItem(CART_KEY) || "[]") as unknown[];
    const next = [
      entry,
      ...prev.filter((x: any) => x?.productId !== product.id),
    ].slice(0, 40);
    localStorage.setItem(CART_KEY, JSON.stringify(next));
    localStorage.setItem(LAST_KEY, JSON.stringify(entry));
    const exp = new Date(Date.now() + 30 * 864e5).toUTCString();
    document.cookie = `examhub_last_product=${encodeURIComponent(product.slug)}; path=/; expires=${exp}; SameSite=Lax`;
  } catch {
    /* storage blocked */
  }
}

export function CheckoutForm({ product }: { product: Product }) {
  const { user } = useCurrentUserState();
  const buyId = product.stripeBuyButtonId;

  useEffect(() => {
    rememberCheckout(product);
  }, [product.id, product.slug, product.name, product.priceUsd]);

  if (!buyId) {
    return (
      <Card className="min-w-0 overflow-hidden">
        <CardContent className="p-6 text-sm text-fg-muted">
          Stripe is not configured for this product. Contact support on Discord
          (minjunio).
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="min-w-0 max-w-full overflow-hidden">
      <CardHeader className="min-w-0 space-y-2 px-4 sm:px-6">
        <CardTitle className="flex flex-wrap items-center gap-2 text-xl sm:text-2xl">
          <CreditCard className="h-5 w-5 text-primary" />
          Pay {formatUsd(product.priceUsd)} with Stripe
        </CardTitle>
        <p className="text-sm text-fg-muted">
          After payment you land on Activate — pick macOS/Windows + serial for
          SAT/ACT/proctor, or get a progress link for research & internships.
        </p>
      </CardHeader>
      <CardContent className="min-w-0 space-y-4 px-4 sm:px-6">
        <div className="rounded-xl border border-border bg-bg-soft/50 p-3 sm:p-4">
          <StripeBuyButton
            buyButtonId={buyId}
            clientReferenceId={product.id}
          />
        </div>
        <p className="text-xs text-muted">
          Stripe success URL must be{" "}
          <code className="rounded bg-bg-soft px-1">
            /activate?session_id={"{CHECKOUT_SESSION_ID}"}
          </code>
          . Already paid?{" "}
          <Link
            to="/activate"
            search={{ session_id: undefined }}
            className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
          >
            Open activate
            <ExternalLink className="h-3 w-3" />
          </Link>
        </p>
        <p className="flex items-start gap-2 text-xs text-muted">
          <Cookie className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          This product is remembered in your browser.
          {!user ? (
            <>
              {" "}
              Optional:{" "}
              <Link
                to="/login"
                className="font-semibold text-primary hover:underline"
              >
                sign in with email
              </Link>
            </>
          ) : null}
        </p>
      </CardContent>
    </Card>
  );
}
