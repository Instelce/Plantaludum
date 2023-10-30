import { Option } from "./index.jsx";
import "./style.scss"

export default {
  title: "Components/Forms/Dropdown/Option",
  component: Option,
};

export const Default = {
  args: {
    active: false,
    children: "option ...",
  },
};
