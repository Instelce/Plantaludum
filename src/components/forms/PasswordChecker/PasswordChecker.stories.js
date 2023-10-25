// PasswordChecker.stories.js

import PasswordChecker from "./index.jsx";


export default {
    title: 'Components/PasswordChecker',
    component: PasswordChecker,
    parameters: {
        layout: "centered",
    },
    tags: ['autodocs'],
}


export const Default = {
    args: {
        password: "azerty"
    }
}