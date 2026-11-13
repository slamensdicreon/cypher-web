/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  // The admin's pitch deck download reads this file at runtime; make sure it ships with the function.
  outputFileTracingIncludes: { '/api/admin/deck': ['./assets/deck/**'] },
  // The campaign assets moved into the admin shell; old links (and bookmarks) follow them.
  async redirects() {
    return [
      { source: '/postcards', destination: '/admin/assets/postcards', permanent: false },
      { source: '/postcards/trading', destination: '/admin/assets/trading', permanent: false },
      { source: '/postcards/social', destination: '/admin/assets/social-ads', permanent: false },
      { source: '/postcards/social/img/:file', destination: '/admin/assets/social-ads/img/:file', permanent: false },
      { source: '/postcards/social/cypher-social-ads.zip', destination: '/admin/assets/social-ads/cypher-social-ads.zip', permanent: false },
      { source: '/postcards/print/:file', destination: '/admin/assets/files/print/:file', permanent: false },
    ];
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};

export default nextConfig;
