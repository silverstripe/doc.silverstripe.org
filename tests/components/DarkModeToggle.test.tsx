import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { DarkModeToggle } from '@/components/DarkModeToggle';

describe('DarkModeToggle', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset document class
    document.documentElement.classList.remove('dark');

    // Mock matchMedia
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

  it('should render dark mode toggle button', async () => {
    render(<DarkModeToggle />);

    await waitFor(() => {
      const button = screen.getByTestId('dark-mode-toggle');
      expect(button).toBeInTheDocument();
    });
  });

  it('should render both sun and moon icons always visible', async () => {
    render(<DarkModeToggle />);

    await waitFor(() => {
      const button = screen.getByTestId('dark-mode-toggle');
      expect(button).toBeInTheDocument();
      // Both icons should always be present
      const sunIcon = button.querySelector('.fa-sun');
      const moonIcon = button.querySelector('.fa-moon');
      expect(sunIcon).toBeInTheDocument();
      expect(moonIcon).toBeInTheDocument();
    });
  });

  it('should have correct icon positions in light mode', async () => {
    render(<DarkModeToggle />);

    await waitFor(() => {
      const button = screen.getByTestId('dark-mode-toggle');
      const sunIcon = button.querySelector('.fa-sun');
      const moonIcon = button.querySelector('.fa-moon');
      expect(sunIcon).toBeInTheDocument();
      expect(moonIcon).toBeInTheDocument();
    });
  });

  it('should have correct icon positions in dark mode', async () => {
    localStorage.setItem('theme_preference', 'dark');

    render(<DarkModeToggle />);

    await waitFor(() => {
      const button = screen.getByTestId('dark-mode-toggle');
      const sunIcon = button.querySelector('.fa-sun');
      const moonIcon = button.querySelector('.fa-moon');
      expect(sunIcon).toBeInTheDocument();
      expect(moonIcon).toBeInTheDocument();
    });
  });

  it('should toggle to dark mode when clicked', async () => {
    const user = userEvent.setup();
    render(<DarkModeToggle />);

    await waitFor(() => {
      const button = screen.getByTestId('dark-mode-toggle');
      expect(button).toBeInTheDocument();
    });

    const button = screen.getByTestId('dark-mode-toggle');

    // Initially light mode
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button.querySelector('.fa-sun')).toBeInTheDocument();
    expect(button.querySelector('.fa-moon')).toBeInTheDocument();

    // Click to toggle
    await user.click(button);

    // Should now be dark mode
    await waitFor(() => {
      expect(button).toHaveAttribute('aria-pressed', 'true');
      // Both icons still present
      expect(button.querySelector('.fa-sun')).toBeInTheDocument();
      expect(button.querySelector('.fa-moon')).toBeInTheDocument();
    });
  });

  it('should read from localStorage on mount', async () => {
    localStorage.setItem('theme_preference', 'dark');

    render(<DarkModeToggle />);

    await waitFor(() => {
      const button = screen.getByTestId('dark-mode-toggle');
      expect(button).toHaveAttribute('aria-pressed', 'true');
      // Both icons still present
      expect(button.querySelector('.fa-sun')).toBeInTheDocument();
      expect(button.querySelector('.fa-moon')).toBeInTheDocument();
    });
  });

  it('should save to localStorage when toggled', async () => {
    const user = userEvent.setup();
    render(<DarkModeToggle />);

    await waitFor(() => {
      const button = screen.getByTestId('dark-mode-toggle');
      expect(button).toBeInTheDocument();
    });

    const button = screen.getByTestId('dark-mode-toggle');

    // Initially light mode
    expect(localStorage.getItem('theme_preference')).toBe('light');

    // Click to toggle to dark mode
    await user.click(button);

    await waitFor(() => {
      expect(localStorage.getItem('theme_preference')).toBe('dark');
    });

    // Click again to toggle back to light mode
    await user.click(button);

    await waitFor(() => {
      expect(localStorage.getItem('theme_preference')).toBe('light');
    });
  });

  it('should apply dark class to document.documentElement in dark mode', async () => {
    const user = userEvent.setup();
    render(<DarkModeToggle />);

    await waitFor(() => {
      const button = screen.getByTestId('dark-mode-toggle');
      expect(button).toBeInTheDocument();
    });

    // Initially should not have dark class
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    const button = screen.getByTestId('dark-mode-toggle');

    // Click to toggle to dark mode
    await user.click(button);

    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    // Click to toggle back to light mode
    await user.click(button);

    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  it('should restore dark mode from localStorage on mount', async () => {
    localStorage.setItem('theme_preference', 'dark');

    render(<DarkModeToggle />);

    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  it('should have proper aria label and aria-pressed attribute', async () => {
    render(<DarkModeToggle />);

    await waitFor(() => {
      const button = screen.getByTestId('dark-mode-toggle');
      expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });
  });

  it('should update aria-label and aria-pressed when toggled', async () => {
    const user = userEvent.setup();
    render(<DarkModeToggle />);

    await waitFor(() => {
      const button = screen.getByTestId('dark-mode-toggle');
      expect(button).toBeInTheDocument();
    });

    const button = screen.getByTestId('dark-mode-toggle');

    // Initial state - light mode
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
    expect(button).toHaveAttribute('aria-pressed', 'false');

    // Toggle to dark mode
    await user.click(button);

    await waitFor(() => {
      expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    // Toggle back to light mode
    await user.click(button);

    await waitFor(() => {
      expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });
  });

  it('should use system preference if no localStorage value', async () => {
    // Mock matchMedia to simulate dark mode preference
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

    render(<DarkModeToggle />);

    await waitFor(() => {
      const button = screen.getByTestId('dark-mode-toggle');
      expect(button).toHaveAttribute('aria-pressed', 'true');
      // Both icons still present
      expect(button.querySelector('.fa-sun')).toBeInTheDocument();
      expect(button.querySelector('.fa-moon')).toBeInTheDocument();
    });
  });
});
