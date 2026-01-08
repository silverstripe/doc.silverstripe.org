/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  experimental: {
    // Limits the number CPUs/workers used for the build process
    // so that local computer can still do other things while building
    cpus: 2,
  }
};

export default nextConfig;
