// src/lib/contentGenerator.js
import Link from "next/link";

/**
 * Generate page content for state or city pages
 */
export function generateContent({ name, type, stateName, services, allLocations }) {
  const safeName = name || "Unknown";
  const safeState = stateName || safeName;
  const locationText = type === "city" ? `${safeName}, ${safeState}` : safeName;

  // Intro
  const intro = `Looking for premium custom embroidered patches in ${locationText}? Northern Patches USA offers high-quality embroidered, PVC, chenille, woven, leather, and Velcro patches. Zero minimum order, fast USA shipping, free digital proofs, and multiple backing options. Perfect for schools, clubs, businesses, and personal projects.`;

  // Benefits
  const benefits = [
    `No minimum order in ${locationText}.`,
    `Fast production & shipping across ${safeState}.`,
    `Durable embroidery lasting 5–10+ years.`,
    `Free digitizing on orders of 50+ patches.`,
    `Multiple backing options – sew-on, iron-on, Velcro, adhesive.`,
    `Custom designs allowed – logos, morale patches, team patches.`,
  ];

  // Applications
  const applications = [
    `School & university patches in ${locationText}.`,
    `Corporate branding patches across ${locationText}.`,
    `Motorcycle & biker club patches in ${locationText}.`,
    `Event, festival, and personalized patches in ${locationText}.`,
    `Police, fire, and security uniform patches in ${locationText}.`,
  ];

  // FAQs
  const faqs = [
    { q: `Do you have a minimum order in ${locationText}?`, a: `No, Northern Patches offers custom patches with zero minimum order.` },
    { q: `How fast is shipping to ${locationText}?`, a: `Standard 7–14 business days; rush 3–5 days available.` },
    { q: `What patch types are available in ${locationText}?`, a: `Embroidered, PVC, chenille, woven, leather, Velcro, sublimation, iron-on.` },
    { q: `Can I order personalized patches for events in ${locationText}?`, a: `Yes – custom patches for clubs, teams, schools, and corporate events.` },
  ];

  // Hero slides
  const slides = [
    {
      image_url: "/slider1.jpg",
      title: `Custom Embroidered Patches in ${locationText}`,
      subtitle: `Embroidered, PVC, chenille, woven, leather, Velcro – made in USA.`,
      alt: `Custom patches ${locationText}`,
      cta_text: `Get Free Quote in ${locationText}`,
      badge_text: "No Minimum • Fast Shipping • Free Digitizing 50+",
    },
    {
      image_url: "/slider2.jpg",
      title: `Premium Morale & Team Patches for ${locationText}`,
      subtitle: `Perfect for schools, businesses, clubs, and organizations in ${locationText}.`,
      alt: `Morale & team patches ${locationText}`,
      cta_text: `Order Your Patches Today`,
      badge_text: "Rush Production 3–5 Days • Durable 5–10+ Years",
    },
  ];

  // Internal links
  const links = allLocations
    .filter((l) => l?.slug && l.slug.toLowerCase() !== name.toLowerCase())
    .map((l) => (
      <Link key={l.slug} href={l.url} className="underline text-accent">
        {l.name}
      </Link>
    ));

  return { intro, benefits, applications, faqs, slides, links };
}

/**
 * Generate JSON-LD for state or city pages
 */
export function generateJsonLd({ type, name, stateName, services, faqs }) {
  const locationText = type === "city" ? `${name}, ${stateName}` : name;

  const jsonLd = [
    // Organization
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Northern Patches USA",
      "url": "https://northernpatches.com",
      "logo": "https://northernpatches.com/logo.png",
      "sameAs": [
        "https://www.facebook.com/northernpatchesusa",
        "https://www.instagram.com/northernpatchesusa",
        "https://twitter.com/northernpatches"
      ]
    },
    // Services
    ...services.map((s, i) => ({
      "@context": "https://schema.org",
      "@type": "Service",
      "name": s?.title || s?.name || `Service ${i+1}`,
      "description": `${s?.meta_description || "Premium custom embroidered patches"} in ${locationText}.`,
      "url": `https://northernpatches.com/services/${s?.slug || i}/`,
      "provider": { "@type":"Organization","name":"Northern Patches USA","url":"https://northernpatches.com" },
      "areaServed": type === "city" ? { "@type":"City","name":name } : { "@type":"State","name":name },
      "serviceType": "Custom Embroidered Patches"
    })),
    // Breadcrumbs
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", position:1, name:"Home", item:"https://northernpatches.com" },
        { "@type": "ListItem", position:2, name:"Custom Embroidered Patches USA", item:"https://northernpatches.com/custom-embroidered-patches-usa/" },
        ...(type === "city" ? [
          { "@type":"ListItem", position:3, name:stateName, item:`https://northernpatches.com/custom-embroidered-patches-usa/${stateName.toLowerCase()}/` },
          { "@type":"ListItem", position:4, name:name, item:`https://northernpatches.com/custom-embroidered-patches-usa/${stateName.toLowerCase()}/${name.toLowerCase().replace(/\s+/g,"-")}/` }
        ] : [
          { "@type":"ListItem", position:3, name:name, item:`https://northernpatches.com/custom-embroidered-patches-usa/${name.toLowerCase()}/` }
        ])
      ]
    },
    // FAQ
    {
      "@context":"https://schema.org",
      "@type":"FAQPage",
      "mainEntity": faqs.map(f=>({
        "@type":"Question",
        "name": f.q,
        "acceptedAnswer": { "@type":"Answer", "text": f.a }
      }))
    },
    // LocalBusiness (rich snippet for local SEO)
    {
      "@context":"https://schema.org",
      "@type":"LocalBusiness",
      "name":"Northern Patches USA",
      "image":"https://northernpatches.com/logo.png",
      "priceRange":"$",
      "address":{
        "@type":"PostalAddress",
        "streetAddress":"1234 Patch Lane",
        "addressLocality": type === "city" ? name : "",
        "addressRegion": type === "city" ? stateName : name,
        "postalCode":"00000",
        "addressCountry":"USA"
      },
      "url":"https://northernpatches.com",
      "telephone":"+1-828-818-2142",
      "sameAs":[
        "https://www.facebook.com/northernpatches",
        "https://www.instagram.com/northernpatches",
        "https://twitter.com/northernpatches"
      ]
    }
  ];

  return jsonLd;
}