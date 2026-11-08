export function securityHeaders(apiUrl) {
  const api = new URL(apiUrl)
  if (
    !['http:', 'https:'].includes(api.protocol) ||
    api.username ||
    api.password
  ) {
    throw new Error('VITE_API_URL deve ser uma URL HTTP(S) sem credenciais')
  }
  return {
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self'",
      // Recharts and Radix use inline styles; scripts remain limited to local assets.
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      `connect-src 'self' ${api.origin}`,
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join('; '),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000',
  }
}

export function securityPolicyPlugin(apiUrl) {
  const headers = securityHeaders(apiUrl)
  return {
    name: 'security-policy',
    apply: (_config, { command, isPreview }) =>
      command === 'build' || isPreview,
    transformIndexHtml() {
      return [
        {
          tag: 'meta',
          attrs: {
            'http-equiv': 'Content-Security-Policy',
            // frame-ancestors is supported only as an HTTP response header.
            content: headers['Content-Security-Policy'].replace(
              "; frame-ancestors 'none'",
              '',
            ),
          },
          injectTo: 'head-prepend',
        },
      ]
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: '_headers',
        source: `/*\n${Object.entries(headers)
          .map(([name, value]) => `  ${name}: ${value}`)
          .join('\n')}\n`,
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use((_request, response, next) => {
        Object.entries(headers).forEach(([name, value]) =>
          response.setHeader(name, value),
        )
        next()
      })
    },
  }
}
