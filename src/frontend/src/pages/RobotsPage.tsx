import { useEffect } from 'react';

export default function RobotsPage() {
  useEffect(() => {
    const baseUrl = window.location.origin;

    const robotsTxt = `# Robots.txt for Sumit Photo and Videography
User-agent: *
Allow: /
Allow: /photos
Allow: /special-moments
Allow: /business-info
Disallow: /admin
Disallow: /videos
Disallow: /events

Sitemap: ${baseUrl}/sitemap.xml`;

    // Display robots.txt content
    const pre = document.createElement('pre');
    pre.textContent = robotsTxt;
    pre.style.cssText = 'padding: 20px; background: #f5f5f5; overflow: auto; font-family: monospace; white-space: pre-wrap;';
    document.body.innerHTML = '';
    document.body.appendChild(pre);
  }, []);

  return null;
}
