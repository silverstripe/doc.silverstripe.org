import React from 'react';
import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SyntaxHighlighter } from '@/components/SyntaxHighlighter';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock prismjs - we need to mock the dynamic imports
jest.mock('prismjs', () => ({
  highlightAllUnder: jest.fn(),
}));

// Mock all prismjs component imports
jest.mock('prismjs/components/prism-markup', () => ({}));
jest.mock('prismjs/components/prism-markup-templating', () => ({}));
jest.mock('prismjs/components/prism-php', () => ({}));
jest.mock('prismjs/components/prism-javascript', () => ({}));
jest.mock('prismjs/components/prism-typescript', () => ({}));
jest.mock('prismjs/components/prism-bash', () => ({}));
jest.mock('prismjs/components/prism-css', () => ({}));
jest.mock('prismjs/components/prism-sql', () => ({}));
jest.mock('prismjs/components/prism-json', () => ({}));
jest.mock('prismjs/components/prism-yaml', () => ({}));
jest.mock('prismjs/components/prism-scss', () => ({}));
jest.mock('prismjs/components/prism-markdown', () => ({}));

import { usePathname } from 'next/navigation';
import Prism from 'prismjs';

describe('SyntaxHighlighter', () => {
  const mockUsePathname = usePathname as jest.Mock;
  const mockHighlightAllUnder = Prism.highlightAllUnder as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePathname.mockReturnValue('/en/5/installation/');
    mockHighlightAllUnder.mockClear();
  });

  it('should render without crashing', () => {
    render(<SyntaxHighlighter />);
    // Component returns null, so just checking it doesn't throw
    expect(true).toBe(true);
  });

  it('should call Prism.highlightAllUnder on initial mount', async () => {
    render(<SyntaxHighlighter />);

    // Wait for async Prism initialization
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(mockHighlightAllUnder).toHaveBeenCalledWith(document.body);
    expect(mockHighlightAllUnder).toHaveBeenCalledTimes(1);
  });

  it('should re-call Prism.highlightAllUnder when pathname changes', async () => {
    const { rerender } = render(<SyntaxHighlighter />);

    // Wait for initial mount effect
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(mockHighlightAllUnder).toHaveBeenCalledTimes(1);

    // Change the pathname
    mockUsePathname.mockReturnValue('/en/5/getting-started/');
    rerender(<SyntaxHighlighter />);

    // Wait for the effect to run
    await new Promise(resolve => setTimeout(resolve, 100));

    // Should be called twice now (once on mount, once on pathname change)
    expect(mockHighlightAllUnder).toHaveBeenCalledTimes(2);
    expect(mockHighlightAllUnder).toHaveBeenLastCalledWith(document.body);
  });

  it('should handle Prism initialization errors gracefully', async () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

    mockHighlightAllUnder.mockImplementationOnce(() => {
      throw new Error('Prism initialization failed');
    });

    render(<SyntaxHighlighter />);

    // Wait for async initialization and error handling
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Failed to initialize Prism highlighting:',
      expect.any(Error)
    );

    consoleWarnSpy.mockRestore();
  });

  it('should call Prism with updated pathname when navigating', async () => {
    mockUsePathname.mockReturnValue('/en/5/first-page/');
    const { rerender } = render(<SyntaxHighlighter />);

    await new Promise(resolve => setTimeout(resolve, 100));
    mockHighlightAllUnder.mockClear();

    // Simulate navigation to different page
    mockUsePathname.mockReturnValue('/en/5/second-page/');
    rerender(<SyntaxHighlighter />);

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(mockHighlightAllUnder).toHaveBeenCalledWith(document.body);
  });

  it('should not re-highlight if pathname stays the same', async () => {
    mockUsePathname.mockReturnValue('/en/5/same-page/');
    const { rerender } = render(<SyntaxHighlighter />);

    await new Promise(resolve => setTimeout(resolve, 100));
    expect(mockHighlightAllUnder).toHaveBeenCalledTimes(1);

    // Re-render with the same pathname
    rerender(<SyntaxHighlighter />);

    await new Promise(resolve => setTimeout(resolve, 100));

    // Should still only be called once
    expect(mockHighlightAllUnder).toHaveBeenCalledTimes(1);
  });

  it('should re-highlight when code blocks are added to DOM via MutationObserver', async () => {
    render(<SyntaxHighlighter />);

    // Wait for initial mount
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(mockHighlightAllUnder).toHaveBeenCalledTimes(1);

    // Clear previous calls
    mockHighlightAllUnder.mockClear();

    // Simulate adding a code block to the DOM (like same-page navigation would)
    await act(async () => {
      const pre = document.createElement('pre');
      const code = document.createElement('code');
      code.textContent = 'const x = 1;';
      pre.appendChild(code);
      document.body.appendChild(pre);

      // Wait for MutationObserver to trigger
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    expect(mockHighlightAllUnder).toHaveBeenCalledWith(document.body);
  });

  it('should not re-highlight when non-code elements are added to DOM', async () => {
    render(<SyntaxHighlighter />);

    // Wait for initial mount
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(mockHighlightAllUnder).toHaveBeenCalledTimes(1);

    // Clear previous calls
    mockHighlightAllUnder.mockClear();

    // Simulate adding a non-code element to the DOM
    await act(async () => {
      const div = document.createElement('div');
      div.textContent = 'Just some text';
      document.body.appendChild(div);

      // Wait for MutationObserver callback
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    // Should not be called for non-code elements
    expect(mockHighlightAllUnder).not.toHaveBeenCalled();
  });
});
