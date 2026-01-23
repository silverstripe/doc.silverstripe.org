/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, waitFor, act } from '@testing-library/react';
import { Header } from '@/components/Header';

// Mock Next.js modules
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock('next/navigation', () => ({
  usePathname: () => '/en/6/',
}));

// Mock components
jest.mock('@/components/SearchBox', () => ({
  SearchBox: () => <div data-testid="search-box">SearchBox</div>,
}));

jest.mock('@/components/VersionSwitcher', () => ({
  VersionSwitcher: () => <div data-testid="version-switcher">VersionSwitcher</div>,
}));

jest.mock('@/components/HamburgerButton', () => ({
  HamburgerButton: ({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) => (
    <button data-testid="hamburger-button" onClick={onClick}>
      {isOpen ? 'Open' : 'Closed'}
    </button>
  ),
}));

jest.mock('@/components/DarkModeToggle', () => ({
  DarkModeToggle: () => <div data-testid="dark-mode-toggle">DarkModeToggle</div>,
}));

describe('Header Reorganization', () => {
  const originalInnerWidth = window.innerWidth;

  beforeEach(() => {
    // Reset window.innerWidth before each test
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  afterEach(() => {
    // Restore original innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  it('should move hamburger out of nav on mobile width', () => {
    // Set mobile width (below 768px breakpoint)
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 600,
    });

    const { container } = render(<Header docsContext="docs" />);

    const hamburger = container.querySelector('[data-testid="hamburger-button"]')?.parentElement;
    const nav = container.querySelector('nav');
    const headerContent = container.querySelector('[class*="headerContent"]');

    expect(hamburger).toBeTruthy();
    expect(nav).toBeTruthy();
    expect(headerContent).toBeTruthy();

    // Hamburger should be a direct child of headerContent on mobile
    expect(hamburger?.parentElement).toBe(headerContent);
  });

  it('should keep hamburger inside nav on desktop width', () => {
    // Set desktop width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    });

    const { container } = render(<Header docsContext="docs" />);

    const hamburger = container.querySelector('[data-testid="hamburger-button"]')?.parentElement;
    const nav = container.querySelector('nav');

    expect(hamburger).toBeTruthy();
    expect(nav).toBeTruthy();

    // Hamburger should be inside nav on desktop
    expect(hamburger?.parentElement).toBe(nav);
  });

  it('should move hamburger back to nav when resizing from mobile to desktop', async () => {
    // Start with mobile width (below 768px)
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 600,
    });

    const { container } = render(<Header docsContext="docs" />);

    let hamburger = container.querySelector('[data-testid="hamburger-button"]')?.parentElement;
    const nav = container.querySelector('nav');
    const headerContent = container.querySelector('[class*="headerContent"]');

    // Initially on mobile, hamburger is direct child of headerContent
    expect(hamburger?.parentElement).toBe(headerContent);

    // Resize to desktop (above 768px)
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 900,
    });

    // Trigger resize event
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    // Wait for re-render
    await waitFor(() => {
      // Re-query hamburger after resize
      hamburger = container.querySelector('[data-testid="hamburger-button"]')?.parentElement;
      // After resize to desktop, hamburger should be back in nav
      expect(hamburger?.parentElement).toBe(nav);
    });
  });

  it('should move hamburger out of nav when resizing from desktop to mobile', async () => {
    // Start with desktop width (above 768px)
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 900,
    });

    const { container } = render(<Header docsContext="docs" />);

    let hamburger = container.querySelector('[data-testid="hamburger-button"]')?.parentElement;
    const nav = container.querySelector('nav');
    const headerContent = container.querySelector('[class*="headerContent"]');

    // Initially on desktop, hamburger is inside nav
    expect(hamburger?.parentElement).toBe(nav);

    // Resize to mobile (below 768px)
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 600,
    });

    // Trigger resize event
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    // Wait for re-render
    await waitFor(() => {
      // Re-query hamburger after resize
      hamburger = container.querySelector('[data-testid="hamburger-button"]')?.parentElement;
      // After resize to mobile, hamburger should be direct child of headerContent
      expect(hamburger?.parentElement).toBe(headerContent);
    });
  });

  it('should handle multiple resize events correctly', async () => {
    const { container } = render(<Header docsContext="docs" />);

    const nav = container.querySelector('nav');
    const headerContent = container.querySelector('[class*="headerContent"]');

    // Start desktop (above 768px)
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 900,
    });
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    await waitFor(() => {
      const hamburger = container.querySelector('[data-testid="hamburger-button"]')?.parentElement;
      expect(hamburger?.parentElement).toBe(nav);
    });

    // Go mobile (below 768px)
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 600,
    });
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    await waitFor(() => {
      const hamburger = container.querySelector('[data-testid="hamburger-button"]')?.parentElement;
      expect(hamburger?.parentElement).toBe(headerContent);
    });

    // Go desktop again (above 768px)
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 900,
    });
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    await waitFor(() => {
      const hamburger = container.querySelector('[data-testid="hamburger-button"]')?.parentElement;
      expect(hamburger?.parentElement).toBe(nav);
    });
  });
});
