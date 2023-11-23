import classNames from "classnames";
import PropTypes from "prop-types";
import "./style.scss";

function Option({value=null, active, children, ...props}) {
  return <button type="button" className={classNames("option", {active: active})} {...props}>
    {children}
  </button>
}

Option.propTypes = {
  value: PropTypes.string || PropTypes.number,
  active: PropTypes.bool,
  children: PropTypes.node,
}

export default Option;