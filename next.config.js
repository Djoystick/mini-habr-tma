/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/core/i18n/i18n.ts');

const nextConfig = {};

module.exports = withNextIntl(nextConfig);
