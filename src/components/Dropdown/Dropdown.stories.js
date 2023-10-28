import Dropdown, {Option} from "./index.jsx";
import './style.scss'

export default {
    component: Dropdown,
}

export const Default = {
    args: {
        children: `<div>
            <Option >1</Option>
            <Option >2</Option>
            <Option >3</Option>
        </div>`
    }
}