import { generateStaticParams } from '@/app/en/[version]/[[...slug]]/page';
import { getAllDocuments } from '@/lib/content/get-document';

describe('Routing - generateStaticParams', () => {
  it('should generate params for all documents', async () => {
    const params = await generateStaticParams();
    
    // Should have multiple routes
    expect(params.length).toBeGreaterThan(0);
  });

  it('should include root version routes', async () => {
    const params = await generateStaticParams();
    
    const v5Root = params.find(p => p.version === '5' && !p.slug);
    const v6Root = params.find(p => p.version === '6' && !p.slug);
    
    expect(v5Root).toBeDefined();
    expect(v6Root).toBeDefined();
  });

  it('should include nested routes', async () => {
    const params = await generateStaticParams();
    
    const nested = params.find(
      p => p.version === '6' && p.slug?.includes('getting-started')
    );
    
    expect(nested).toBeDefined();
  });

  it('should match all documents', async () => {
    const params = await generateStaticParams();
    const docs = await getAllDocuments();
    
    // Should have a param for each document
    expect(params.length).toBe(docs.length);
  });

  it('should have correct structure', async () => {
    const params = await generateStaticParams();
    
    params.forEach(param => {
      expect(param).toHaveProperty('version');
      expect(typeof param.version).toBe('string');
      
      if (param.slug) {
        expect(Array.isArray(param.slug)).toBe(true);
        expect(param.slug.length).toBeGreaterThan(0);
      }
    });
  });

  it('should not have duplicate routes', async () => {
    const params = await generateStaticParams();
    const seen = new Set<string>();
    
    const duplicates = params.filter(p => {
      const key = `${p.version}:${(p.slug || []).join('/')}`;
      if (seen.has(key)) return true;
      seen.add(key);
      return false;
    });
    
    expect(duplicates).toHaveLength(0);
  });
});

describe('Routing - URL Patterns', () => {
  it('should generate /en/6/ for root', async () => {
    const params = await generateStaticParams();
    const root = params.find(p => p.version === '6' && !p.slug);
    
    // Root should have no slug
    expect(root?.slug).toBeUndefined();
  });

  it('should generate /en/6/getting-started/', async () => {
    const params = await generateStaticParams();
    const route = params.find(
      p => p.version === '6' && p.slug?.[0] === 'getting-started'
    );
    
    expect(route).toBeDefined();
  });

  it('should generate /en/6/optional-features/linkfield/', async () => {
    const params = await generateStaticParams();
    const route = params.find(
      p => p.version === '6' && 
           p.slug?.includes('optional-features') &&
           p.slug?.includes('linkfield')
    );
    
    expect(route).toBeDefined();
  });

  it('should normalize paths (no numeric prefixes, lowercase, hyphens)', async () => {
    const params = await generateStaticParams();
    
    params.forEach(p => {
      if (p.slug) {
        p.slug.forEach(segment => {
          // No numeric prefixes
          expect(segment).not.toMatch(/^\d+/);
          // Lowercase
          expect(segment).toBe(segment.toLowerCase());
          // No underscores
          expect(segment).not.toContain('_');
        });
      }
    });
  });
});
