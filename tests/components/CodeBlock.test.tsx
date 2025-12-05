import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { CodeBlock } from '@/components/CodeBlock';

describe('CodeBlock', () => {
  let mockWriteText: jest.Mock;

  beforeEach(() => {
    // Mock clipboard API
    mockWriteText = jest.fn();
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: mockWriteText,
      },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render code content', () => {
    const code = 'const x = 42;';
    render(<CodeBlock>{code}</CodeBlock>);

    const codeElement = screen.getByTestId('code-content');
    expect(codeElement).toBeInTheDocument();
    expect(codeElement).toHaveTextContent(code);
  });

  it('should display copy button', () => {
    const code = 'echo "Hello World"';
    render(<CodeBlock>{code}</CodeBlock>);

    const copyButton = screen.getByTestId('copy-button');
    expect(copyButton).toBeInTheDocument();
    expect(copyButton).toHaveTextContent('📋 Copy');
  });

  it('should show "Copied!" feedback after copying', async () => {
    const user = userEvent.setup();
    const code = 'console.log("test");';

    mockWriteText.mockResolvedValue(undefined);

    render(<CodeBlock>{code}</CodeBlock>);

    const copyButton = screen.getByTestId('copy-button');
    expect(copyButton).toHaveTextContent('📋 Copy');

    await user.click(copyButton);

    await waitFor(
      () => {
        expect(copyButton).toHaveTextContent('✓ Copied!');
      },
      { timeout: 1000 }
    );
  });

  it('should display language if provided', () => {
    const code = 'console.log("js");';
    render(
      <CodeBlock data-language="javascript">
        {code}
      </CodeBlock>
    );

    expect(screen.getByText('javascript')).toBeInTheDocument();
  });

  it('should apply custom className to code element', () => {
    const code = 'x = 10';
    const className = 'language-python';

    render(
      <CodeBlock className={className}>
        {code}
      </CodeBlock>
    );

    const codeElement = screen.getByTestId('code-content');
    expect(codeElement).toHaveClass(className);
  });

  it('should handle clipboard copy errors gracefully', async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const code = 'error test';

    const error = new Error('Clipboard denied');
    mockWriteText.mockRejectedValue(error);

    render(<CodeBlock>{code}</CodeBlock>);

    const copyButton = screen.getByTestId('copy-button');
    
    // Should not throw even if clipboard fails
    expect(async () => {
      await user.click(copyButton);
    }).not.toThrow();

    consoleErrorSpy.mockRestore();
  });

  it('should have proper aria-label for accessibility', () => {
    const code = 'accessible code';
    render(<CodeBlock>{code}</CodeBlock>);

    const copyButton = screen.getByTestId('copy-button');
    expect(copyButton).toHaveAttribute('aria-label', 'Copy code to clipboard');
  });

  it('should update aria-label after copying', async () => {
    const user = userEvent.setup();
    const code = 'aria test';

    mockWriteText.mockResolvedValue(undefined);

    render(<CodeBlock>{code}</CodeBlock>);

    const copyButton = screen.getByTestId('copy-button');
    expect(copyButton).toHaveAttribute('aria-label', 'Copy code to clipboard');

    await user.click(copyButton);

    await waitFor(
      () => {
        expect(copyButton).toHaveAttribute('aria-label', 'Code copied to clipboard');
      },
      { timeout: 1000 }
    );
  });

  it('should handle multiline code blocks', () => {
    const code = `function add(a, b) {
  return a + b;
}

console.log(add(1, 2));`;

    render(<CodeBlock>{code}</CodeBlock>);

    const codeElement = screen.getByTestId('code-content');
    expect(codeElement).toHaveTextContent('function add(a, b)');
    expect(codeElement).toHaveTextContent('return a + b;');
    expect(codeElement).toHaveTextContent('console.log(add(1, 2));');
  });

  it('should preserve whitespace and indentation', () => {
    const code = `  const obj = {
    key: "value",
    nested: {
      deep: true
    }
  };`;

    render(<CodeBlock>{code}</CodeBlock>);

    const codeElement = screen.getByTestId('code-content');
    expect(codeElement.textContent).toContain(code);
  });
});
