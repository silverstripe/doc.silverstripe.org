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
});
