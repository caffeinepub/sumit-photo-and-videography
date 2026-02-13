import { useEffect } from 'react';

export default function SitemapPage() {
  useEffect(() => {
    const baseUrl = window.location.origin;
    const currentDate = new Date().toISOString().split('T')[0];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/photos</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/special-moments</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/business-info</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;

    // Set content type and display XML
    const blob = new Blob([sitemap], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    
    // Download or display the sitemap
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sitemap.xml';
    document.body.appendChild(link);
    
    // Display XML in the page
    const pre = document.createElement('pre');
    pre.textContent = sitemap;
    pre.style.cssText = 'padding: 20px; background: #f5f5f5; overflow: auto; font-family: monospace;';
    document.body.innerHTML = '';
    document.body.appendChild(pre);
    
    return () => {
      URL.revokeObjectURL(url);
    };
  }, []);

  return null;
}
