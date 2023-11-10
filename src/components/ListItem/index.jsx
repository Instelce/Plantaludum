import {Trash2} from "react-feather";
import "./style.scss"

function ListItem({title, img = null, removeFunc = null, ...props}) {
  return <div className="list-item" {...props}>
    {img && <div className="list-img">
      <img src={img} alt="img"/>
    </div>}

    <div className="list-title">
      <h3>{title}</h3>
      {removeFunc && <span onClick={removeFunc}>
        <Trash2 color="rgb(var(--color-danger))" />
      </span>}
    </div>

  </div>;
}

export default ListItem;