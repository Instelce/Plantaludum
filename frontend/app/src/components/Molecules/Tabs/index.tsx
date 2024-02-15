import "./style.scss";
import { createContext, useContext, useState, ReactNode, PropsWithChildren } from "react";
import classNames from "classnames";

const tabContext = {
  value: "",
  // eslint-disable-next-line no-unused-vars
  handleValueChange: (value: string) => {},
};

const TabsContext = createContext(tabContext);

type RootProps = {
  defaultValue: string;
  children: ReactNode;
};

function Root({ defaultValue, children }: RootProps) {
  const [value, setValue] = useState(defaultValue);

  return (
    <TabsContext.Provider
      value={{
        value: value,
        handleValueChange: (value: string) => setValue(value),
      }}
    >
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function List({ children }: PropsWithChildren) {
  return <div className="tabs-list">{children}</div>;
}

type TriggerContentProps = {
  value: string;
  children: ReactNode;
};

function Trigger({ value, children }: TriggerContentProps) {
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

function Content({ value, children }: TriggerContentProps) {
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
