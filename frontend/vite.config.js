import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  resolve: {
    alias: {
      'd3-format': path.resolve(__dirname, 'node_modules/d3-format/dist/d3-format.js'),
      'd3-scale': path.resolve(__dirname, 'node_modules/d3-scale/dist/d3-scale.js'),
      'd3-interpolate': path.resolve(__dirname, 'node_modules/d3-interpolate/dist/d3-interpolate.js'),
      'd3-path': path.resolve(__dirname, 'node_modules/d3-path/dist/d3-path.js'),
      'd3-time': path.resolve(__dirname, 'node_modules/d3-time/dist/d3-time.js'),
      'd3-shape': path.resolve(__dirname, 'node_modules/d3-shape/dist/d3-shape.js'),
      'd3-color': path.resolve(__dirname, 'node_modules/d3-color/dist/d3-color.js'),
      'd3-array': path.resolve(__dirname, 'node_modules/d3-array/dist/d3-array.js'),
    }
  }
});