# Premium DNS v2 — NuSec Design

Interactive design prototype for the Premium DNS management interface (v2), built for the WebPro panel with NuSec branding.

## Live Preview

Hosted on GitHub Pages: [View Design](https://YOUR_GITHUB_USERNAME.github.io/premium-dns-v2/)

## Files

| File | Description |
|------|-------------|
| `index.html` | Main HTML prototype — full WebPro panel page with Premium DNS section |
| `modal.jsx` | React component for the "Manage Premium DNS" modal (DNS Records + DNSSEC tabs) |
| `modal.css` | Styles for the modal, scoped under `#premium-dns-modal-root` |

## Features

- **DNS Records tab** — view, search, filter, add, edit, and delete DNS records (A, AAAA, MX, CNAME, NS, TXT, SRV, SOA)
- **DNSSEC Settings tab** — toggle DNSSEC signing on/off, view DS records and DNS keys (KSK/ZSK)
- Anycast network status indicator
- Inline edit forms with per-record-type field schemas
- TTL display with human-readable labels

## How to Run Locally

Open `index.html` directly in a browser — no build step required. The modal is rendered via React loaded from CDN.

## GitHub Pages Setup

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Set **Source** to `Deploy from a branch` → branch `main`, folder `/ (root)`
4. Save — your site will be live at `https://YOUR_GITHUB_USERNAME.github.io/premium-dns-v2/`
