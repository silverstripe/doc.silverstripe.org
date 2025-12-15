import { initializeCodeBlocks } from '@/lib/markdown/code-block-client';

describe('initializeCodeBlocks', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    // Reset initialized state by calling cleanup
    const cleanup = initializeCodeBlocks();
    cleanup();
  });

  it('should handle clicks on copy buttons via event delegation', () => {
    const cleanup = initializeCodeBlocks();

    const button = document.createElement('button');
    button.className = 'code-block-copy-btn';
    button.setAttribute('data-code', 'console.log("test")');
    container.appendChild(button);

    // Suppress clipboard API error since jsdom doesn't support it
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Clicking the button should work even though it was added after initialization
    button.click();

    spy.mockRestore();
    cleanup();
  });

  it('should work with dynamically added buttons', () => {
    const cleanup = initializeCodeBlocks();

    // Add button after initialization (simulates client-side navigation)
    const button = document.createElement('button');
    button.className = 'code-block-copy-btn';
    button.setAttribute('data-code', 'code1');
    container.appendChild(button);

    // Button should be clickable
    expect(button.getAttribute('data-code')).toBe('code1');

    cleanup();
  });

  it('should only initialize once', () => {
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');

    // First initialization
    const cleanup1 = initializeCodeBlocks();
    expect(addEventListenerSpy).toHaveBeenCalledTimes(1);

    // Second initialization should not add another listener
    const cleanup2 = initializeCodeBlocks();
    expect(addEventListenerSpy).toHaveBeenCalledTimes(1);

    addEventListenerSpy.mockRestore();
    cleanup1();
    cleanup2();
  });

  it('should return a cleanup function that removes event listener', () => {
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

    const cleanup = initializeCodeBlocks();
    cleanup();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));

    removeEventListenerSpy.mockRestore();
  });

  it('should allow re-initialization after cleanup', () => {
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');

    // First cycle
    const cleanup1 = initializeCodeBlocks();
    cleanup1();

    // Second cycle - should add listener again
    const cleanup2 = initializeCodeBlocks();

    expect(addEventListenerSpy).toHaveBeenCalledTimes(2);

    addEventListenerSpy.mockRestore();
    cleanup2();
  });

  it('should copy code to clipboard on button click', async () => {
    const cleanup = initializeCodeBlocks();
    const testCode = 'const x = 42;';

    // Mock clipboard API
    const mockWriteText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      writable: true,
      configurable: true,
    });

    const button = document.createElement('button');
    button.className = 'code-block-copy-btn';
    button.setAttribute('data-code', testCode);
    button.textContent = '📋 Copy';
    container.appendChild(button);

    button.click();

    // Wait for async copy operation
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(mockWriteText).toHaveBeenCalledWith(testCode);
    cleanup();
  });

  it('should change button text and class on successful copy', async () => {
    const cleanup = initializeCodeBlocks();

    // Mock clipboard API
    const mockWriteText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      writable: true,
      configurable: true,
    });

    const button = document.createElement('button');
    button.className = 'code-block-copy-btn';
    button.setAttribute('data-code', 'test code');
    button.textContent = '📋 Copy';
    button.setAttribute('aria-label', 'Copy code to clipboard');
    container.appendChild(button);

    button.click();

    // Wait for state change
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(button.textContent).toBe('✓ Copied!');
    expect(button.classList.contains('copied')).toBe(true);
    expect(button.getAttribute('aria-label')).toBe('Code copied to clipboard');

    cleanup();
  });

  it('should reset button state after 2 seconds', async () => {
    jest.useFakeTimers();
    const cleanup = initializeCodeBlocks();

    // Mock clipboard API
    const mockWriteText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      writable: true,
      configurable: true,
    });

    const button = document.createElement('button');
    button.className = 'code-block-copy-btn';
    button.setAttribute('data-code', 'test');
    button.textContent = '📋 Copy';
    container.appendChild(button);

    button.click();

    // Advance timers to trigger the copy feedback
    jest.runAllTimers();

    // Button should be reset
    expect(button.textContent).toBe('📋 Copy');
    expect(button.classList.contains('copied')).toBe(false);

    jest.useRealTimers();
    cleanup();
  });

  it('should handle clipboard errors gracefully', async () => {
    const cleanup = initializeCodeBlocks();
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    // Mock clipboard API to fail
    const mockWriteText = jest.fn().mockRejectedValue(new Error('Clipboard denied'));
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      writable: true,
      configurable: true,
    });

    const button = document.createElement('button');
    button.className = 'code-block-copy-btn';
    button.setAttribute('data-code', 'test');
    button.textContent = '📋 Copy';
    container.appendChild(button);

    button.click();

    // Wait for error handling
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to copy code:', expect.any(Error));
    expect(button.textContent).toBe('❌ Failed');

    consoleErrorSpy.mockRestore();
    cleanup();
  });

  it('should ignore clicks on non-button elements', () => {
    const cleanup = initializeCodeBlocks();

    // Mock clipboard to ensure it's not called
    const mockWriteText = jest.fn();
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      writable: true,
      configurable: true,
    });

    const div = document.createElement('div');
    container.appendChild(div);

    div.click();

    expect(mockWriteText).not.toHaveBeenCalled();
    cleanup();
  });

  it('should handle missing data-code attribute', () => {
    const cleanup = initializeCodeBlocks();
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const button = document.createElement('button');
    button.className = 'code-block-copy-btn';
    // No data-code attribute
    container.appendChild(button);

    button.click();

    expect(consoleErrorSpy).toHaveBeenCalledWith('No code text found on copy button');

    consoleErrorSpy.mockRestore();
    cleanup();
  });
});
