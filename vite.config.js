import { defineConfig } from "vite";
import restart from "vite-plugin-restart";
import glsl from "vite-plugin-glsl";

export default defineConfig({
  plugins: [glsl(), restart({ restart: ["../static/**"] })],
});
