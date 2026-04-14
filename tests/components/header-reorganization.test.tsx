/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render } from '@testing-library/react';
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
  it('should render hamburger as a direct child of header', () => {
    const { container } = render(<Header docsContext="docs" />);

    const hamburgerBtn = container.querySelector('[data-testid="hamburger-button"]');
    const header = container.querySelector('header');

    expect(hamburgerBtn).toBeTruthy();
    expect(header).toBeTruthy();
    expect(hamburgerBtn?.parentElement).toBe(header);
  });

  it('should render headerLeft with logo and version switcher', () => {
    const { container } = render(<Header docsContext="docs" />);

    const headerLeft = container.querySelector('[class*="headerLeft"]');
    expect(headerLeft).toBeTruthy();

    const logo = headerLeft?.querySelector('a');
    expect(logo).toBeTruthy();

    const versionSwitcher = headerLeft?.querySelector('[data-testid="version-switcher"]');
    expect(versionSwitcher).toBeTruthy();
  });

  it('should render headerRight with github and dark mode toggle', () => {
    const { container } = render(<Header docsContext="docs" />);

    const headerRight = container.querySelector('[class*="headerRight"]');
    expect(headerRight).toBeTruthy();

    const darkModeToggle = headerRight?.querySelector('[data-testid="dark-mode-toggle"]');
    expect(darkModeToggle).toBeTruthy();
  });

  it('should render hamburger outside headerLeft and headerRight', () => {
    const { container } = render(<Header docsContext="docs" />);

    const hamburgerBtn = container.querySelector('[data-testid="hamburger-button"]');
    const headerLeft = container.querySelector('[class*="headerLeft"]');
    const headerRight = container.querySelector('[class*="headerRight"]');

    expect(hamburgerBtn).toBeTruthy();
    expect(headerLeft).toBeTruthy();
    expect(headerRight).toBeTruthy();

    // Hamburger is NOT inside headerLeft or headerRight
    expect(headerLeft?.contains(hamburgerBtn!)).toBe(false);
    expect(headerRight?.contains(hamburgerBtn!)).toBe(false);
  });

  it('should maintain correct DOM order: hamburger, headerLeft, headerRight', () => {
    const { container } = render(<Header docsContext="docs" />);

    const header = container.querySelector('header');
    const children = Array.from(header?.children || []);

    // Find the indexes of key elements
    const hamburgerIndex = children.findIndex(
      (el) => el.querySelector('[data-testid="hamburger-button"]') || el.getAttribute('data-testid') === 'hamburger-button',
    );
    const headerLeftIndex = children.findIndex(
      (el) => el.className?.includes('headerLeft'),
    );
    const headerRightIndex = children.findIndex(
      (el) => el.className?.includes('headerRight'),
    );

    expect(hamburgerIndex).toBeGreaterThanOrEqual(0);
    expect(headerLeftIndex).toBeGreaterThanOrEqual(0);
    expect(headerRightIndex).toBeGreaterThanOrEqual(0);

    // Hamburger comes before headerLeft, which comes before headerRight
    expect(hamburgerIndex).toBeLessThan(headerLeftIndex);
    expect(headerLeftIndex).toBeLessThan(headerRightIndex);
  });
});
