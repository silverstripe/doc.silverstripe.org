import React, { StatelessComponent } from 'react';
import { CalloutBlockProps } from '../types';


const getCalloutClass = (type: string): string => {
    switch (type) {
        case 'hint':
            return 'success';
        case 'notice':
            return 'warning';
        case 'alert':
            return 'danger';
        case 'note':
            return 'info'
        default:
            return type;
    }
};

const CalloutBlock: StatelessComponent<CalloutBlockProps> = ({ type, content }) => {
    return (
        <div className={`callout-block callout-block-${getCalloutClass(type)}`}>
            <div className="content">{content}</div>
        </div>
    );

};

export default CalloutBlock;