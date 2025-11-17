/**
 * Integration test for image handling in markdown
 * Tests that images are properly found in mock content and referenced correctly
 */

import { getAllDocuments } from '@/lib/content/get-document';
import fs from 'fs';
import path from 'path';

describe('Image Handling Integration', () => {
  it('should find documents with image references in mock content', async () => {
    const docs = await getAllDocuments();
    
    // Find documents that reference images
    const docsWithImages = docs.filter(doc => 
      doc.content.includes('![')
    );
    
    expect(docsWithImages.length).toBeGreaterThan(0);
  });

  it('should have image files in mock content directories', () => {
    const imageDir = path.join(process.cwd(), 'tests/fixtures/mock-content/v6/_images');
    
    const files = fs.readdirSync(imageDir);
    expect(files.length).toBeGreaterThan(0);
    
    // Check for specific test images
    expect(files).toContain('screenshot.svg');
    expect(files).toContain('diagram.svg');
  });

  it('should have image references in Getting Started document', async () => {
    const docs = await getAllDocuments();
    
    const gettingStarted = docs.find(doc => 
      doc.slug?.includes('getting-started') && doc.version === '6' && doc.isIndex
    );
    
    expect(gettingStarted).toBeDefined();
    if (gettingStarted) {
      expect(gettingStarted.content).toContain('![');
      // Should reference images
      expect(gettingStarted.content).toContain('screenshot');
      expect(gettingStarted.content).toContain('diagram');
    }
  });

  it('should have nested image directory for developer guides', () => {
    const imageDir = path.join(process.cwd(), 'tests/fixtures/mock-content/v6/02_developer_guides/_images');
    
    const files = fs.readdirSync(imageDir);
    expect(files.length).toBeGreaterThan(0);
    expect(files).toContain('datatype-model.svg');
  });

  it('should have image reference in data types document', async () => {
    const docs = await getAllDocuments();
    
    const dataTypes = docs.find(doc => 
      doc.slug?.includes('data-types') && doc.version === '6'
    );
    
    expect(dataTypes).toBeDefined();
    if (dataTypes) {
      expect(dataTypes.content).toContain('![');
      expect(dataTypes.content).toContain('Data type model');
    }
  });
});

