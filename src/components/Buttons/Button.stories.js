// ButtonTest.stories.js

import Button from "./Button.jsx";


export default {
    title: 'Components/Button',
    component: Button,
    parameters: {
        layout: 'centered'
    },
    tags: ['autodocs']
}


export const Primary = {
    args: {
        label: 'Click',
        type: "button",
        color: 'primary',
        size: 'lg',
        variant: 'solid',
        disabled: false,
        fill: false,
    }
}


export const Warning = {
    args: {
        ...Primary.args,
        label: 'Delete',
        color: 'danger',
    }
};