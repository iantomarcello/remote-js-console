import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/server.js',
  output: [
    { file: 'js/cjs/server.js', format: 'cjs', plugins: [terser()]},
    { file: 'js/esm/server.js', format: 'es', plugins: [terser()] },
  ],
};
