// src/app/custom-embroidered-patches-usa/[state]/page.jsx
import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import AnimatedCard from "@/components/AnimatedCard";
import ServicesList from "@/app/services/ServicesList";
import { getUSStates, getStateByCode, getServices } from "@/lib/api";
import { generateContent, generateJsonLd } from "@/lib/contentGenerator";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const states = await getUSStates();
  return states.map(s => ({ state: s.code.toLowerCase() }));
}

export async function generateMetadata({ params }) {
  const state = await getStateByCode(params.state);
  if (!state) return { title: "State Not Found" };
  return {
    title: `Custom Embroidered Patches in ${state.name} | Northern Patches USA`,
    description: `Premium custom embroidered patches in ${state.name}. Embroidered, PVC, chenille, woven, leather, Velcro patches. No minimum order, fast USA shipping.`,
    alternates: { canonical: `https://northernpatches.com/custom-embroidered-patches-usa/${params.state}/` },
    openGraph: {
      title: `Custom Embroidered Patches in ${state.name} | Northern Patches USA`,
      description: `Premium custom embroidered patches in ${state.name}. Embroidered, PVC, chenille, woven, leather, Velcro patches. No minimum order, fast USA shipping.`,
      url: `https://northernpatches.com/custom-embroidered-patches-usa/${params.state}/`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Custom Embroidered Patches in ${state.name} | Northern Patches USA`,
      description: `Premium custom embroidered patches in ${state.name}. Embroidered, PVC, chenille, woven, leather, Velcro patches. No minimum order, fast USA shipping.`,
      images: ["/slider1.jpg"]
    }
  };
}

export default async function StatePage({ params }) {
  const state = await getStateByCode(params.state);
  if (!state) return <p className="text-red-500 text-center mt-12">State not found</p>;

  const services = await getServices();
  const allStates = await getUSStates();

  const { intro, benefits, applications, faqs, slides, links } = generateContent({
    name: state.name,
    type: "state",
    services,
    allLocations: allStates.map(s => ({ name: s.name, slug: s.code.toLowerCase(), url: `/custom-embroidered-patches-usa/${s.code.toLowerCase()}` }))
  });

  const jsonLd = generateJsonLd({ type: "state", name: state.name, services, faqs });

  return (
    <main className="bg-gray-900 text-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <HeroSlider slides={slides} />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center">
          Custom Embroidered Patches in {state.name} – USA Made
        </h1>
        <p className="text-gray-300 text-lg mb-12">{intro}</p>

        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Popular Patches in {state.name}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => <AnimatedCard key={s.slug || i}>{s.title || s.name}</AnimatedCard>)}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Why Choose Northern Patches in {state.name}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b,i) => <AnimatedCard key={i}>{b}</AnimatedCard>)}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Applications in {state.name}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {applications.map((a,i) => <AnimatedCard key={i}>{a}</AnimatedCard>)}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">FAQs – {state.name}</h2>
          <div className="space-y-6">
            {faqs.map((f,i) => (
              <AnimatedCard key={i} className="text-left">
                <h3 className="font-bold text-accent mb-2">{f.q}</h3>
                <p className="text-gray-300">{f.a}</p>
              </AnimatedCard>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Explore Other States</h2>
          <div className="flex flex-wrap justify-center gap-4 text-lg">{links}</div>
        </section>

        <div className="text-center mt-16">
          <Link href="/quote" className="btn-primary px-12 py-4 md:px-16 md:py-6 text-xl md:text-2xl shadow-2xl">
            Get Free Quote in {state.name}
          </Link>
        </div>

        <ServicesList services={services} showSearch={true} showJsonLd={true} enableAnimation={true} />
      </div>
    </main>
  );
}