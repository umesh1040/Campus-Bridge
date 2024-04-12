/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
};

module.exports = nextConfig;

module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Add a rule to handle PDF files
    config.module.rules.push({
      test: /\.(pdf)$/,
      use: [
        {
          loader: isServer ? "file-loader" : "url-loader",
          options: {
            name: "[name].[ext]",
            publicPath: `/_next/static/files`, // Adjust the public path as needed
            outputPath: `${isServer ? "../" : ""}static/files`, // Adjust the output path as needed
          },
        },
      ],
    });

    return config;
  },
};
