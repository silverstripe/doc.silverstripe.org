import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter, usePathname } from 'next/navigation';
import { VersionSwitcher } from '@/components/VersionSwitcher';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

describe('VersionSwitcher Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (usePathname as jest.Mock).mockReturnValue('/en/6/getting-started/');
  });

  it('should render version selector', () => {
    render(
      <VersionSwitcher
        currentVersion="6"
        currentSlug="/en/6/getting-started/"
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });

  it('should display current version as selected', () => {
    render(
      <VersionSwitcher
        currentVersion="6"
        currentSlug="/en/6/getting-started/"
      />
    );

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('6');
  });

  it('should show all versions as options', () => {
    render(
      <VersionSwitcher
        currentVersion="6"
        currentSlug="/en/6/getting-started/"
      />
    );

    expect(screen.getByText(/6\.0 \(Current\)/)).toBeInTheDocument();
    expect(screen.getByText(/5\.0 \(Supported\)/)).toBeInTheDocument();
    expect(screen.getByText(/3\.0 \(End of Life\)/)).toBeInTheDocument();
  });

  it('should navigate when version is changed', () => {
    render(
      <VersionSwitcher
        currentVersion="6"
        currentSlug="/en/6/getting-started/"
      />
    );

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    fireEvent.change(select, { target: { value: '5' } });

    expect(mockPush).toHaveBeenCalledWith('/en/5/getting-started/');
  });

  it('should handle root version switch', () => {
    render(
      <VersionSwitcher
        currentVersion="6"
        currentSlug="/en/6/"
      />
    );

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    fireEvent.change(select, { target: { value: '5' } });

    expect(mockPush).toHaveBeenCalledWith('/en/5/');
  });

  it('should preserve path structure when switching versions', () => {
    render(
      <VersionSwitcher
        currentVersion="6"
        currentSlug="/en/6/developer-guides/model/data-types/"
      />
    );

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    fireEvent.change(select, { target: { value: '5' } });

    expect(mockPush).toHaveBeenCalledWith('/en/5/developer-guides/model/data-types/');
  });

  it('should have proper aria-label', () => {
    render(
      <VersionSwitcher
        currentVersion="6"
        currentSlug="/en/6/getting-started/"
      />
    );

    const select = screen.getByLabelText('Select documentation version');
    expect(select).toBeInTheDocument();
  });
});
