import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import NotFound from '@/app/not-found';

// Mock the redirect pattern matching
jest.mock('@/lib/utils/redirect-patterns', () => ({
  matchRedirectPattern: jest.fn(() => null),
}));

describe('NotFound component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.location
    delete (window as any).location;
    window.location = { href: '' } as any;
  });

  it('should render 404 heading', async () => {
    render(<NotFound />);

    await waitFor(() => {
      const heading = screen.queryByText('404 - Page Not Found');
      expect(heading).toBeInTheDocument();
    });
  });

  it('should render error message', async () => {
    render(<NotFound />);

    await waitFor(() => {
      const message = screen.queryByText('The page you are looking for does not exist.');
      expect(message).toBeInTheDocument();
    });
  });

  it('should render link to default version documentation', async () => {
    render(<NotFound />);

    await waitFor(() => {
      const link = screen.queryByRole('link', {
        name: /Go to Latest Documentation/i,
      });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', expect.stringContaining('/en/'));
    });
  });

  it('should not have inline styles on rendered elements', async () => {
    render(<NotFound />);

    await waitFor(() => {
      const main = screen.queryByRole('main');
      const heading = screen.queryByText('404 - Page Not Found');
      const message = screen.queryByText('The page you are looking for does not exist.');
      const link = screen.queryByRole('link', {
        name: /Go to Latest Documentation/i,
      });

      // Verify no inline style attributes
      expect(main).not.toHaveAttribute('style');
      expect(heading).not.toHaveAttribute('style');
      expect(message).not.toHaveAttribute('style');
      expect(link).not.toHaveAttribute('style');
    });
  });

  it('should use CSS module classes instead of inline styles', async () => {
    const { container } = render(<NotFound />);

    await waitFor(() => {
      const main = container.querySelector('main');
      const heading = screen.queryByText('404 - Page Not Found');
      const message = screen.queryByText('The page you are looking for does not exist.');
      const link = screen.queryByRole('link', {
        name: /Go to Latest Documentation/i,
      });

      // Verify classes are applied from CSS modules
      expect(main?.className).toContain('main');
      expect(heading?.className).toContain('title');
      expect(message?.className).toContain('message');
      expect(link?.className).toContain('link');
    });
  });
});
