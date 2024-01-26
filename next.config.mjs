/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      { // required by WebContainer 
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp'
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin'
          },
        ]
      }
    ]
  }
};

export default nextConfig;
