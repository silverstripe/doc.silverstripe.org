import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Header } from '@/components/Header';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/en/6/getting-started/',
}));

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: any) => (
    <a href={href}>{children}</a>
  );
});

// Mock SearchBox component
jest.mock('@/components/SearchBox', () => ({
  SearchBox: () => <div data-testid="search-box">SearchBox</div>,
}));

// Mock VersionSwitcher component
jest.mock('@/components/VersionSwitcher', () => ({
  VersionSwitcher: ({ currentVersion }: any) => (
    <div data-testid="version-switcher">v{currentVersion}</div>
  ),
}));

// Mock HamburgerButton component
jest.mock('@/components/HamburgerButton', () => ({
  HamburgerButton: ({ isOpen, onClick }: any) => (
    <button
      data-testid="hamburger-button"
      aria-expanded={isOpen}
      onClick={onClick}
    >
      Menu
    </button>
  ),
}));

describe('Header Component', () => {
  it('should render the header', () => {
    render(<Header />);
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });

  it('should render logo image with correct src and alt text', () => {
    render(<Header />);
    const logoImg = screen.getByAltText('SilverStripe');
    expect(logoImg).toBeInTheDocument();
    expect(logoImg).toHaveAttribute('src', '/logo.svg');
  });

  it('should render logo text "SilverStripe" and "Docs"', () => {
    render(<Header />);
    expect(screen.getByText('SilverStripe')).toBeInTheDocument();
    expect(screen.getByText('Docs')).toBeInTheDocument();
  });

  it('should NOT render "Home" text link', () => {
    render(<Header />);
    const homeLinks = screen.queryAllByText('Home');
    expect(homeLinks).toHaveLength(0);
  });

  it('should render GitHub icon with correct class', () => {
    render(<Header />);
    const githubLink = screen.getByRole('link', { name: '' }).closest('a');
    expect(githubLink).toHaveAttribute('href', 'https://github.com/silverstripe');
    
    const githubIcon = githubLink?.querySelector('i');
    expect(githubIcon).toBeInTheDocument();
    expect(githubIcon).toHaveClass('fab', 'fa-github');
  });

  it('should render GitHub icon with enlarged size class', () => {
    render(<Header />);
    const githubLinks = screen.getAllByRole('link');
    const githubLink = githubLinks.find(link => 
      link.getAttribute('href') === 'https://github.com/silverstripe'
    );
    
    const githubIcon = githubLink?.querySelector('i');
    expect(githubIcon?.className).toMatch(/githubIcon/);
  });

  it('should render SearchBox component', () => {
    render(<Header />);
    expect(screen.getByTestId('search-box')).toBeInTheDocument();
  });

  it('should render VersionSwitcher component', () => {
    render(<Header />);
    expect(screen.getByTestId('version-switcher')).toBeInTheDocument();
  });

  it('should have logo as link to home page', () => {
    render(<Header />);
    const logoLink = screen.getByAltText('SilverStripe').closest('a');
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('should render GitHub link with href attribute', () => {
    render(<Header />);
    const githubLinks = screen.getAllByRole('link');
    const githubLink = githubLinks.find(link =>
      link.getAttribute('href') === 'https://github.com/silverstripe'
    );
    expect(githubLink).toBeInTheDocument();
  });

  it('should render HamburgerButton component', () => {
    render(<Header />);
    expect(screen.getByTestId('hamburger-button')).toBeInTheDocument();
  });

  it('should call onMobileMenuToggle when hamburger button is clicked', async () => {
    const mockToggle = jest.fn();
    const user = userEvent.setup();
    
    render(<Header onMobileMenuToggle={mockToggle} />);
    
    const hamburgerButton = screen.getByTestId('hamburger-button');
    await user.click(hamburgerButton);
    
    expect(mockToggle).toHaveBeenCalled();
  });

  it('should toggle hamburger state when clicked', async () => {
    const mockToggle = jest.fn();
    const user = userEvent.setup();
    
    const { rerender } = render(<Header onMobileMenuToggle={mockToggle} />);
    
    const hamburgerButton = screen.getByTestId('hamburger-button');
    
    // Initial state should be closed
    expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false');
    
    await user.click(hamburgerButton);
    
    // After first click, toggle should be called with true
    expect(mockToggle).toHaveBeenCalledWith(true);
  });
});

