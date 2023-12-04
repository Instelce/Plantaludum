import DeckCard from "./DeckCard";
import "./DeckCard.scss";

export default {
  title: "Molecules/DeckCard",
  parameters: {
    layout: "centered",
  },
  decorators: [],
};

export const Default = () => {
  return (
    <>
      <DeckCard
        deck={{
          name: "Title 1",
          description: "Description 1",
          preview_image_url: "https://picsum.photos/200/300?image=10",
          difficulty: 2,
          private: false,
        }}
      />
    </>
  );
};
