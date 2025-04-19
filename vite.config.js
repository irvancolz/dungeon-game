import { defineConfig } from "vite";
import restart from "vite-plugin-restart";
import glsl from "vite-plugin-glsl";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
  plugins: [
    glsl(),
    restart({ restart: ["../static/**"] }),
    wasm(),
    topLevelAwait(),
  ],
});
