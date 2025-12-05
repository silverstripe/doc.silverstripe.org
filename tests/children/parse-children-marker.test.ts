import {
  parseChildrenMarker,
  findChildrenMarkers,
  ChildrenConfig,
} from '../../src/lib/children/parse-children-marker';

describe('parseChildrenMarker', () => {
  describe('basic [CHILDREN]', () => {
    it('parses simple [CHILDREN]', () => {
      const config = parseChildrenMarker('[CHILDREN]');
      expect(config).toEqual({});
    });

    it('returns null for non-matching text', () => {
      const config = parseChildrenMarker('No marker here');
      expect(config).toBeNull();
    });

    it('extracts [CHILDREN] from surrounding text', () => {
      const text = 'Here is some text [CHILDREN] and more text';
      const config = parseChildrenMarker(text);
      expect(config).toEqual({});
    });
  });

  describe('[CHILDREN asList]', () => {
    it('parses [CHILDREN asList]', () => {
      const config = parseChildrenMarker('[CHILDREN asList]');
      expect(config).toEqual({ asList: true });
    });

    it('parses asList flag with mixed case', () => {
      const config = parseChildrenMarker('[CHILDREN asList]');
      expect(config?.asList).toBe(true);
    });
  });

  describe('[CHILDREN Folder="..."]', () => {
    it('parses [CHILDREN Folder="model"]', () => {
      const config = parseChildrenMarker('[CHILDREN Folder="model"]');
      expect(config).toEqual({ folderName: 'model' });
    });

    it('parses Folder without quotes', () => {
      const config = parseChildrenMarker('[CHILDREN Folder=model]');
      expect(config).toEqual({ folderName: 'model' });
    });

    it('handles folder names with underscores', () => {
      const config = parseChildrenMarker('[CHILDREN Folder="api_reference"]');
      expect(config).toEqual({ folderName: 'api_reference' });
    });

    it('handles folder names with numbers', () => {
      const config = parseChildrenMarker('[CHILDREN Folder="v3_guides"]');
      expect(config).toEqual({ folderName: 'v3_guides' });
    });

    it('handles folder names with path separators', () => {
      const config = parseChildrenMarker('[CHILDREN Folder="api/v3"]');
      expect(config).toEqual({ folderName: 'api/v3' });
    });

    it('removes <em> tags from folder name', () => {
      const config = parseChildrenMarker('[CHILDREN Folder="<em>model</em>"]');
      expect(config).toEqual({ folderName: 'model' });
    });

    it('combines Folder with asList', () => {
      const config = parseChildrenMarker('[CHILDREN Folder="model" asList]');
      expect(config).toEqual({ folderName: 'model', asList: true });
    });

    it('combines Folder with reverse', () => {
      const config = parseChildrenMarker('[CHILDREN Folder="model" reverse]');
      expect(config).toEqual({ folderName: 'model', reverse: true });
    });

    it('combines Folder with all flags', () => {
      const config = parseChildrenMarker(
        '[CHILDREN Folder="model" asList reverse includeFolders]'
      );
      expect(config).toEqual({
        folderName: 'model',
        asList: true,
        reverse: true,
        includeFolders: true,
      });
    });
  });

  describe('[CHILDREN Exclude="..."]', () => {
    it('parses [CHILDREN Exclude="installation"]', () => {
      const config = parseChildrenMarker('[CHILDREN Exclude="installation"]');
      expect(config).toEqual({ exclude: ['installation'] });
    });

    it('parses multiple exclusions', () => {
      const config = parseChildrenMarker(
        '[CHILDREN Exclude="installation,composer"]'
      );
      expect(config).toEqual({ exclude: ['installation', 'composer'] });
    });

    it('trims whitespace in exclusion list', () => {
      const config = parseChildrenMarker(
        '[CHILDREN Exclude="item1, item2, item3"]'
      );
      expect(config).toEqual({ exclude: ['item1', 'item2', 'item3'] });
    });

    it('removes <em> tags from exclusions', () => {
      const config = parseChildrenMarker(
        '[CHILDREN Exclude="<em>installation</em>,composer"]'
      );
      expect(config).toEqual({ exclude: ['installation', 'composer'] });
    });

    it('combines Exclude with asList', () => {
      const config = parseChildrenMarker(
        '[CHILDREN Exclude="installation" asList]'
      );
      expect(config).toEqual({ exclude: ['installation'], asList: true });
    });

    it('combines Exclude with reverse', () => {
      const config = parseChildrenMarker(
        '[CHILDREN Exclude="installation" reverse]'
      );
      expect(config).toEqual({ exclude: ['installation'], reverse: true });
    });

    it('combines Exclude with includeFolders', () => {
      const config = parseChildrenMarker(
        '[CHILDREN Exclude="installation" includeFolders]'
      );
      expect(config).toEqual({
        exclude: ['installation'],
        includeFolders: true,
      });
    });
  });

  describe('[CHILDREN Only="..."]', () => {
    it('parses [CHILDREN Only="installation"]', () => {
      const config = parseChildrenMarker('[CHILDREN Only="installation"]');
      expect(config).toEqual({ only: ['installation'] });
    });

    it('parses multiple inclusions', () => {
      const config = parseChildrenMarker(
        '[CHILDREN Only="installation,composer"]'
      );
      expect(config).toEqual({ only: ['installation', 'composer'] });
    });

    it('trims whitespace in inclusion list', () => {
      const config = parseChildrenMarker(
        '[CHILDREN Only="item1, item2, item3"]'
      );
      expect(config).toEqual({ only: ['item1', 'item2', 'item3'] });
    });

    it('combines Only with asList', () => {
      const config = parseChildrenMarker('[CHILDREN Only="advanced" asList]');
      expect(config).toEqual({ only: ['advanced'], asList: true });
    });

    it('combines Only with reverse', () => {
      const config = parseChildrenMarker('[CHILDREN Only="advanced" reverse]');
      expect(config).toEqual({ only: ['advanced'], reverse: true });
    });
  });

  describe('[CHILDREN reverse]', () => {
    it('parses [CHILDREN reverse]', () => {
      const config = parseChildrenMarker('[CHILDREN reverse]');
      expect(config).toEqual({ reverse: true });
    });

    it('combines reverse with asList', () => {
      const config = parseChildrenMarker('[CHILDREN asList reverse]');
      expect(config).toEqual({ asList: true, reverse: true });
    });
  });

  describe('[CHILDREN includeFolders]', () => {
    it('parses [CHILDREN includeFolders]', () => {
      const config = parseChildrenMarker('[CHILDREN includeFolders]');
      expect(config).toEqual({ includeFolders: true });
    });

    it('combines includeFolders with asList', () => {
      const config = parseChildrenMarker(
        '[CHILDREN asList includeFolders]'
      );
      expect(config).toEqual({ asList: true, includeFolders: true });
    });

    it('combines includeFolders with reverse', () => {
      const config = parseChildrenMarker(
        '[CHILDREN includeFolders reverse]'
      );
      expect(config).toEqual({ includeFolders: true, reverse: true });
    });

    it('combines all flags', () => {
      const config = parseChildrenMarker(
        '[CHILDREN asList includeFolders reverse]'
      );
      expect(config).toEqual({
        asList: true,
        includeFolders: true,
        reverse: true,
      });
    });
  });

  describe('complex combinations', () => {
    it('parses [CHILDREN Folder="model" asList reverse]', () => {
      const config = parseChildrenMarker(
        '[CHILDREN Folder="model" asList reverse]'
      );
      expect(config).toEqual({
        folderName: 'model',
        asList: true,
        reverse: true,
      });
    });

    it('parses [CHILDREN Exclude="installation,composer" includeFolders]', () => {
      const config = parseChildrenMarker(
        '[CHILDREN Exclude="installation,composer" includeFolders]'
      );
      expect(config).toEqual({
        exclude: ['installation', 'composer'],
        includeFolders: true,
      });
    });

    it('parses [CHILDREN Only="advanced" asList reverse]', () => {
      const config = parseChildrenMarker(
        '[CHILDREN Only="advanced" asList reverse]'
      );
      expect(config).toEqual({
        only: ['advanced'],
        asList: true,
        reverse: true,
      });
    });
  });
});

