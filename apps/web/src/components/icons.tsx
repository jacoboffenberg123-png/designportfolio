/** Shared by the dimmer slider and the phone toggle, so they can't drift apart. */

export function Sun({ size = 15 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      style={{ width: size, height: size }}
    >
      <circle cx="8" cy="8" r="3.1" />
      <path d="M8 1.4v1.6M8 13v1.6M14.6 8H13M3 8H1.4M12.7 3.3l-1.1 1.1M4.4 11.6l-1.1 1.1M12.7 12.7l-1.1-1.1M4.4 4.4L3.3 3.3" />
    </svg>
  );
}

export function Moon({ size = 15 }: { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" style={{ width: size, height: size }}>
      <path d="M13.4 9.9A5.9 5.9 0 0 1 6.1 2.6a.5.5 0 0 0-.7-.6 6.6 6.6 0 1 0 8.6 8.6.5.5 0 0 0-.6-.7Z" />
    </svg>
  );
}
