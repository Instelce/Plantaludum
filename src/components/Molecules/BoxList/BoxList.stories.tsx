import "./BoxList.scss";
import BoxList from "./BoxList";
import React from "react";

export default {
  title: "Molecules/BoxListGroup",
  component: BoxList.Group,
  parameters: {},
  argTypes: {},
  tags: ["autodocs"],
};

export const SimpleBoxListGroup = () => {
  return (
    <>
      <BoxListGroup size="large" rounded={true}>
        <BoxListItem>Verveine</BoxListItem>
        <BoxListItem>Coquelicot</BoxListItem>
        <BoxListItem>Millepertuis</BoxListItem>
        <BoxListItem>Mauve</BoxListItem>
      </BoxListGroup>
    </>
  );
};
