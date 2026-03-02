// project/frontend/src/app/custom-embroidered-patches-usa/page.jsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Suspense, useEffect, useState } from 'react';
import HeroSlider from '@/components/HeroSlider';
import ServicesShowcase from '@/components/home/ServicesShowcase';
import { useHomeData } from '@/hooks/useApiHooks';
import { getUSStates } from '@/lib/api';

function PricingSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="h-120/30 rounded-xl animate-pulse mb-10" />
      <div className="overflow-x-auto">
        <div className="min-w-[600px] h-64 bg-gray-700/20 rounded-2xl animate-pulse" />
      </div>
    </div>
  );
}

export default function CustomEmbroideredPatchesUSAPage() {
  const { sliders, services, isLoading } = useHomeData();
  const [states, setStates] = useState([]);

  const slugify = (text) =>
    text?.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

  useEffect(() => {
    async function loadStates() {
      try {
        const data = await getUSStates();
        setStates(data || []);
      } catch (e) {
        console.error(e);
      }
    }
    loadStates();
  }, []);

  // Filter slides
  let embroideredSlides =
    sliders?.filter(
      (slide) =>
        slide.title?.toLowerCase().includes("embroidered") ||
        slide.subtitle?.toLowerCase().includes("patch") ||
        slide.category === "embroidered"
    ) || [];

  if (isLoading || !embroideredSlides.length) {
    embroideredSlides = [
      {
        image_url: "/slider1.jpg",
        title: "Custom Embroidered Patches USA - No Minimum Order",
        subtitle:
          "Order high-quality custom embroidered patches USA with fast nationwide shipping.",
        alt: "Custom embroidered patches USA",
        cta_text: "Get Free Quote",
      },
    ];
  }

  // JSON-LD
  const jsonLdData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Northern Patches USA",
      url: "https://northernpatches.com",
      logo: "https://northernpatches.com/logo.png",
      sameAs: [
        "https://www.facebook.com/NorthernPatches",
        "https://www.instagram.com/northernpatches",
      ],
    },
  ];

  return (
    <main className="bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] min-h-screen overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      {/* HERO */}
      <HeroSlider slides={embroideredSlides} />

      {/* SERVICES */}
      <ServicesShowcase services={services || []} initialCount={6} showAll={false} />

      {/* STATES & CITIES */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Custom Embroidered Patches Available in All US States & Cities
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {states.map((state) => {
              const stateSlug = slugify(state.name);
              return (
                <div
                  key={stateSlug}
                  className="glass p-6 rounded-2xl border border-gray-700"
                >
                  <h3 className="text-xl font-bold mb-4">{state.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {state.cities?.slice(0, 6).map((city) => {
                      const citySlug = slugify(city);
                      return (
                        <Link
                          key={citySlug}
                          href={`/custom-embroidered-patches-usa/${stateSlug}/${citySlug}`}
                          className="text-xs px-2 py-1 bg-gray-700 rounded hover:bg-cyan-600"
                        >
                          {city}
                        </Link>
                      );
                    })}
                  </div>
                  <Link
                    href={`/custom-embroidered-patches-usa/${stateSlug}`}
                    className="text-cyan-400 hover:underline text-sm"
                  >
                    View all cities in {state.name}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-16 md:py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 md:mb-16">
            Why Choose Northern Patches for Custom Embroidered Patches USA
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "No Minimum Order", desc: "Order 1 or thousands of patches USA." },
              { title: "Fast USA Production & Shipping", desc: "7–14 days standard, rush 3–5 days." },
              { title: "Premium Quality & Durability", desc: "Fade-proof, wash-resistant threads – lasts 5–10+ years." },
              { title: "Free Digitizing on 50+", desc: "Professional digitizing free for bulk orders." },
              { title: "12+ Colors & Special Threads", desc: "Pantone, metallic, glow-in-dark options." },
              { title: "Multiple Backing & Styles", desc: "Sew-on, iron-on, velcro, adhesive, 3D puff, merrowed borders." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass p-8 rounded-3xl text-center"
              >
                <h3 className="text-2xl font-bold mb-4 text-[var(--color-accent)]">{item.title}</h3>
                <p className="text-[var(--color-text-secondary)]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-16 md:py-20 px-6 bg-gradient-to-b from-[var(--color-bg-primary)] to-[var(--color-bg-secondary)]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 md:mb-16">
            Easy 5-Step Process for Custom Embroidered Patches USA
          </h2>
          <div className="grid md:grid-cols-5 gap-6 md:gap-8 text-center">
            {[
              { num: 1, title: "Submit Design", desc: "Upload AI/EPS/PNG for custom patches." },
              { num: 2, title: "Select Specs", desc: "Choose size, backing, colors, quantity." },
              { num: 3, title: "Free Digital Proof", desc: "Review stitch proof in 24–48 hrs." },
              { num: 4, title: "Precision Production", desc: "High-quality stitching in USA facilities." },
              { num: 5, title: "Fast Shipping", desc: "Delivered to your door – nationwide." },
            ].map((step) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="glass p-6 rounded-2xl"
              >
                <div className="w-14 h-14 mx-auto mb-4 bg-[var(--color-accent)] text-white rounded-full flex items-center justify-center text-2xl font-bold">{step.num}</div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12 md:mt-16">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link href="/quote" className="btn-primary text-xl px-12 py-5 shadow-2xl">
                Get Started – Free Quote
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-16 md:py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-10 md:mb-12">
            Transparent Pricing for Custom Embroidered Patches USA
          </h2>
          <Suspense fallback={<PricingSkeleton />}>
            <div className="overflow-x-auto">
              <table className="w-full text-center border-separate border-spacing-y-3 min-w-[600px]">
                <thead>
                  <tr className="bg-[var(--color-accent)]/20">
                    <th className="p-5 rounded-l-2xl font-bold">Quantity</th>
                    <th className="p-5 font-bold">2–2.5"</th>
                    <th className="p-5 font-bold">3–3.5"</th>
                    <th className="p-5 rounded-r-2xl font-bold">4–4.5"</th>
                  </tr>
                </thead>
                <tbody className="text-[var(--color-text-secondary)]">
                  <tr className="glass"><td className="p-5 font-medium">10–24</td><td className="p-5">$4.80</td><td className="p-5">$5.90</td><td className="p-5">$7.20</td></tr>
                  <tr><td className="p-5 font-medium">25–49</td><td className="p-5">$3.20</td><td className="p-5">$4.10</td><td className="p-5">$5.30</td></tr>
                  <tr className="glass"><td className="p-5 font-medium">50–99</td><td className="p-5">$2.40</td><td className="p-5">$3.20</td><td className="p-5">$4.10</td></tr>
                  <tr><td className="p-5 font-medium">100–199</td><td className="p-5">$1.80</td><td className="p-5">$2.50</td><td className="p-5">$3.30</td></tr>
                  <tr className="glass"><td className="p-5 font-medium">200+</td><td colSpan={3} className="p-5">Bulk discounts – Contact for cheap custom patches USA</td></tr>
                </tbody>
              </table>
            </div>
          </Suspense>
        </div>
      </section>

      {/* APPLICATIONS */}
      <section className="py-16 md:py-20 px-6 bg-[var(--color-bg-secondary)]/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 md:mb-16">
            Popular Uses for Custom Embroidered Patches USA
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              'Custom Police & Fire Uniforms USA',
              'Custom Military & Morale Patches USA',
              'Custom Logo Patches for Sports Teams USA',
              'Embroidered Name Patches for Corporate Branding USA',
              'Custom Motorcycle Patches & Biker Vests USA',
              'Custom Morale Patches for Scouts & Schools USA',
              'Custom Iron On Patches for Events & Festivals USA',
              'Custom Velcro Patches for Personalized Apparel USA',
            ].map((use,i)=>(
              <motion.div key={i} whileHover={{scale:1.03}} className="glass p-6 md:p-8 rounded-3xl text-center font-medium text-base md:text-lg">{use}</motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 md:mb-16">
            Frequently Asked Questions
          </h2>
          <div className="space-y-8 md:space-y-10">
            {[
              {q:'What is the minimum order?', a:'No minimum – order 1 or 1000+.'},
              {q:'Production & shipping?', a:'7–14 business days standard, rush 3–5 days.'},
              {q:'Accepted file formats?', a:'AI, EPS, PDF preferred; high-res PNG/JPG accepted.'},
              {q:'Digital proofs?', a:'Yes – free digital stitch proof in 24–48 hrs with unlimited revisions.'},
              {q:'Backing options?', a:'Sew-on, iron-on, Velcro, adhesive.'},
              {q:'Durability?', a:'5–10+ years – fade-resistant, machine washable.'},
            ].map((faq,i)=>(
              <div key={i} className="glass p-6 md:p-8 rounded-3xl">
                <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-[var(--color-accent)]">{faq.q}</h3>
                <p className="text-[var(--color-text-secondary)] leading-relaxed text-sm md:text-base">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 md:py-20 px-6 text-center bg-gradient-to-t from-[var(--color-accent-dark)]/20 to-transparent">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8">
            Ready for Your Custom Embroidered Patches USA?
          </h2>
          <p className="text-lg md:text-xl mb-8 md:mb-10 text-[var(--color-text-secondary)]">
            No minimum order • Premium USA quality • Fast shipping • Free embroidery digitizing on bulk orders
          </p>
          <motion.div whileHover={{scale:1.08}} whileTap={{scale:0.96}}>
            <Link href="/quote" className="btn-primary text-xl md:text-2xl px-12 md:px-16 py-5 md:py-7 shadow-2xl inline-block">
              Get Free Quote Now
            </Link>
          </motion.div>
          <p className="mt-8 text-[var(--color-text-secondary)] text-base md:text-lg">
            Trusted nationwide – from Texas to New York for custom patches USA.
          </p>
        </div>
      </section>
    </main>
  );
}