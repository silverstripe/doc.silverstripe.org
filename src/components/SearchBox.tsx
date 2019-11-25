import React from 'react'
import { StatelessComponent, ReactElement, useEffect, useState } from 'react';
import { navigateTo } from "gatsby-link"
import { getCurrentVersion } from '../utils/nodes';

interface SearchBoxProps {
  identifier: string;
}

const autocompleteSelected = (e) => {
    e.stopPropagation()
    // Use an anchor tag to parse the absolute url (from autocomplete.js) into a relative url
    // eslint-disable-next-line no-undef
    const a = document.createElement(`a`)
    a.href = e._args[0].url
    navigateTo(`${a.pathname}${a.hash}`)
};

const SearchBox: StatelessComponent<SearchBoxProps> = ({ identifier }): ReactElement|null => {
    const [ isFocused, setFocus ] = useState(false);
    useEffect(() => {
        if (typeof window === 'undefined') return;

        window.addEventListener(
            `autocomplete:selected`,
            autocompleteSelected,
            true
        );
        if(window.docsearch){
            window.docsearch({ 
              algoliaOptions: {
                facetFilters: [`version:${getCurrentVersion()}`],
                hitsPerPage: 5,
              },
              apiKey: process.env.GATSBY_DOCSEARCH_API_KEY, 
              debug: true,
              indexName: process.env.GATSBY_DOCSEARCH_INDEX, 
              inputSelector: `#${identifier}`,
            });
          }
      
    }, []);

    const handleFocus = () => setFocus(true);
    const handleBlur = () => setFocus(false);
    

    return (
      <>
            <label className={ isFocused ? `hide` : `show` } htmlFor={identifier}>Search...</label>
            <input
                id={identifier}
                type="search"
                className="form-control search-input"
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
      </>
      )  
};

export default SearchBox;
