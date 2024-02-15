import "./ManageDeckButton.scss";
import ManageDeckButton from "./ManageDeckButton";

export default {
  title: "ManageDeckButton",
  component: ManageDeckButton,
  parameters: {},
  argTypes: {},
  tags: ["autodocs"],
};

export const Default = () => {
  return (
    <>
      <ManageDeckButton
        deck={{
          id: 1,
          name: "Nom du deck",
          description: "Lorem ipsum",
          difficulty: 1,
          preview_image_url: "https://example.com/image.jpg",
          created_at: new Date(),
          times_played: 0,
          private: false,
          user: {
            id: 1,
            username: "John Doe",
          },
        }}
      />
    </>
  );
};
