/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimisation des images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },

  // Headers de sécurité
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
        ],
      },
    ];
  },

  // Redirections
  async redirects() {
    return [
      // Redirection favicon.ico vers icon.svg (évite les 404)
      {
        source: "/favicon.ico",
        destination: "/icon.svg",
        permanent: true,
      },
      {
        source: "/login",
        destination: "/connexion",
        permanent: true,
      },
      {
        source: "/register",
        destination: "/inscription",
        permanent: true,
      },
      {
        source: "/signup",
        destination: "/inscription",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
