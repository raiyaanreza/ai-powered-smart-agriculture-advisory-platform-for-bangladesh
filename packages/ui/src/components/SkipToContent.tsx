"use client";

/**
 * SkipToContent - Accessibility component
 * Provides a visually hidden link that appears on focus,
 * allowing keyboard users to skip directly to main content.
 */
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#2D5A27] focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2"
    >
      Skip to main content
    </a>
  );
}
