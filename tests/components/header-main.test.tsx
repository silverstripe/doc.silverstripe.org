/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { Header } from '@/components/Header';

jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>;
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

jest.mock('@/components/logos/CmsDevLogo', () => ({
  __esModule: true,
  default: () => <svg data-testid="logo-cms-dev" />,
}));

jest.mock('@/components/logos/CmsUserLogo', () => ({
  __esModule: true,
  default: () => <svg data-testid="logo-cms-user" />,
}));

jest.mock('@/components/logos/SearchUserLogo', () => ({
  __esModule: true,
  default: () => <svg data-testid="logo-search-user" />,
}));

describe('Header Component', () => {
  it('renders header element', () => {
    const { container } = render(<Header docsContext="docs" />);

    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
  });

  it('does not render Home link', () => {
    const { queryByText } = render(<Header docsContext="docs" />);

    expect(queryByText('Home')).not.toBeInTheDocument();
  });

  it('renders GitHub icon link', () => {
    const { container } = render(<Header docsContext="docs" />);
    const githubIcon = container.querySelector('.fab.fa-github');

    expect(githubIcon).toBeInTheDocument();
  });

  it('renders version switcher', () => {
    const { getByTestId } = render(<Header docsContext="docs" />);

    expect(getByTestId('version-switcher')).toBeInTheDocument();
  });

  it('renders the CmsDevLogo for docs context', () => {
    const { getByTestId } = render(<Header docsContext="docs" />);

    expect(getByTestId('logo-cms-dev')).toBeInTheDocument();
  });

  it('renders the CmsUserLogo for user context', () => {
    const { getByTestId } = render(<Header docsContext="user" />);

    expect(getByTestId('logo-cms-user')).toBeInTheDocument();
  });

  it('renders the SearchUserLogo for search context', () => {
    const { getByTestId } = render(<Header docsContext="search" />);

    expect(getByTestId('logo-search-user')).toBeInTheDocument();
  });
});
