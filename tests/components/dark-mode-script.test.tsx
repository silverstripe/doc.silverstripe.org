/**
 * Tests for the DarkModeScript component.
 * Verifies that the inline script is properly configured to run before React hydration.
 * Uses dangerouslySetInnerHTML with IIFE pattern to execute synchronously before paint.
 */

import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DarkModeScript } from '@/app/dark-mode-script';

describe('DarkModeScript component', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('should render without errors', () => {
    const { container } = render(<DarkModeScript />);
    expect(container).toBeInTheDocument();
  });

  it('should render a script tag with dangerouslySetInnerHTML', () => {
    const { container } = render(<DarkModeScript />);
    const script = container.querySelector('script');
    expect(script).toBeInTheDocument();
  });

  it('should contain inline dark mode initialization logic', () => {
    const componentSource = DarkModeScript.toString();
    expect(componentSource).toContain('prefers-no-transition');
    expect(componentSource).toContain('localStorage');
    expect(componentSource).toContain('dark');
  });

  it('should use dangerouslySetInnerHTML for inline script', () => {
    const componentSource = DarkModeScript.toString();
    expect(componentSource).toContain('dangerouslySetInnerHTML');
  });

  it('should have suppressHydrationWarning', () => {
    const componentSource = DarkModeScript.toString();
    expect(componentSource).toContain('suppressHydrationWarning');
  });
});


