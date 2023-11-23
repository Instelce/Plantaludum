import {Trash2} from "react-feather";
import "./style.scss"

function ListItem({title, img = null, removeFunc = null, ...props}) {
  return <div className="list-item" {...props}>
    {img && <div className="list-img">
      <img src={img} alt="img"/>
    </div>}

    <div className="list-title">
      <h3>{title}</h3>
      {removeFunc && <button className="remove-button" onClick={removeFunc}>
        <Trash2 color="rgb(var(--color-danger))" />
      </button>}
    </div>

  </div>;
}

export default ListItem;