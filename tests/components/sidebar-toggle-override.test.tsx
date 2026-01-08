import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Sidebar } from '@/components/Sidebar';
import { NavNode } from '@/types/types';

jest.mock('next/link', () => {
  return ({ children, href, className }: any) => (
    <a href={href} className={className} onClick={(e) => e.preventDefault()}>
      {children}
    </a>
  );
});

describe('Sidebar Toggle Override', () => {
  const mockNavTree: NavNode[] = [
    {
      slug: '/en/6/section_a/',
      title: 'Section A',
      isIndex: true,
      isActive: false,
      hasVisibleChildren: true,
      children: [
        {
          slug: '/en/6/section_a/page_a1/',
          title: 'Page A1',
          isIndex: false,
          isActive: false,
          hasVisibleChildren: false,
          children: [],
        },
      ],
    },
    {
      slug: '/en/6/section_b/',
      title: 'Section B',
      isIndex: true,
      isActive: false,
      hasVisibleChildren: true,
      children: [
        {
          slug: '/en/6/section_b/page_b1/',
          title: 'Page B1',
          isIndex: false,
          isActive: true,
          hasVisibleChildren: false,
          children: [],
        },
      ],
    },
  ];

  it('should auto-expand parent on nested page load', () => {
    render(<Sidebar navTree={mockNavTree} currentSlug="/en/6/section_b/page_b1/" />);

    const sectionBButton = screen.getByLabelText('Toggle Section B');
    expect(sectionBButton).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Page B1')).toBeInTheDocument();
  });

  it('should allow closing auto-expanded parent by clicking toggle (manually closed ancestors stay closed when navigating away)', async () => {
    const { rerender } = render(
      <Sidebar navTree={mockNavTree} currentSlug="/en/6/section_b/page_b1/" />
    );

    // Page B1 should be visible (parent auto-expanded)
    expect(screen.getByText('Page B1')).toBeInTheDocument();

    // Click the toggle to close Section B
    const sectionBButton = screen.getByLabelText('Toggle Section B');
    fireEvent.click(sectionBButton);

    // Page B1 should now be hidden
    await waitFor(() => {
      expect(screen.queryByText('Page B1')).not.toBeInTheDocument();
    });

    // Button should now show collapsed
    expect(sectionBButton).toHaveAttribute('aria-expanded', 'false');

    // Navigate away to Section A
    rerender(<Sidebar navTree={mockNavTree} currentSlug="/en/6/section_a/page_a1/" />);

    // Section B should STILL be closed (manual toggle persists)
    const updatedSectionBButton = screen.getByLabelText('Toggle Section B');
    expect(updatedSectionBButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Page B1')).not.toBeInTheDocument();
  });

  it('should allow opening non-ancestor sections', async () => {
    render(<Sidebar navTree={mockNavTree} currentSlug="/en/6/section_b/page_b1/" />);

    // Section A should be closed (not an ancestor)
    expect(screen.queryByText('Page A1')).not.toBeInTheDocument();

    // Click to open Section A
    const sectionAButton = screen.getByLabelText('Toggle Section A');
    fireEvent.click(sectionAButton);

    // Page A1 should now be visible
    await waitFor(() => {
      expect(screen.getByText('Page A1')).toBeInTheDocument();
    });

    expect(sectionAButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('should keep manual toggles persistent across navigation', async () => {
    const { rerender } = render(
      <Sidebar navTree={mockNavTree} currentSlug="/en/6/section_b/page_b1/" />
    );

    // Close Section B manually
    const sectionBButton = screen.getByLabelText('Toggle Section B');
    fireEvent.click(sectionBButton);

    await waitFor(() => {
      expect(sectionBButton).toHaveAttribute('aria-expanded', 'false');
    });

    // Open Section A manually (it's not an ancestor)
    const sectionAButton = screen.getByLabelText('Toggle Section A');
    fireEvent.click(sectionAButton);

    await waitFor(() => {
      expect(sectionAButton).toHaveAttribute('aria-expanded', 'true');
    });

    // Navigate to a page in Section A
    rerender(<Sidebar navTree={mockNavTree} currentSlug="/en/6/section_a/page_a1/" />);

    // Section A should now ALSO be auto-expanded (it's an ancestor)
    const updatedSectionAButton = screen.getByLabelText('Toggle Section A');
    expect(updatedSectionAButton).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Page A1')).toBeInTheDocument();

    // Section B should remain closed (manual toggle persists)
    const updatedSectionBButton = screen.getByLabelText('Toggle Section B');
    expect(updatedSectionBButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Page B1')).not.toBeInTheDocument();
  });

  it('should allow toggling multiple sections independently', async () => {
    render(<Sidebar navTree={mockNavTree} currentSlug="/en/6/section_b/page_b1/" />);

    const sectionAButton = screen.getByLabelText('Toggle Section A');
    const sectionBButton = screen.getByLabelText('Toggle Section B');

    // Initially: A closed, B open (auto-expanded)
    expect(sectionAButton).toHaveAttribute('aria-expanded', 'false');
    expect(sectionBButton).toHaveAttribute('aria-expanded', 'true');

    // Open A
    fireEvent.click(sectionAButton);
    await waitFor(() => {
      expect(screen.getByText('Page A1')).toBeInTheDocument();
    });

    // Close B
    fireEvent.click(sectionBButton);
    await waitFor(() => {
      expect(screen.queryByText('Page B1')).not.toBeInTheDocument();
    });

    // Both should reflect new state
    expect(sectionAButton).toHaveAttribute('aria-expanded', 'true');
    expect(sectionBButton).toHaveAttribute('aria-expanded', 'false');
  });
});
