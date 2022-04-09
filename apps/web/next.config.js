const withWorkspaces = require('@saas-ui/next-workspaces')
const withSvgr = require('next-svgr')

/** @type {import('next').NextConfig} */
const nextConfig = withWorkspaces({
  workspaces: ['packages'],
  basePath: '../..'
})(
  withSvgr({
    swcMinify: false,
    experimental: {
      optimizeFonts: true,
      modern: true
    },
    reactStrictMode: true,
    i18n: {
      locales: ['en'],
      localeDetection: true,
      defaultLocale: 'en'
    },
    webpackDevMiddleware: config => {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300
      }
      return config
    },
    webpack: (config, {defaultLoaders}) => {
      config.module.rules.push({
        test: /node_modules\/@saas-ui\/(pro|charts|billing|features|onboarding)\/.*\.tsx?/,
        use: [defaultLoaders.babel]
      })
      return config
    }
  })
)

module.exports = nextConfig
