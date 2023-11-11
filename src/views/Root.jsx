import React from 'react';
import {Outlet} from "react-router-dom";

function Root(props) {
    return (
        <Outlet />
    );
}

export default Root;