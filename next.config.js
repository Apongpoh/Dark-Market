/** @type {import('next').NextConfig} */
const { createSecureHeaders } = require('next-secure-headers');

module.exports = nextConfig = {
  reactStrictMode: true,
}

module.exports = {
  env: {
    DATABASE: 'mongodb+srv://tierramarkt:East&West&North&South.3210@cluster0.uvswxyj.mongodb.net/?retryWrites=true&w=majority',
    JWT_SECRET: 'qwertyuiop'
  },
  async headers() {
    return [{ source: "/(.*)", headers: createSecureHeaders() }];
  },
}

// database
// google username: Tierra Markt
// login: tierramarkt@gmail.com
// password: East&West&North&South.3210