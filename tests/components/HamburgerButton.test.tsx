import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { HamburgerButton } from '@/components/HamburgerButton';

describe('HamburgerButton', () => {
  it('should render hamburger button with correct aria attributes', () => {
    const mockClick = jest.fn();
    render(<HamburgerButton isOpen={false} onClick={mockClick} />);

    const button = screen.getByTestId('hamburger-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Toggle navigation menu');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('should call onClick handler when clicked', async () => {
    const mockClick = jest.fn();
    const user = userEvent.setup();
    
    render(<HamburgerButton isOpen={false} onClick={mockClick} />);

    const button = screen.getByTestId('hamburger-button');
    await user.click(button);

    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('should update aria-expanded when isOpen prop changes', () => {
    const mockClick = jest.fn();
    const { rerender } = render(<HamburgerButton isOpen={false} onClick={mockClick} />);

    const button = screen.getByTestId('hamburger-button');
    expect(button).toHaveAttribute('aria-expanded', 'false');

    rerender(<HamburgerButton isOpen={true} onClick={mockClick} />);
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('should apply open class when isOpen is true', () => {
    const mockClick = jest.fn();
    const { container } = render(<HamburgerButton isOpen={true} onClick={mockClick} />);

    const button = container.querySelector('[data-testid="hamburger-button"]');
    expect(button?.className).toMatch(/open/);
  });

  it('should not apply open class when isOpen is false', () => {
    const mockClick = jest.fn();
    const { container } = render(<HamburgerButton isOpen={false} onClick={mockClick} />);

    const button = container.querySelector('[data-testid="hamburger-button"]');
    expect(button?.className).not.toMatch(/open/);
  });

  it('should render three lines for hamburger icon', () => {
    const mockClick = jest.fn();
    const { container } = render(<HamburgerButton isOpen={false} onClick={mockClick} />);

    const lines = container.querySelectorAll('span');
    expect(lines).toHaveLength(3);
  });

  it('should be accessible with keyboard', async () => {
    const mockClick = jest.fn();
    const user = userEvent.setup();
    
    render(<HamburgerButton isOpen={false} onClick={mockClick} />);

    const button = screen.getByTestId('hamburger-button');
    button.focus();
    
    expect(button).toHaveFocus();
    
    await user.keyboard('{Enter}');
    expect(mockClick).toHaveBeenCalled();
  });
});
