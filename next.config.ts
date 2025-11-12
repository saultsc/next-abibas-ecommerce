import type { NextConfig } from 'next';
import { resolve } from 'path';

const nextConfig: NextConfig = {
	/* config options here */
	turbopack: {
		root: resolve(__dirname),
	},
	allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
};

export default nextConfig;
