import { render, screen } from '@testing-library/react';
import EditOnGithub from '../../src/components/EditOnGithub';

describe('EditOnGithub component', () => {
  it('generates correct URL for docs category', () => {
    render(
      <EditOnGithub
        version="6"
        filePath="en/6/getting_started/index.md"
        category="docs"
      />
    );

    const link = screen.getByRole('link', { name: /edit on github/i });
    expect(link).toHaveAttribute(
      'href',
      'https://github.com/silverstripe/developer-docs/edit/6/en/6/getting_started/index.md'
    );
  });

  it('generates correct URL for user category', () => {
    render(
      <EditOnGithub
        version="6"
        filePath="en/6/user_help/index.md"
        category="user"
      />
    );

    const link = screen.getByRole('link', { name: /edit on github/i });
    expect(link).toHaveAttribute(
      'href',
      'https://github.com/silverstripe/userhelp-docs/edit/6/en/6/user_help/index.md'
    );
  });

  it('renders link with correct text', () => {
    render(
      <EditOnGithub
        version="6"
        filePath="en/6/admin/index.md"
        category="docs"
      />
    );

    const link = screen.getByRole('link', { name: /edit on github/i });
    expect(link).toBeInTheDocument();
    expect(link.textContent).toBe('Edit on GitHub');
  });

  it('opens link in new tab', () => {
    render(
      <EditOnGithub
        version="6"
        filePath="en/6/api/index.md"
        category="docs"
      />
    );

    const link = screen.getByRole('link', { name: /edit on github/i });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('handles different versions correctly', () => {
    const { rerender } = render(
      <EditOnGithub
        version="5"
        filePath="en/5/getting_started/index.md"
        category="docs"
      />
    );

    let link = screen.getByRole('link', { name: /edit on github/i });
    expect(link).toHaveAttribute(
      'href',
      expect.stringContaining('/edit/5/')
    );

    rerender(
      <EditOnGithub
        version="6"
        filePath="en/6/getting_started/index.md"
        category="docs"
      />
    );

    link = screen.getByRole('link', { name: /edit on github/i });
    expect(link).toHaveAttribute(
      'href',
      expect.stringContaining('/edit/6/')
    );
  });
});
