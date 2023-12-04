import "./BoxListGroup.scss";
import BoxListGroup, { BoxListItem } from "./BoxListGroup";
import React from "react";

export default {
  title: "Molecules/BoxListGroup",
  component: BoxListGroup,
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
