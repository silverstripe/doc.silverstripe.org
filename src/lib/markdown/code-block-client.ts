/**
 * Client-side code block functionality
 * Adds copy button interactivity using event delegation for robustness
 */

let initialized = false;

export function initializeCodeBlocks(): () => void {
  // Use event delegation - only attach once to document
  if (initialized) {
    return () => {};
  }

  document.addEventListener('click', handleDelegatedClick);
  initialized = true;

  // Return cleanup function
  return () => {
    document.removeEventListener('click', handleDelegatedClick);
    initialized = false;
  };
}

function handleDelegatedClick(event: Event) {
  const target = event.target as HTMLElement;

  // Check if clicked element is a copy button or inside one
  const button = target.closest('.code-block-copy-btn') as HTMLButtonElement | null;
  if (!button) return;

  handleCopyClick(button);
}

async function handleCopyClick(button: HTMLButtonElement) {
  const codeText = button.getAttribute('data-code');

  if (!codeText) {
    console.error('No code text found on copy button');
    return;
  }

  try {
    await navigator.clipboard.writeText(codeText);

    // Show feedback
    const originalText = button.textContent;
    button.textContent = '✓ Copied!';
    button.classList.add('copied');
    button.setAttribute('aria-label', 'Code copied to clipboard');

    // Reset after 2 seconds
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('copied');
      button.setAttribute('aria-label', 'Copy code to clipboard');
    }, 2000);
  } catch (err) {
    console.error('Failed to copy code:', err);
    button.textContent = '❌ Failed';
    setTimeout(() => {
      button.textContent = '📋 Copy';
    }, 2000);
  }
}
