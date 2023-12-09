import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import path from 'path'

export default defineConfig({
  plugins: [solid()],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
      { find: '@molecules', replacement: path.resolve(__dirname, 'src') },
      { find: '@atoms', replacement: path.resolve(__dirname, 'src') },
      { find: '@organisms', replacement: path.resolve(__dirname, 'src') },
      { find: '@utils', replacement: path.resolve(__dirname, 'src') },
    ],
  },
})
