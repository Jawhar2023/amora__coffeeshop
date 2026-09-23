export function FacebookIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 22v-8.5H16l.5-3.5h-3V7.8c0-1 .3-1.8 1.8-1.8H16.6V3c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.4v3.5h2.5V22h3.6z" />
    </svg>
  );
}

export function InstagramIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TikTokIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M14.5 3h3.1c.2 1.8 1.2 3.2 2.9 4v3.2c-1.1-.1-2.2-.5-3.1-1.1v6.4c0 3.7-2.6 5.5-5.4 5.5-2.6 0-5-1.7-5-4.7 0-3.2 2.7-5.1 5.7-4.8v3.2c-1.3-.2-2.4.4-2.4 1.6 0 .9.7 1.6 1.7 1.6 1.2 0 2.5-.8 2.5-2.7V3Z" />
    </svg>
  );
}
