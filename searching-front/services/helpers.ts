export const getTonProxy = () => ({
    host: process.env.TON_PROXY_DOMAIN || "in3.ton.org",
    port: 8080,
  })