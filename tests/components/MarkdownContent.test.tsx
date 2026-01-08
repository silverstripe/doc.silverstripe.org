import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MarkdownContent } from '@/components/MarkdownContent';

describe('MarkdownContent', () => {
  describe('Basic Rendering', () => {
    it('should render markdown content as HTML', () => {
      const html = '<p>Hello World</p>';
      render(<MarkdownContent html={html} />);

      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('should render multiple paragraphs', () => {
      const html = '<p>First paragraph</p><p>Second paragraph</p>';
      render(<MarkdownContent html={html} />);

      expect(screen.getByText('First paragraph')).toBeInTheDocument();
      expect(screen.getByText('Second paragraph')).toBeInTheDocument();
    });

    it('should preserve HTML structure', () => {
      const html = '<h1>Title</h1><p>Description</p>';
      render(<MarkdownContent html={html} />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Title');
      expect(screen.getByText('Description')).toBeInTheDocument();
    });
  });

  describe('Table Rendering', () => {
    it('should render tables with proper structure', () => {
      const html = `
        <table>
          <thead>
            <tr>
              <th>Header 1</th>
              <th>Header 2</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Data 1</td>
              <td>Data 2</td>
            </tr>
          </tbody>
        </table>
      `;
      render(<MarkdownContent html={html} />);

      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByText('Header 1')).toBeInTheDocument();
      expect(screen.getByText('Data 1')).toBeInTheDocument();
    });

    it('should render multiple rows in table', () => {
      const html = `
        <table>
          <tbody>
            <tr>
              <td>Row 1 Cell 1</td>
              <td>Row 1 Cell 2</td>
            </tr>
            <tr>
              <td>Row 2 Cell 1</td>
              <td>Row 2 Cell 2</td>
            </tr>
          </tbody>
        </table>
      `;
      render(<MarkdownContent html={html} />);

      expect(screen.getByText('Row 1 Cell 1')).toBeInTheDocument();
      expect(screen.getByText('Row 2 Cell 1')).toBeInTheDocument();
    });

    it('should support complex table content', () => {
      const html = `
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>field1</code></td>
              <td><strong>string</strong></td>
              <td>A sample field</td>
            </tr>
          </tbody>
        </table>
      `;
      render(<MarkdownContent html={html} />);

      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByText('field1')).toBeInTheDocument();
      expect(screen.getByText('string')).toBeInTheDocument();
    });
  });

  describe('Mixed Content', () => {
    it('should render text and tables together', () => {
      const html = `
        <p>Introduction text</p>
        <table>
          <tr>
            <td>Table data</td>
          </tr>
        </table>
        <p>Conclusion text</p>
      `;
      render(<MarkdownContent html={html} />);

      expect(screen.getByText('Introduction text')).toBeInTheDocument();
      expect(screen.getByText('Table data')).toBeInTheDocument();
      expect(screen.getByText('Conclusion text')).toBeInTheDocument();
    });

    it('should not affect non-table markdown', () => {
      const html = `
        <h2>Section Title</h2>
        <p>Regular paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
        <ul>
          <li>List item 1</li>
          <li>List item 2</li>
        </ul>
      `;
      render(<MarkdownContent html={html} />);

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Section Title');
      expect(screen.getByText((content, element) => content.includes('Regular paragraph with'))).toBeInTheDocument();
      expect(screen.getByText('bold')).toBeInTheDocument();
      expect(screen.getByText('italic')).toBeInTheDocument();
      expect(screen.getByText('List item 1')).toBeInTheDocument();
    });

    it('should render code blocks alongside tables', () => {
      const html = `
        <p>Here is a code example:</p>
        <pre><code>const x = 42;</code></pre>
        <p>And here is a table:</p>
        <table>
          <tr>
            <td>Value</td>
          </tr>
        </table>
      `;
      render(<MarkdownContent html={html} />);

      expect(screen.getByText('Here is a code example:')).toBeInTheDocument();
      expect(screen.getByText('const x = 42;')).toBeInTheDocument();
      expect(screen.getByText('And here is a table:')).toBeInTheDocument();
      expect(screen.getByText('Value')).toBeInTheDocument();
    });
  });

  describe('CSS Classes and Styling', () => {
    it('should apply markdownContent class to wrapper', () => {
      const html = '<p>Content</p>';
      const { container } = render(<MarkdownContent html={html} />);

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('markdownContent');
    });

    it('should preserve HTML attributes in rendered content', () => {
      const html = '<p id="intro" class="custom-class">Introduction</p>';
      const { container } = render(<MarkdownContent html={html} />);

      const paragraph = container.querySelector('#intro');
      expect(paragraph).toHaveClass('custom-class');
      expect(paragraph).toHaveTextContent('Introduction');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty HTML content', () => {
      const html = '';
      const { container } = render(<MarkdownContent html={html} />);

      expect(container.querySelector('.markdownContent')).toBeInTheDocument();
    });

    it('should handle whitespace-only content', () => {
      const html = '   \n   \t   ';
      const { container } = render(<MarkdownContent html={html} />);

      expect(container.querySelector('.markdownContent')).toBeInTheDocument();
    });

    it('should handle deeply nested HTML', () => {
      const html = `
        <div>
          <section>
            <article>
              <p>Deeply nested content</p>
            </article>
          </section>
        </div>
      `;
      render(<MarkdownContent html={html} />);

      expect(screen.getByText('Deeply nested content')).toBeInTheDocument();
    });

    it('should render HTML entities correctly', () => {
      const html = '<p>&lt;tag&gt; &amp; "quotes"</p>';
      render(<MarkdownContent html={html} />);

      expect(screen.getByText((content) => content.includes('<tag>'))).toBeInTheDocument();
    });
  });

  describe('Changelog and Real-world Scenarios', () => {
    it('should handle changelog-style tables with version info', () => {
      const html = `
        <h2>Changelog</h2>
        <table>
          <thead>
            <tr>
              <th>Version</th>
              <th>Release Date</th>
              <th>Changes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1.0.0</td>
              <td>2024-01-01</td>
              <td>Initial release</td>
            </tr>
          </tbody>
        </table>
      `;
      render(<MarkdownContent html={html} />);

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Changelog');
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByText('1.0.0')).toBeInTheDocument();
    });

    it('should preserve table structure with multiple headers', () => {
      const html = `
        <table>
          <thead>
            <tr>
              <th>Col 1</th>
              <th>Col 2</th>
              <th>Col 3</th>
              <th>Col 4</th>
              <th>Col 5</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>A</td>
              <td>B</td>
              <td>C</td>
              <td>D</td>
              <td>E</td>
            </tr>
          </tbody>
        </table>
      `;
      render(<MarkdownContent html={html} />);

      const headers = screen.getAllByText(/Col \d/);
      expect(headers).toHaveLength(5);
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should maintain semantic HTML for tables', () => {
      const html = `
        <table>
          <thead>
            <tr>
              <th>Header</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Data</td>
            </tr>
          </tbody>
        </table>
      `;
      const { container } = render(<MarkdownContent html={html} />);

      const table = container.querySelector('table');
      const thead = table?.querySelector('thead');
      const tbody = table?.querySelector('tbody');

      expect(table).toBeInTheDocument();
      expect(thead).toBeInTheDocument();
      expect(tbody).toBeInTheDocument();
    });

    it('should preserve heading hierarchy', () => {
      const html = `
        <h1>H1</h1>
        <h2>H2</h2>
        <h3>H3</h3>
      `;
      render(<MarkdownContent html={html} />);

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
    });

    it('should preserve list semantics', () => {
      const html = `
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
        <ol>
          <li>First</li>
          <li>Second</li>
        </ol>
      `;
      render(<MarkdownContent html={html} />);

      const lists = screen.getAllByRole('list');
      expect(lists).toHaveLength(2);
      const listItems = screen.getAllByRole('listitem');
      expect(listItems.length).toBeGreaterThanOrEqual(4);
    });
  });
});
