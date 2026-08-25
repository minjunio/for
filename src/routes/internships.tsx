import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/layout/shell";
import {
  INTERNSHIP_EXTRAS,
  INTERNSHIP_FIELDS,
  INTERNSHIP_FLAT_USD,
  INTERNSHIP_STRIPE_BUTTON,
} from "@/lib/data/catalog";
import { formatUsd } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StripeBuyButton } from "@/components/checkout/stripe-buy-button";
import { Cookie } from "lucide-react";

export const Route = createFileRoute("/internships")({
  component: InternshipsPage,
  head: () => ({
    meta: [
      {
        title: "Internship Placement $750 | Stripe — ExamHub",
      },
      {
        name: "description",
        content:
          "Flat $750 internship package with free add-ons. Pay with Stripe — then get a progress link managed by admin.",
      },
    ],
  }),
});

function InternshipsPage() {
  const { isAdmin } = Route.useRouteContext();

  useEffect(() => {
    try {
      localStorage.setItem(
        "examhub.last_checkout",
        JSON.stringify({
          productId: "internship",
          name: "Internship placement",
          priceUsd: INTERNSHIP_FLAT_USD,
          at: Date.now(),
        }),
      );
      document.cookie = `examhub_last_product=internship; path=/; max-age=${30 * 86400}; SameSite=Lax`;
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <Shell isAdmin={isAdmin}>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Badge variant="accent" className="mb-2">
          Internship · {formatUsd(INTERNSHIP_FLAT_USD)} flat
        </Badge>
        <h1 className="font-display text-3xl font-bold text-fg sm:text-4xl">
          Internship matching
        </h1>
        <p className="mt-2 text-fg-muted">
          One price. After Stripe you enter contact on{" "}
          <strong>/activate</strong> and get a progress link admin updates until
          placement delivery.
        </p>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Pay with Stripe</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <StripeBuyButton
              buyButtonId={INTERNSHIP_STRIPE_BUTTON}
              clientReferenceId="internship"
            />
            <p className="flex flex-wrap items-start gap-2 text-xs text-muted">
              <Cookie className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Success URL:{" "}
              <code className="rounded bg-bg-soft px-1">
                /activate?session_id={"{CHECKOUT_SESSION_ID}"}
              </code>
              . Already paid?{" "}
              <Link
                to="/activate"
                search={{ session_id: undefined }}
                className="font-semibold text-primary hover:underline"
              >
                Open activate
              </Link>
              {" · "}
              <Link
                to="/login"
                className="font-semibold text-primary hover:underline"
              >
                Optional login
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Fields & free add-ons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-fg-muted">
              Fields:{" "}
              {INTERNSHIP_FIELDS.map((f) => f.label).slice(0, 10).join(", ")}…
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {INTERNSHIP_EXTRAS.map((e) => (
                <li
                  key={e.id}
                  className="rounded-xl border border-border bg-bg-soft/50 px-3 py-2 text-sm"
                >
                  <span className="font-semibold text-fg">{e.label}</span>
                  <span className="block text-xs text-muted">
                    {e.description} · Free
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
