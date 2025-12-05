/**
 * Tests for dark mode initialization and FOUT (Flash of Unstyled Content) prevention.
 * 
 * The dark mode system works in two parts:
 * 1. Inline script in layout.tsx that runs before React hydration to set initial dark class
 * 2. DarkModeToggle component that syncs state and handles user toggles
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DarkModeToggle } from '@/components/DarkModeToggle';

describe('Dark mode initialization', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    
    // Mock matchMedia - default to light mode
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  describe('Dark mode preference from localStorage', () => {
    it('should apply dark mode when localStorage has dark preference', async () => {
      // Simulate inline script behavior - this is what happens before React hydrates
      localStorage.setItem('theme_preference', 'dark');
      
      // Inline script would add the class
      document.documentElement.classList.add('dark');
      
      render(<DarkModeToggle />);
      
      // Component should sync with the existing dark class
      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true);
        const button = screen.getByTestId('dark-mode-toggle');
        expect(button.querySelector('.fa-moon')).toBeInTheDocument();
      });
    });

    it('should stay in light mode when localStorage has light preference', async () => {
      localStorage.setItem('theme_preference', 'light');
      
      render(<DarkModeToggle />);
      
      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(false);
        const button = screen.getByTestId('dark-mode-toggle');
        expect(button.querySelector('.fa-sun')).toBeInTheDocument();
      });
    });
  });

  describe('Dark mode preference from system', () => {
    it('should use system dark preference when no localStorage value', async () => {
      // Mock system dark mode preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });
      
      // Simulate inline script detecting system preference
      document.documentElement.classList.add('dark');
      
      render(<DarkModeToggle />);
      
      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true);
        const button = screen.getByTestId('dark-mode-toggle');
        expect(button.querySelector('.fa-moon')).toBeInTheDocument();
      });
    });

    it('should use system light preference when no localStorage value', async () => {
      // matchMedia returns false for dark preference (default in beforeEach)
      
      render(<DarkModeToggle />);
      
      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(false);
        const button = screen.getByTestId('dark-mode-toggle');
        expect(button.querySelector('.fa-sun')).toBeInTheDocument();
      });
    });
  });

  describe('FOUT prevention - inline script behavior', () => {
    it('should preserve dark class set by inline script before hydration', async () => {
      // Simulate inline script having already set the dark class
      // This happens before React mounts
      document.documentElement.classList.add('dark');
      
      // No localStorage (simulates system preference detected by inline script)
      // The component should recognize the class is already there
      
      render(<DarkModeToggle />);
      
      // The dark class should remain - no flash to light and back
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      
      await waitFor(() => {
        // After hydration, should still be dark
        expect(document.documentElement.classList.contains('dark')).toBe(true);
        const button = screen.getByTestId('dark-mode-toggle');
        expect(button.querySelector('.fa-moon')).toBeInTheDocument();
      });
    });

    it('should not add dark class if inline script did not set it', async () => {
      // No dark class set (light mode from inline script)
      // No localStorage preference
      
      render(<DarkModeToggle />);
      
      // Should stay light
      expect(document.documentElement.classList.contains('dark')).toBe(false);
      
      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(false);
        const button = screen.getByTestId('dark-mode-toggle');
        expect(button.querySelector('.fa-sun')).toBeInTheDocument();
      });
    });
  });

  describe('Navigation consistency', () => {
    it('should maintain dark mode state across re-renders (simulating navigation)', async () => {
      localStorage.setItem('theme_preference', 'dark');
      document.documentElement.classList.add('dark');
      
      // Initial render
      const { unmount } = render(<DarkModeToggle />);
      
      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true);
      });
      
      // Simulate navigation by unmounting and remounting
      unmount();
      
      // Dark class should persist (inline script would maintain it)
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      
      // Re-render (simulating new page)
      render(<DarkModeToggle />);
      
      // Should still be dark
      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true);
        const button = screen.getByTestId('dark-mode-toggle');
        expect(button.querySelector('.fa-moon')).toBeInTheDocument();
      });
    });

    it('should maintain light mode state across re-renders', async () => {
      localStorage.setItem('theme_preference', 'light');
      
      const { unmount } = render(<DarkModeToggle />);
      
      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(false);
      });
      
      unmount();
      
      // Light mode - no dark class
      expect(document.documentElement.classList.contains('dark')).toBe(false);
      
      render(<DarkModeToggle />);
      
      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(false);
        const button = screen.getByTestId('dark-mode-toggle');
        expect(button.querySelector('.fa-sun')).toBeInTheDocument();
      });
    });
  });
});

describe('Dark mode inline script', () => {
  it('should have correct logic for localStorage preference', () => {
    // Test the inline script logic separately
    const executeScript = (savedPreference: string | null, systemDark: boolean) => {
      // Reset state
      document.documentElement.classList.remove('dark');
      if (savedPreference) {
        localStorage.setItem('theme_preference', savedPreference);
      } else {
        localStorage.removeItem('theme_preference');
      }
      
      // Mock matchMedia
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: systemDark && query === '(prefers-color-scheme: dark)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });
      
      // Simulate inline script execution
      try {
        const saved = localStorage.getItem('theme_preference');
        let isDark = saved === 'dark';
        if (!saved && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          isDark = true;
        }
        if (isDark) {
          document.documentElement.classList.add('dark');
        }
      } catch (e) {
        // Ignore errors like inline script does
      }
      
      return document.documentElement.classList.contains('dark');
    };
    
    // Test cases
    expect(executeScript('dark', false)).toBe(true);
    expect(executeScript('light', false)).toBe(false);
    expect(executeScript('light', true)).toBe(false); // Explicit light overrides system
    expect(executeScript(null, true)).toBe(true); // System dark when no preference
    expect(executeScript(null, false)).toBe(false); // System light when no preference
  });
});
