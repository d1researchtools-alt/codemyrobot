/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keystatic's admin UI and its API routes need a Node runtime, so we can't use
  // `output: 'export'`. Every content page is still statically prerendered.
  reactStrictMode: true,
}

export default nextConfig
