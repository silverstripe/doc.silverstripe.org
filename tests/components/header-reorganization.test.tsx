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

  it('should place hamburger in headerLeft on mobile width', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 600,
    });

    const { container } = render(<Header docsContext="docs" />);

    const hamburgerBtn = container.querySelector('[data-testid="hamburger-button"]');
    const headerLeft = container.querySelector('[class*="headerLeft"]');

    expect(hamburgerBtn).toBeTruthy();
    expect(headerLeft).toBeTruthy();
    expect(hamburgerBtn?.parentElement).toBe(headerLeft);
  });

  it('should place hamburger in headerRight on desktop width', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    });

    const { container } = render(<Header docsContext="docs" />);

    const hamburgerBtn = container.querySelector('[data-testid="hamburger-button"]');
    const headerRight = container.querySelector('[class*="headerRight"]');

    expect(hamburgerBtn).toBeTruthy();
    expect(headerRight).toBeTruthy();
    expect(hamburgerBtn?.parentElement).toBe(headerRight);
  });

    // Start with mobile width (below 768px)
  it('should move hamburger to headerRight when resizing from mobile to desktop', async () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 600,
    });

    const { container } = render(<Header docsContext="docs" />);

    const headerLeft = container.querySelector('[class*="headerLeft"]');
    const headerRight = container.querySelector('[class*="headerRight"]');

    // Initially on mobile, hamburger is in headerLeft
    expect(container.querySelector('[data-testid="hamburger-button"]')?.parentElement).toBe(headerLeft);

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
      // After resize to desktop, hamburger should be back in nav
      expect(container.querySelector('[data-testid="hamburger-button"]')?.parentElement).toBe(headerRight);
    });
  });

    // Start with desktop width (above 768px)
  it('should move hamburger to headerLeft when resizing from desktop to mobile', async () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 900,
    });

    const { container } = render(<Header docsContext="docs" />);

    const headerLeft = container.querySelector('[class*="headerLeft"]');
    const headerRight = container.querySelector('[class*="headerRight"]');

    // Initially on desktop, hamburger is in headerRight
    expect(container.querySelector('[data-testid="hamburger-button"]')?.parentElement).toBe(headerRight);

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
      // After resize to mobile, hamburger should be direct child of headerContent
      expect(container.querySelector('[data-testid="hamburger-button"]')?.parentElement).toBe(headerLeft);
    });
  });

  it('should handle multiple resize events correctly', async () => {
    const { container } = render(<Header docsContext="docs" />);

    const headerLeft = container.querySelector('[class*="headerLeft"]');
    const headerRight = container.querySelector('[class*="headerRight"]');

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
      expect(container.querySelector('[data-testid="hamburger-button"]')?.parentElement).toBe(headerRight);
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
      expect(container.querySelector('[data-testid="hamburger-button"]')?.parentElement).toBe(headerLeft);
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
      expect(container.querySelector('[data-testid="hamburger-button"]')?.parentElement).toBe(headerRight);
    });
  });
});
