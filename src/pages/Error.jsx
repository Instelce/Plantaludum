import React from 'react';
import {
    useRouteError
} from "react-router-dom";

function Error(props) {
    const error = useRouteError()

    console.log(error)

    return (
        <>
            <h1>Oups</h1>
            <h2>{error.status} {error.statusText}</h2>
            <p>{error?.error?.toString() ?? error?.toString()}</p>
        </>
    );
}

export default Error;