// src/app/custom-embroidered-patches-usa/layout.jsx
// This is a Server Component (no 'use client' needed)

import { Metadata } from 'next';  // still import Metadata (it's just a type helper, but we keep it for clarity)

export const metadata = {
  metadataBase: new URL('https://northernpatches.com'),
  title: 'Custom Embroidered Patches USA | No Minimum Order - Northern Patches',
  description:
    'Premium custom embroidered patches USA - no minimum order, fast production 7-14 days, durable rayon threads, free digitizing on 50+, Velcro/iron-on/3D puff options. Perfect for custom morale patches, custom name patches, custom logo patches, custom iron on patches, custom velcro patches, embroidered name patches, custom motorcycle patches, custom police patches, custom military patches.',
  keywords:
    'custom embroidered patches USA, embroidered patches no minimum, custom embroidery patches USA, embroidered morale patches, patches for jackets USA, custom patches fast shipping, custom patches, embroidered patches, custom iron on patches, custom velcro patches, custom morale patches, custom name patches, custom logo patches, embroidered name patches, custom motorcycle patches, custom police patches, custom military patches, cheap custom patches, custom patches near me, embroidered patches USA, custom embroidery digitizing',
  // You can add more fields later, e.g.:
  // openGraph: { ... },
  // twitter: { ... },
};

export default function EmbroideredPatchesLayout({ children }) {
  return <>{children}</>; // minimal wrapper – adds no extra DOM elements
}