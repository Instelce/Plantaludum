import SectionLoader from "./SectionLoader";

export default {
  title: "SectionLoader",
  component: SectionLoader,
  tags: ["autodocs"],
};

export const Default = () => {
  return (
    <>
      <SectionLoader isLoading={true} />
    </>
  );
};
