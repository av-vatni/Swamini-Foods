type P = { className?: string };

export const PhoneIcon = ({ className = "size-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z" />
  </svg>
);

export const DownloadIcon = ({ className = "size-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M12 3a1 1 0 0 1 1 1v9.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-5 5a1 1 0 0 1-1.4 0l-5-5a1 1 0 1 1 1.4-1.4L11 13.6V4a1 1 0 0 1 1-1zM5 19h14a1 1 0 1 1 0 2H5a1 1 0 1 1 0-2z" />
  </svg>
);

export const PinIcon = ({ className = "size-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
  </svg>
);

export const WalletIcon = ({ className = "size-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M4 6a3 3 0 0 1 3-3h11a1 1 0 1 1 0 2H7a1 1 0 0 0 0 2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H7a3 3 0 0 1-3-3V6zm13 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
  </svg>
);

export const GheeIcon = ({ className = "size-7" }: P) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" className={className}>
    <path d="M9 11h14l-1.5 15a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2z" />
    <path d="M8 11h16M12 7h8l1 4H11z" />
    <path d="M12 19c2-1.5 6-1.5 8 0" />
  </svg>
);

export const HomeHeartIcon = ({ className = "size-7" }: P) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true" className={className}>
    <path d="M4 15 16 5l12 10M7 13v14h18V13" />
    <path d="M16 23s-4-2.5-4-5a2 2 0 0 1 4-.5 2 2 0 0 1 4 .5c0 2.5-4 5-4 5z" />
  </svg>
);

export const FreshIcon = ({ className = "size-7" }: P) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" className={className}>
    <path d="M5 21h22M7 21a9 9 0 0 1 18 0M16 12V9" />
    <path d="M11 6c0 1 1 1 1 2s-1 1-1 2M16 4c0 1 1 1 1 2s-1 1-1 2M21 6c0 1 1 1 1 2s-1 1-1 2" />
    <path d="M4 25h24" />
  </svg>
);
