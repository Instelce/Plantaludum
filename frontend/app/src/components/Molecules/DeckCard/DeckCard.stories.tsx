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
      <DeckCard.Root>
        <DeckCard.Header deck={{
          id: 1,
          created_at: new Date(),
          times_played: 10,
          user: {
            id: 1,
            username: "John Doe",
          },
          name: "Title 1",
          description: "Description 1",
          preview_image_url: "https://picsum.photos/200/300?image=10",
          difficulty: 2,
          private: false,
        }}>
        </DeckCard.Header>
      </DeckCard.Root>
    </>
  );
};
