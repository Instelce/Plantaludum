import "./style.scss";
import { createContext, useContext, useEffect, useState } from "react";
import classNames from "classnames";

const tabContext = {
  value: "",
  handleValueChange: () => "",
};

const TabsContext = createContext(tabContext);

function Root({ defaultValue, children }) {
  const [value, setValue] = useState(defaultValue);

  return (
    <TabsContext.Provider
      value={{
        value: value,
        handleValueChange: setValue,
      }}
    >
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function List({ children }) {
  return <div className="tabs-list">{children}</div>;
}

function Trigger({ value, children }) {
  const { value: tabValue, handleValueChange } = useContext(TabsContext);

  return (
    <button
      className={classNames({ active: tabValue === value })}
      onClick={() => handleValueChange(value)}
    >
      {children}
    </button>
  );
}

function Content({ value, children }) {
  const { value: tabValue } = useContext(TabsContext);

  return (
    <div
      className={classNames("tabs-content", {
        active: tabValue === value,
      })}
    >
      {children}
    </div>
  );
}

const Tabs = Object.assign(
  {},
  {
    Root,
    List,
    Trigger,
    Content,
  },
);

export default Tabs;
