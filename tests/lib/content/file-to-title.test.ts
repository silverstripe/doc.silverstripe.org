import { fileToTitle } from '@/lib/content/file-to-title';

describe('file-to-title', () => {
  describe('fileToTitle', () => {
    it('strips numeric prefixes', () => {
      expect(fileToTitle('01_getting_started')).toBe('Getting Started');
      expect(fileToTitle('02_advanced_options')).toBe('Advanced Options');
      expect(fileToTitle('10_model_data_types')).toBe('Model Data Types');
    });

    it('converts underscores to spaces', () => {
      expect(fileToTitle('getting_started')).toBe('Getting Started');
      expect(fileToTitle('advanced_config_options')).toBe('Advanced Config Options');
    });

    it('applies title case', () => {
      expect(fileToTitle('hello_world')).toBe('Hello World');
      expect(fileToTitle('MY_DOCUMENT')).toBe('My Document');
      expect(fileToTitle('mixedCase_example')).toBe('Mixedcase Example');
    });

    it('handles index files with parentDir', () => {
      expect(fileToTitle('index', '/path/to/01_Getting_Started')).toBe('Getting Started');
      expect(fileToTitle('index', '/path/to/02_Advanced')).toBe('Advanced');
    });

    it('handles single word filenames', () => {
      expect(fileToTitle('installation')).toBe('Installation');
      expect(fileToTitle('01_installation')).toBe('Installation');
    });

    it('handles files without numeric prefix', () => {
      expect(fileToTitle('getting_started')).toBe('Getting Started');
      expect(fileToTitle('my_document')).toBe('My Document');
    });

    it('combines rules correctly', () => {
      // 01_Getting_Started -> strips 01_, converts _ to space, applies title case
      expect(fileToTitle('01_Getting_Started')).toBe('Getting Started');
      expect(fileToTitle('02_Model_Data_Types')).toBe('Model Data Types');
    });

    it('handles multiple underscores', () => {
      expect(fileToTitle('my_long_file_name')).toBe('My Long File Name');
    });

    it('ignores parentDir if filename is not index', () => {
      expect(fileToTitle('getting_started', '/path/to/docs')).toBe('Getting Started');
    });
  });
});
