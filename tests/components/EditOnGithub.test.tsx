import { render, screen } from '@testing-library/react';
import EditOnGithub from '../../src/components/EditOnGithub';

describe('EditOnGithub component', () => {
  it('generates correct URL for main docs v6', () => {
    render(
      <EditOnGithub
        version="6"
        filePath="02_Developer_Guides/index.md"
        category="docs"
      />
    );

    const link = screen.getByRole('link', { name: /edit on github/i });
    expect(link).toHaveAttribute(
      'href',
      'https://github.com/silverstripe/developer-docs/blob/6.1/en/02_Developer_Guides/index.md'
    );
  });

  it('generates correct URL for main docs v5', () => {
    render(
      <EditOnGithub
        version="5"
        filePath="02_Developer_Guides/index.md"
        category="docs"
      />
    );

    const link = screen.getByRole('link', { name: /edit on github/i });
    expect(link).toHaveAttribute(
      'href',
      'https://github.com/silverstripe/developer-docs/blob/5.4/en/02_Developer_Guides/index.md'
    );
  });

  it('generates correct URL for optional feature linkfield v6', () => {
    render(
      <EditOnGithub
        version="6"
        filePath="index.md"
        category="docs"
        optionalFeature="linkfield"
      />
    );

    const link = screen.getByRole('link', { name: /edit on github/i });
    expect(link).toHaveAttribute(
      'href',
      'https://github.com/silverstripe/silverstripe-linkfield/blob/5.1/docs/en/index.md'
    );
  });

  it('generates correct URL for optional feature linkfield v5', () => {
    render(
      <EditOnGithub
        version="5"
        filePath="index.md"
        category="docs"
        optionalFeature="linkfield"
      />
    );

    const link = screen.getByRole('link', { name: /edit on github/i });
    expect(link).toHaveAttribute(
      'href',
      'https://github.com/silverstripe/silverstripe-linkfield/blob/4.2/docs/en/index.md'
    );
  });

  it('generates correct URL for optional feature staticpublishqueue', () => {
    render(
      <EditOnGithub
        version="6"
        filePath="index.md"
        category="docs"
        optionalFeature="staticpublishqueue"
      />
    );

    const link = screen.getByRole('link', { name: /edit on github/i });
    expect(link).toHaveAttribute(
      'href',
      'https://github.com/silverstripe/silverstripe-staticpublishqueue/blob/7.0/docs/en/index.md'
    );
  });

  it('generates correct URL for optional feature with nested path', () => {
    render(
      <EditOnGithub
        version="6"
        filePath="02_Configuration/index.md"
        category="docs"
        optionalFeature="staticpublishqueue"
      />
    );

    const link = screen.getByRole('link', { name: /edit on github/i });
    expect(link).toHaveAttribute(
      'href',
      'https://github.com/silverstripe/silverstripe-staticpublishqueue/blob/7.0/docs/en/02_Configuration/index.md'
    );
  });

  it('generates correct URL for user category', () => {
    render(
      <EditOnGithub
        version="6"
        filePath="user_help/index.md"
        category="user"
      />
    );

    const link = screen.getByRole('link', { name: /edit on github/i });
    expect(link).toHaveAttribute(
      'href',
      'https://github.com/silverstripe/userhelp-docs/edit/master/user_help/index.md'
    );
  });

  it('renders link with correct text', () => {
    render(
      <EditOnGithub
        version="6"
        filePath="admin/index.md"
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
        filePath="api/index.md"
        category="docs"
      />
    );

    const link = screen.getByRole('link', { name: /edit on github/i });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('handles advancedworkflow with correct branch for v6', () => {
    render(
      <EditOnGithub
        version="6"
        filePath="index.md"
        category="docs"
        optionalFeature="advancedworkflow"
      />
    );

    const link = screen.getByRole('link', { name: /edit on github/i });
    expect(link).toHaveAttribute(
      'href',
      'https://github.com/silverstripe/silverstripe-advancedworkflow/blob/7.1/docs/en/index.md'
    );
  });

  it('handles advancedworkflow with correct branch for v5', () => {
    render(
      <EditOnGithub
        version="5"
        filePath="index.md"
        category="docs"
        optionalFeature="advancedworkflow"
      />
    );

    const link = screen.getByRole('link', { name: /edit on github/i });
    expect(link).toHaveAttribute(
      'href',
      'https://github.com/silverstripe/silverstripe-advancedworkflow/blob/6.4/docs/en/index.md'
    );
  });

  it('handles fluent with correct owner for v6', () => {
    render(
      <EditOnGithub
        version="6"
        filePath="index.md"
        category="docs"
        optionalFeature="fluent"
      />
    );

    const link = screen.getByRole('link', { name: /edit on github/i });
    expect(link).toHaveAttribute(
      'href',
      'https://github.com/tractorcow/silverstripe-fluent/blob/8.1/docs/en/index.md'
    );
  });

  it('handles fluent with correct owner for v5', () => {
    render(
      <EditOnGithub
        version="5"
        filePath="index.md"
        category="docs"
        optionalFeature="fluent"
      />
    );

    const link = screen.getByRole('link', { name: /edit on github/i });
    expect(link).toHaveAttribute(
      'href',
      'https://github.com/tractorcow-farm/silverstripe-fluent/blob/7.3/docs/en/index.md'
    );
  });
});
