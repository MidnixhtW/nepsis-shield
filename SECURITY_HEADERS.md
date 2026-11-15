# Security headers

The app handles private local notes, so every web deployment should apply the same browser security headers. `vercel.json` configures them for Vercel, and `public/_headers` provides the equivalent format for hosts such as Netlify and Cloudflare Pages. Edit `public/_headers` and `vercel.json` together.

Required headers:

- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `Referrer-Policy: no-referrer`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Resource-Policy: same-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()`
- `Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; img-src 'self' data: https://commons.wikimedia.org https://upload.wikimedia.org https://thumb.wikimedia.org; connect-src 'self' https://commons.wikimedia.org https://orthocal.info https://bible-api.com https://bolls.life https://api.github.com; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; worker-src 'self'; manifest-src 'self'; upgrade-insecure-requests`

GitHub Pages does not support custom response headers. If deploying there, place it behind a provider/CDN that can add these headers, or accept that CSP/frame protection will be weaker on that host.

For Capacitor Android, response headers do not protect the packaged WebView in the same way. Keep avoiding dynamic HTML injection and review Android WebView hardening when changing native configuration.
