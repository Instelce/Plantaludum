
import "./index.jsx"
import ChoiceBlock from "./index.jsx";


export default {
    title: 'Components/ChoiceBlock',
    component: ChoiceBlock,
    parameters: {
        layout: "centered",
    },
    argTypes: {
        onDoubleClick: {action: 'showResult'},
    },
    tags: ['autodocs'],
}


export const Default = {
    args: {
        choice: {
            title: "Title",
            subtitle: "Sub",
            rightAwnser: false
        },
        showResult: false,
    }
}