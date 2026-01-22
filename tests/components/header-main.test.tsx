/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { Header } from '@/components/Header';

jest.mock('next/link', () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>;
});

jest.mock('next/navigation', () => ({
  usePathname: () => '/en/6/getting_started/',
}));

jest.mock('@/components/SearchBox', () => ({
  SearchBox: () => <div data-testid="search-box">Mock SearchBox</div>,
}));

jest.mock('@/components/VersionSwitcher', () => ({
  VersionSwitcher: () => <div data-testid="version-switcher">Mock VersionSwitcher</div>,
}));

describe('Header Component', () => {
  it('renders header with SearchBox', () => {
    const { getByTestId, getByText } = render(<Header docsContext="docs" />);
    
    expect(getByTestId('search-box')).toBeInTheDocument();
    expect(getByText('Silverstripe CMS')).toBeInTheDocument();
  });

  it('does not render Home link', () => {
    const { queryByText } = render(<Header docsContext="docs" />);
    
    expect(queryByText('Home')).not.toBeInTheDocument();
  });

  it('renders GitHub icon with larger size', () => {
    const { container } = render(<Header docsContext="docs" />);
    const githubIcon = container.querySelector('.fab.fa-github');
    
    expect(githubIcon).toBeInTheDocument();
    expect(githubIcon).toHaveClass('githubIcon');
  });

  it('renders version switcher', () => {
    const { getByTestId } = render(<Header docsContext="docs" />);
    
    expect(getByTestId('version-switcher')).toBeInTheDocument();
  });

  it('renders logo image with correct src', () => {
    const { getByAltText } = render(<Header docsContext="docs" />);
    const logoImg = getByAltText('Silverstripe');
    
    expect(logoImg).toHaveAttribute('src', '/logo.svg');
  });
});
