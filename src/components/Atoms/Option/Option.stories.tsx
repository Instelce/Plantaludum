import Option from "./Option";

export default {
  title: "Atoms/Option",
  component: Option,
};

export const Default = () => {
  return (
    <>
      <Option>Banane</Option>
      <Option>Orange</Option>
      <Option>Cerise</Option>
      <Option>Pomme</Option>
    </>
  );
};
