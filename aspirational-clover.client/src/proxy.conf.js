const { env } = require('process');

const target = env["services__aspirational-clover-server__https__0"] ?? 'https://localhost:7203';

const PROXY_CONFIG = [
  {
    context: [
      "/document",
    ],
    target,
    secure: false
  }
]

module.exports = PROXY_CONFIG;
