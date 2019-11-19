import React, { useEffect } from 'react'
import { navigate } from '@reach/router'

const IndexPage = () => {
    useEffect(() => {
        navigate('/en/4/');
    }, []);

    return <div />;
}

export default IndexPage;