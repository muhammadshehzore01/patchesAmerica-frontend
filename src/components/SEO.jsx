import Head from 'next/head'

export default function SEO({ title, description, image, url }) {
  const site = 'https://yourbrand.au'
  return (
    <Head>
      <title>{title ? `${title} | YourBrand AU` : 'YourBrand United States Of America'}</title>
      <meta name="description" content={description || 'Ultra-premium United States Of American product site'} />
      <meta property="og:title" content={title || 'YourBrand United States Of America'} />
      <meta property="og:description" content={description || 'Ultra-premium United States Of American product site'} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url || site} />
      <meta property="og:image" content={image || `${site}/usa-flag.jpg`} />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  )
}
