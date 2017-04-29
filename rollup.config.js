import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'

var minify = process.env.NODE_ENV === 'release'

export default {
  entry: 'index.js',
  format: 'umd',
  moduleName: 'YoxStore',
  plugins: [
    babel({
      presets: [ 'es2015-rollup' ],
      babelrc: false,
      comments: false,
      runtimeHelpers: true
    }),
    (minify && uglify()),
  ],
  dest: minify ? 'dist/yox-store.min.js' : 'dist/yox-store.js'
}
