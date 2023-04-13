import React from 'react'
import { StatelessComponent, ReactElement } from 'react';
import { navigate } from "gatsby"
import useHierarchy from '../hooks/useHierarchy';
import { DocSearch } from '@docsearch/react';

import '@docsearch/css';

const makeUrlRelative = (url: string) => {
  // Use an anchor tag to parse the absolute url into a relative url
  // eslint-disable-next-line no-undef
  const a = document.createElement(`a`);
  a.href = url;
  return `${a.pathname}${a.hash}`;
};

const handleClick = (event: Event, url: string) => {
  event.preventDefault();
  navigate(url);
}

const SearchBox: StatelessComponent = (): ReactElement|null => {
    const { getCurrentVersion } = useHierarchy();

    return (
      <DocSearch
        appId={process.env.GATSBY_DOCSEARCH_APP_ID}
        indexName={process.env.GATSBY_DOCSEARCH_INDEX}
        apiKey={process.env.GATSBY_DOCSEARCH_API_KEY}
        disableUserPersonalization
        searchParameters={{
          facetFilters: [
            `version:${getCurrentVersion()}`,
          ],
          hitsPerPage: 5,
        }}
        // Overrides the behaviour of pressing "enter" on a search result
        navigator={{
          navigate: ({ itemUrl }) => navigate(makeUrlRelative(itemUrl)),
        }}
        // Overrides the link container for search results so we can use gatsby navigation instead of full page loads
        hitComponent={({ hit, children }) => {
          const relativeUrl = makeUrlRelative(hit.url);
          // We can't use a gatsby <Link> component here - for some reason it makes the links disappear on hover
          return <a onClick={(e) => handleClick(e, relativeUrl)} href={relativeUrl}>{children}</a>
        }}
      />
    );
};

export default SearchBox;
