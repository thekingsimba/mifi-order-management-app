import react from '@vitejs/plugin-react';
import dns from 'dns';
import * as nodeProcess from 'node:process';
import { defineConfig } from 'vite';

import { config } from './src/config';

const resetFileGeneratorApiUrl = (isProduction) => {
  return !isProduction ? 'http://localhost:8082' : 'https://uat-bss.mtn.com.ng';
};

dns.setDefaultResultOrder('verbatim');
export default defineConfig(({ command }) => {
  const isProduction = command === 'build';
  return {
    base: config.basePath,
    mode: isProduction ? 'production' : 'development',
    loader: { '.js': 'jsx' },
    plugins: [react()],
    optimizeDeps: {
      include: ['@emotion/styled'],
    },
    define: {
      process: nodeProcess,
    },
    build: {
      sourcemap: false,
      commonjsOptions: {
        include: [/linked-dep/, /node_modules/],
      },
      rollupOptions: {
        output: {
          manualChunks: {
            lodash: ['lodash'],
          },
        },
      },
    },
    server: {
      host: 'localhost',
      open: true,
      port: 3100,
      headers: {
        'Strict-Transport-Security': 'max-age=86400; includeSubDomains', // Adds HSTS options to your website, with a expiry time of 1 day
        'X-Content-Type-Options': 'nosniff', // Protects from improper scripts runnings
        'X-Frame-Options': 'DENY', // Stops your site being used as an iframe
        'X-XSS-Protection': '1; mode=block', // Gives XSS protection to legacy browsers
        'Content-Security-Policy':
          'upgrade-insecure-requests; frame-ancestors' + " 'self'",
      },
      // proxy: {
      //   '/api': {
      //     target: `${resetFileGeneratorApiUrl(isProduction)}/sim-file-gen/`,
      //     changeOrigin: true,
      //     secure: false,
      //     rewrite: (path) => path.replace(/^\/api/, ''),
      //   },
      // },
    },
    resolve: {
      alias: {
        src: '/src',
      },
    },
  };
});
