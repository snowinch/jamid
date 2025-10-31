import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: {
    resolve: true,
  },
  sourcemap: true,
  external: ["react", "react-dom"],
  clean: true,
  treeshake: true,
  tsconfig: "./tsconfig.build.json",
});
