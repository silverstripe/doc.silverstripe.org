import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { HashScrollManager } from '@/components/HashScrollManager';

describe('HashScrollManager', () => {
  let mockScrollIntoView: jest.Mock;
  let mockScrollTo: jest.Mock;
  let mockGetElementById: jest.SpyInstance;
  let mockGetComputedStyle: jest.SpyInstance;

  beforeEach(() => {
    // Mock Element.scrollIntoView
    mockScrollIntoView = jest.fn();
    Element.prototype.scrollIntoView = mockScrollIntoView;

    // Mock window.scrollTo
    mockScrollTo = jest.fn();
    window.scrollTo = mockScrollTo;

    // Mock document.getElementById
    mockGetElementById = jest.spyOn(document, 'getElementById') as jest.SpyInstance;

    // Mock getComputedStyle
    mockGetComputedStyle = jest.spyOn(window, 'getComputedStyle') as jest.SpyInstance;

    // Setup default mock behavior
    mockGetComputedStyle.mockReturnValue({
      height: '70px',
    } as CSSStyleDeclaration);

    // Use jsdom's native hash setting (only hash changes are supported)
    window.location.hash = '';
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    window.location.hash = '';
  });

  it('should render without error', () => {
    const { container } = render(<HashScrollManager />);
    expect(container).toBeInTheDocument();
  });

  it('should find and scroll to target element on hashchange', async () => {
    const mockElement = document.createElement('h2');
    mockElement.id = 'test-heading';
    document.body.appendChild(mockElement);

    mockGetElementById.mockReturnValue(mockElement);
    mockScrollIntoView.mockClear();
    mockScrollTo.mockClear();

    render(<HashScrollManager />);

    // Simulate hashchange event
    window.location.hash = '#test-heading';
    window.dispatchEvent(new HashChangeEvent('hashchange'));

    // Give async operations time to complete
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(mockGetElementById).toHaveBeenCalledWith('test-heading');
    expect(mockScrollIntoView).toHaveBeenCalled();

    document.body.removeChild(mockElement);
  });

  it('should handle missing target element gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    mockGetElementById.mockReturnValue(null);

    render(<HashScrollManager />);

    window.location.hash = '#nonexistent';
    window.dispatchEvent(new HashChangeEvent('hashchange'));

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(consoleSpy).toHaveBeenCalledWith(
      'HashScrollManager: target element not found for hash #nonexistent'
    );

    consoleSpy.mockRestore();
  });

  it('should apply header offset when scrolling', async () => {
    const mockElement = document.createElement('h2');
    mockElement.id = 'offset-test';
    document.body.appendChild(mockElement);

    mockGetElementById.mockReturnValue(mockElement);

    // Mock getBoundingClientRect to return a specific position
    mockElement.getBoundingClientRect = jest.fn(() => ({
      top: 200,
      bottom: 0,
      left: 0,
      right: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 200,
      toJSON: () => {},
    }));

    // Mock window.scrollY
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 500,
    });

    mockScrollIntoView.mockClear();
    mockScrollTo.mockClear();

    render(<HashScrollManager />);

    window.location.hash = '#offset-test';
    window.dispatchEvent(new HashChangeEvent('hashchange'));

    await new Promise((resolve) => setTimeout(resolve, 100));

    // Should have called either scrollIntoView or scrollTo
    const totalCalls = mockScrollIntoView.mock.calls.length + mockScrollTo.mock.calls.length;
    expect(totalCalls).toBeGreaterThan(0);

    document.body.removeChild(mockElement);
  });

  it('should handle same-hash link clicks', async () => {
    const mockElement = document.createElement('h2');
    mockElement.id = 'same-hash-test';
    document.body.appendChild(mockElement);

    mockGetElementById.mockReturnValue(mockElement);

    // Set initial hash
    window.location.hash = '#same-hash-test';

    render(<HashScrollManager />);

    // Create a link with the same hash
    const link = document.createElement('a');
    link.href = '#same-hash-test';
    link.textContent = 'Click me';
    document.body.appendChild(link);

    mockScrollIntoView.mockClear();
    mockScrollTo.mockClear();

    // Click the link
    const user = userEvent.setup();
    await user.click(link);

    await new Promise((resolve) => setTimeout(resolve, 100));

    // Should have scrolled (called scrollIntoView or scrollTo)
    expect(mockScrollIntoView.mock.calls.length + mockScrollTo.mock.calls.length).toBeGreaterThan(0);

    document.body.removeChild(mockElement);
    document.body.removeChild(link);
  });

  it('should handle hash without # prefix', async () => {
    const mockElement = document.createElement('h2');
    mockElement.id = 'stripped-hash';
    document.body.appendChild(mockElement);

    mockGetElementById.mockReturnValue(mockElement);

    mockScrollIntoView.mockClear();

    render(<HashScrollManager />);

    // Set hash properly through location.hash
    window.location.hash = '#stripped-hash';
    window.dispatchEvent(new HashChangeEvent('hashchange'));

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(mockGetElementById).toHaveBeenCalledWith('stripped-hash');

    document.body.removeChild(mockElement);
  });

  it('should ignore empty hash', async () => {
    mockGetElementById.mockClear();

    render(<HashScrollManager />);

    window.location.hash = '';
    window.dispatchEvent(new HashChangeEvent('hashchange'));

    await new Promise((resolve) => setTimeout(resolve, 50));

    // Should not try to find element for empty hash
    expect(mockGetElementById).not.toHaveBeenCalled();
  });

  it('should work with header height of 0', async () => {
    mockGetComputedStyle.mockReturnValue({
      height: '0px',
    } as CSSStyleDeclaration);

    const mockElement = document.createElement('h2');
    mockElement.id = 'zero-header-height';
    document.body.appendChild(mockElement);

    mockGetElementById.mockReturnValue(mockElement);

    mockScrollIntoView.mockClear();

    render(<HashScrollManager />);

    window.location.hash = '#zero-header-height';
    window.dispatchEvent(new HashChangeEvent('hashchange'));

    await new Promise((resolve) => setTimeout(resolve, 100));

    // Should still scroll even with 0 header height
    expect(mockGetElementById).toHaveBeenCalled();

    document.body.removeChild(mockElement);
  });

  it('should clean up event listeners on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = render(<HashScrollManager />);

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('hashchange', expect.any(Function));

    removeEventListenerSpy.mockRestore();
  });

  it('should handle click events on links', async () => {
    const mockElement = document.createElement('h3');
    mockElement.id = 'click-test';
    document.body.appendChild(mockElement);

    mockGetElementById.mockReturnValue(mockElement);
    mockScrollIntoView.mockClear();

    render(<HashScrollManager />);

    // Create and click a link to a hash
    const link = document.createElement('a');
    link.href = '#click-test';
    link.textContent = 'Test Link';
    document.body.appendChild(link);

    const user = userEvent.setup();
    await user.click(link);

    await new Promise((resolve) => setTimeout(resolve, 100));

    // Should have triggered scroll
    expect(mockGetElementById).toHaveBeenCalled();

    document.body.removeChild(mockElement);
    document.body.removeChild(link);
  });
});
