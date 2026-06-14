import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  twitterHandle?: string;
  schemaItems?: any[];
  breadcrumbItems?: { name: string; item: string }[];
}

export default function SEO({
  title = "All Bangla News Feed | All Bangladeshi Newspapers & Live TV",
  description = "Access the most comprehensive list of 500+ Bangla newspapers, online portals, live TV channels, weather news, and job sites in Bangladesh. Your ultimate news directory.",
  keywords = "bangla news, weather news bangladesh, dhaka weather forecast, Bangladeshi news, All bangla news paper, Latest news bd, Bd news, Bd all news, Bd latest news, List of all bd news, List of all bangla news papers, all bangla newspaper, bangladesh newspaper list, bangla news directory, bd news live, online bangla news, সব অনলাইন বাংলা সংবাদপত্র, bd news 24, prothom alo, daily star, bangla news portal",
  canonical = "https://allbanglanewsfeed.netlify.app",
  ogType = "website",
  ogImage = "https://allbanglanewsfeed.netlify.app/og-image.jpg",
  twitterHandle = "@BanglaNewsHub",
  schemaItems,
  breadcrumbItems
}: SEOProps) {
  const siteTitle = title.includes("All Bangla News Feed") 
    ? title 
    : `${title} | All Bangla News Feed`;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{siteTitle}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph tags */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content="All Bangla News Feed" />

      {/* Twitter tags */}
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "All Bangla News Feed",
          "alternateName": "BanglaNewsHub",
          "url": "https://allbanglanewsfeed.netlify.app",
          "description": description,
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://allbanglanewsfeed.netlify.app/?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}
      </script>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "All Bangla News Feed",
          "url": "https://allbanglanewsfeed.netlify.app",
          "logo": "https://allbanglanewsfeed.netlify.app/logo.png",
          "sameAs": [
            "https://facebook.com/banglanewshub",
            "https://twitter.com/banglanewshub"
          ]
        })}
      </script>

      {breadcrumbItems && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbItems.map((item, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": item.name,
              "item": item.item
            }))
          })}
        </script>
      )}

      {schemaItems && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": title,
            "description": description,
            "url": canonical,
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": schemaItems.map((item, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "url": item.url,
                "name": item.name
              }))
            }
          })}
        </script>
      )}
    </Helmet>
  );
}
