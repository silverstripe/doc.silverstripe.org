import React, { StatelessComponent } from 'react';
import { CalloutBlockProps } from '../types';


const getCalloutClass = (type: string): string => {
    switch (type) {
        case 'TIP':
            return 'success';
        case 'IMPORTANT':
        case 'WARNING':
            return 'warning';
        case 'CAUTION':
            return 'danger';
        case 'NOTE':
            return 'info'
        default:
            return 'info';
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