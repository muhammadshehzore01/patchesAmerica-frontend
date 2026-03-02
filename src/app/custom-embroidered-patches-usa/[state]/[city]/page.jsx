// src/app/custom-embroidered-patches-usa/[state]/[city]/page.jsx
import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import AnimatedCard from "@/components/AnimatedCard";
import ServicesList from "@/app/services/ServicesList";
import { getUSStates, getStateByCode, getServices } from "@/lib/api";
import { generateContent, generateJsonLd } from "@/lib/contentGenerator";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const states = await getUSStates();
  const params = [];

  for (const state of states) {
    const stateData = await getStateByCode(state.code);
    if (stateData?.cities?.length) {
      stateData.cities.forEach(cityName => {
        if (cityName) params.push({
          state: state.code.toLowerCase(),
          city: cityName.toLowerCase().replace(/\s+/g,"-")
        });
      });
    }
  }
  return params;
}

export async function generateMetadata({ params }) {
  const state = await getStateByCode(params.state);
  const city = state?.cities?.find(c => c.toLowerCase().replace(/\s+/g,"-") === params.city);
  if (!state || !city) return { title: "City Not Found" };

  return {
    title: `Custom Embroidered Patches in ${city}, ${state.name} | Northern Patches USA`,
    description: `Premium custom embroidered patches in ${city}, ${state.name}. Embroidered, PVC, chenille, woven, leather, Velcro patches. No minimum order, fast USA shipping.`,
    alternates: { canonical: `https://northernpatches.com/custom-embroidered-patches-usa/${params.state}/${params.city}/` },
    openGraph: {
      title: `Custom Embroidered Patches in ${city}, ${state.name} | Northern Patches USA`,
      description: `Premium custom embroidered patches in ${city}, ${state.name}. Embroidered, PVC, chenille, woven, leather, Velcro patches. No minimum order, fast USA shipping.`,
      url: `https://northernpatches.com/custom-embroidered-patches-usa/${params.state}/${params.city}/`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Custom Embroidered Patches in ${city}, ${state.name} | Northern Patches USA`,
      description: `Premium custom embroidered patches in ${city}, ${state.name}. Embroidered, PVC, chenille, woven, leather, Velcro patches. No minimum order, fast USA shipping.`,
      images: ["/slider1.jpg"]
    }
  };
}

export default async function CityPage({ params }) {
  const state = await getStateByCode(params.state);
  const citySlug = params.city;
  const cityName = state?.cities?.find(c => c.toLowerCase().replace(/\s+/g,"-") === citySlug);
  if (!state || !cityName) return <p className="text-red-500 text-center mt-12">City not found</p>;

  const services = await getServices();
  const allCities = state.cities.map(c => ({ name: c, slug: c.toLowerCase().replace(/\s+/g,"-"), url:`/custom-embroidered-patches-usa/${state.code.toLowerCase()}/${c.toLowerCase().replace(/\s+/g,"-")}` }));

  const { intro, benefits, applications, faqs, slides, links } = generateContent({
    name: cityName,
    type: "city",
    stateName: state.name,
    services,
    allLocations: allCities
  });

  const jsonLd = generateJsonLd({ type: "city", name: cityName, stateName: state.name, services, faqs });

  return (
    <main className="bg-gray-900 text-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <HeroSlider slides={slides} />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center">
          Custom Embroidered Patches in {cityName}, {state.name} – USA Made
        </h1>
        <p className="text-gray-300 text-lg mb-12">{intro}</p>

        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Popular Patches in {cityName}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s,i) => <AnimatedCard key={s.slug || i}>{s.title || s.name}</AnimatedCard>)}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Why Choose Northern Patches in {cityName}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b,i) => <AnimatedCard key={i}>{b}</AnimatedCard>)}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Applications in {cityName}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {applications.map((a,i) => <AnimatedCard key={i}>{a}</AnimatedCard>)}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">FAQs – {cityName}</h2>
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
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Explore Other Cities in {state.name}</h2>
          <div className="flex flex-wrap justify-center gap-4 text-lg">{links}</div>
        </section>

        <div className="text-center mt-16 mb-16">
          <Link href="/quote" className="btn-primary px-12 py-4 md:px-16 md:py-6 text-xl md:text-2xl shadow-2xl">
            Get Free Quote in {cityName}
          </Link>
        </div>

        <ServicesList services={services} showSearch={true} showJsonLd={true} enableAnimation={true} />
      </div>
    </main>
  );
}