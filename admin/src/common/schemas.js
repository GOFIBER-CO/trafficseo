export const SchemaPattern = (name, url, content, image) =>
  // eslint-disable-next-line no-unused-expressions
  `"@context": "https://schema.org",
   "@type": "NewsArticle",
   "url": "http://www.bbc.com/news/world-us-canada-39324587",
   "publisher":{
      "@type":"Organization",
      "name":"BBC News",
      "logo":"http://www.bbc.co.uk/news/special/2015/newsspec_10857/bbc_news_logo.png?cb=1"
   },
   "headline": "${name}",
   "mainEntityOfPage": "${url}",
   "articleBody": "${content}",
   "image":[
      "${image}"
   ],
   "datePublished":"2017-03-20T20:30:54+00:00"
`;

export const SchemaPatternOrganization =
  () => `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Quận Tân Phú",
    "postalCode": "700000",
    "streetAddress": "23/80/42A Nguyễn Hữu Tiến, Phường Tây Thạnh"
  },
  "email": "info@baovietnam.com",
  "faxNumber": "",
  "member": [
    {
      "@type": "Organization"
    },
    {
      "@type": "Organization"
    }
  ],
  "name": "Google.org (GOOG)",
  "telephone": "(+84)934917477"
}
</script>`;
