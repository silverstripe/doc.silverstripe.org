import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Header } from '@/components/Header';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}));

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: any) => (
    <a href={href}>{children}</a>
  );
});

// Mock SearchBox component
jest.mock('@/components/SearchBox', () => ({
  SearchBox: () => <div data-testid="search-box">SearchBox</div>,
}));

// Mock VersionSwitcher component
jest.mock('@/components/VersionSwitcher', () => ({
  VersionSwitcher: ({ currentVersion }: any) => (
    <div data-testid="version-switcher">v{currentVersion}</div>
  ),
}));

// Mock HamburgerButton component
jest.mock('@/components/HamburgerButton', () => ({
  HamburgerButton: ({ isOpen, onClick }: any) => (
    <button
      data-testid="hamburger-button"
      aria-expanded={isOpen}
      onClick={onClick}
    >
      Menu
    </button>
  ),
}));

// Mock DarkModeToggle component
jest.mock('@/components/DarkModeToggle', () => ({
  DarkModeToggle: () => <div data-testid="dark-mode-toggle">Toggle</div>,
}));

describe('Phase 2: Logo Link Version Routing', () => {
  it('logo href is /en/3/ when on a v3 page', () => {
    const { usePathname } = require('next/navigation');
    usePathname.mockReturnValue('/en/3/getting-started/');

    render(<Header />);

    const logoImg = screen.getByAltText('Silverstripe');
    const logoLink = logoImg.closest('a');
    expect(logoLink).toHaveAttribute('href', '/en/3/');
  });

  it('logo href is /en/6/ when on a v6 page', () => {
    const { usePathname } = require('next/navigation');
    usePathname.mockReturnValue('/en/6/getting-started/');

    render(<Header />);

    const logoImg = screen.getByAltText('Silverstripe');
    const logoLink = logoImg.closest('a');
    expect(logoLink).toHaveAttribute('href', '/en/6/');
  });

  it('logo href uses default version (6) when version cannot be determined', () => {
    const { usePathname } = require('next/navigation');
    usePathname.mockReturnValue('/invalid/path/');

    render(<Header />);

    const logoImg = screen.getByAltText('Silverstripe');
    const logoLink = logoImg.closest('a');
    expect(logoLink).toHaveAttribute('href', '/en/6/');
  });

  it('logo href is /en/5/ when on a v5 page', () => {
    const { usePathname } = require('next/navigation');
    usePathname.mockReturnValue('/en/5/api/');

    render(<Header />);

    const logoImg = screen.getByAltText('Silverstripe');
    const logoLink = logoImg.closest('a');
    expect(logoLink).toHaveAttribute('href', '/en/5/');
  });

  it('logo href is /en/4/ when on a v4 page', () => {
    const { usePathname } = require('next/navigation');
    usePathname.mockReturnValue('/en/4/api/');

    render(<Header />);

    const logoImg = screen.getByAltText('Silverstripe');
    const logoLink = logoImg.closest('a');
    expect(logoLink).toHaveAttribute('href', '/en/4/');
  });
});
