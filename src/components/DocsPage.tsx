import React, { StatelessComponent } from 'react';
import { SilverstripeDocument } from '../types';
import SEO from './SEO';
import parseHTML from '../utils/parseHTML';

interface DocsPageProps {
    title: string;
    html: string;
    relPath: string;
    branch: string;
    gitURL: string;
};

const DocsPage: StatelessComponent<DocsPageProps> = ({ title, html, branch, relPath, gitURL }): ReactElement => {
    const editLink = `${gitURL}/edit/${branch}/${relPath}`;

    return (
        <>
          <SEO title={title} />
          {parseHTML(html)}
          {editLink && 
          <div className="github-edit">
            <a target="_blank" href={editLink} title="Edit on Github">
              <i className="fas fa-pen fa-fw" />{` `}
              Edit on Github
            </a>
          </div>
          }
    
    
        </>
        );
};

export default DocsPage;