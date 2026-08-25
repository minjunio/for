import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/layout/shell";
import {
  RESEARCH_BASE_USD,
  RESEARCH_OPTIONS,
  RESEARCH_STRIPE_BUTTON,
  RESEARCH_SUBJECTS,
} from "@/lib/data/catalog";
import { formatUsd } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StripeBuyButton } from "@/components/checkout/stripe-buy-button";
import { Cookie } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/research")({
  component: ResearchPage,
  head: () => ({
    meta: [
      {
        title: "Research Paper Package $800 | Stripe — ExamHub",
      },
      {
        name: "description",
        content:
          "Flat $800 research paper package. Free add-ons included. Pay with Stripe — then get a progress link managed by admin.",
      },
    ],
  }),
});

function ResearchPage() {
  const { isAdmin } = Route.useRouteContext();

  useEffect(() => {
    try {
      localStorage.setItem(
        "examhub.last_checkout",
        JSON.stringify({
          productId: "research",
          name: "Research paper",
          priceUsd: RESEARCH_BASE_USD,
          at: Date.now(),
        }),
      );
      document.cookie = `examhub_last_product=research; path=/; max-age=${30 * 86400}; SameSite=Lax`;
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <Shell isAdmin={isAdmin}>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Badge className="mb-2">Research · {formatUsd(RESEARCH_BASE_USD)}</Badge>
        <h1 className="font-display text-3xl font-bold text-fg sm:text-4xl">
          Research paper package
        </h1>
        <p className="mt-2 text-fg-muted">
          Flat {formatUsd(RESEARCH_BASE_USD)}. After Stripe pay you're sent to
          activation — leave contact and get a <strong>progress link</strong>{" "}
          admin updates until delivery.
        </p>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Pay with Stripe</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <StripeBuyButton
              buyButtonId={RESEARCH_STRIPE_BUTTON}
              clientReferenceId="research"
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
            <CardTitle className="text-base">Subjects & free options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-fg-muted">
              Subjects: {RESEARCH_SUBJECTS.slice(0, 12).join(", ")}
              {RESEARCH_SUBJECTS.length > 12 ? "…" : ""}
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {RESEARCH_OPTIONS.map((o) => (
                <li
                  key={o.id}
                  className="rounded-xl border border-border bg-bg-soft/50 px-3 py-2 text-sm"
                >
                  <span className="font-semibold text-fg">{o.label}</span>
                  {o.description ? (
                    <span className="mt-0.5 block text-xs text-muted">
                      {o.description}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
