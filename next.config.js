// @ts-check

const withNextIntl = require("next-intl/plugin")();

/** @type {import('next').NextConfig} */
const config = { reactStrictMode: false };

module.exports = withNextIntl(config);
