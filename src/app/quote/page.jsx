import PatchRequestWizard from "@/components/PatchRequestWizard";
import Script from "next/script";

export const metadata = {
  title: "Get Custom Patch Quote | Northern Patches USA",
  description:
    "Request a custom embroidered, PVC, leather or chenille patch quote. Premium quality, fast turnaround, USA delivery.",
  alternates: {
    canonical: "https://northernpatches.com/quote",
  },
};

export default function QuotePage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground pt-24 pb-32 overflow-x-hidden">
      {/* SEO Schema */}
      <Script
        id="quote-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Custom Patch Quote",
            "provider": {
              "@type": "Organization",
              "name": "Northern Patches USA",
              "url": "https://northernpatches.com",
            },
            "areaServed": "US",
            "serviceType": "Custom Patches Manufacturing",
          }),
        }}
      />

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 text-center mb-16">
        <p className="text-sm uppercase tracking-widest text-muted font-semibold">
          Custom Patch Quote
        </p>

        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold gradient-heading hero-soft-shadow">
          Get Your Patch Made Exactly Your Way
        </h1>

        <p className="mt-6 max-w-2xl mx-auto text-muted text-base md:text-lg">
          Submit your requirements and artwork. Our experts will review your
          request and respond with pricing & production details.
        </p>
      </section>

      {/* FORM */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="card p-5 sm:p-6 md:p-8">
          <PatchRequestWizard />
        </div>
      </section>
    </main>
  );
}
