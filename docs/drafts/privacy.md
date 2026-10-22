# Pixelito Privacy Notice — DRAFT

- **Status:** Draft for the beta. Not legal advice. Review required before donations or paid features.
- **Date:** 2026-10-22
- **Rule:** this draft only states things the design intends. Every statement marked *to verify* must be confirmed against the real implementation before publishing.

## In short

We keep very little data. Your game files never leave your browser. We do not use ad trackers.

## What we collect

| Data | Why | When |
|---|---|---|
| Sign-in identity (email or provider ID from Google, Discord or GitHub) | To let you sign in | Only if you create an account |
| Username and avatar (chosen from presets) | To show your profile | Only if you create an account |
| Progress (play time, titles played, achievements) | For your profile and platform achievements | Signed-in users |
| Anonymous guest ID | To keep a guest profile working | Guest mode (*to verify*) |
| Bot-check result (Cloudflare Turnstile) | To stop abuse of guest sign-in | Guest mode (*to verify*) |
| Cookie-less usage statistics | To know what works | All visitors; tool *to verify* |

## What we do NOT collect

- Your `.jar` files. They stay in your browser.
- Your saves, unless a cloud-saves feature is added later and you turn it on.
- Advertising or cross-site tracking data. We use no third-party trackers.

## Where data lives

- **In your browser:** game files you open, local saves, settings. Only you can clear them.
- **On our servers:** account, profile, progress. Provider not final; the list of processors will be published here (*to verify*). Email is sent through a transactional email service (*to verify*).
- The emulator runs on a separate origin that holds no account data or tokens.

## How long we keep it

- Account data: until you delete your account.
- Abandoned guest profiles: removed by a scheduled cleanup (period *to verify*).

## Your rights

You can see and export your account data, correct it, and delete your account (*to verify: these features exist before launch*). Write to `[CONTACT]` for anything the app does not cover. Costa Rica's Law 8968 and, for EU visitors, the GDPR may give you additional rights; legal review pending.

## Children

Pixelito is for people aged 16 or older.

## Changes

We will tell you in the app before important changes apply.

## Open points for the lawyer

1. Duties under Costa Rica Ley 8968, including any database registration (ADR 0001, unverified item 7).
2. GDPR role and legal basis, and international transfers, once the backend vendor is chosen.
3. Cookie-less statistics: confirm no consent is needed with the chosen tool.
4. Retention periods.
