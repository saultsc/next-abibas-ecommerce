import type { NextConfig } from 'next';
import { resolve } from 'path';

const nextConfig: NextConfig = {
	/* config options here */
	turbopack: {
		root: resolve(__dirname),
	},
	allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.resolve.fallback = {
				...config.resolve.fallback,
				dgram: false,
				net: false,
				tls: false,
				fs: false,
				child_process: false,
			};
		}
		return config;
	},
};

export default nextConfig;
