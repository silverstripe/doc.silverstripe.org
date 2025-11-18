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
    const { getByTestId, getByText } = render(<Header />);
    
    expect(getByTestId('search-box')).toBeInTheDocument();
    expect(getByText('SilverStripe')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    const { getByText } = render(<Header />);
    
    expect(getByText('Home')).toBeInTheDocument();
  });

  it('renders version switcher', () => {
    const { getByTestId } = render(<Header />);
    
    expect(getByTestId('version-switcher')).toBeInTheDocument();
  });
});
