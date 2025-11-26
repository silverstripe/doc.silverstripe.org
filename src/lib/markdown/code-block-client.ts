/**
 * Client-side code block functionality
 * Adds copy button interactivity
 */

export function initializeCodeBlocks() {
  // Find all copy buttons
  const copyButtons = document.querySelectorAll('.code-block-copy-btn');

  copyButtons.forEach((button) => {
    button.addEventListener('click', handleCopyClick);
  });
}

async function handleCopyClick(event: Event) {
  const button = event.target as HTMLButtonElement;
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