describe('findChildrenMarkers', () => {
  it('finds single marker', () => {
    const text = 'Some text [CHILDREN] more text';
    const markers = findChildrenMarkers(text);
    expect(markers).toHaveLength(1);
    expect(markers[0].marker).toBe('[CHILDREN]');
    expect(markers[0].config).toEqual({});
  });

  it('finds multiple markers', () => {
    const text = 'Text [CHILDREN] middle [CHILDREN asList] end';
    const markers = findChildrenMarkers(text);
    expect(markers).toHaveLength(2);
    expect(markers[0].config).toEqual({});
    expect(markers[1].config).toEqual({ asList: true });
  });

  it('finds no markers', () => {
    const text = 'No markers here';
    const markers = findChildrenMarkers(text);
    expect(markers).toHaveLength(0);
  });

  it('finds markers with complex configurations', () => {
    const text = `
      First: [CHILDREN]
      Second: [CHILDREN Folder="model" asList]
      Third: [CHILDREN Exclude="item1,item2" reverse]
    `;
    const markers = findChildrenMarkers(text);
    expect(markers).toHaveLength(3);
  });

  it('preserves marker text', () => {
    const marker = '[CHILDREN Folder="test" asList reverse]';
    const text = `Some content ${marker} more`;
    const markers = findChildrenMarkers(text);
    expect(markers[0].marker).toBe(marker);
  });
});
