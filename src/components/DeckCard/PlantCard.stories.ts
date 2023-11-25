import DeckCard from "./index.jsx";
import "./style.scss";

export default {
  component: DeckCard,
  parameters: {
    layout: "centered",
  },
  decorators: [
    // (Story) => (
    //   <div style={{ margin: '3em' }}>
    //       {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
    //       <Story />
    //   </div>
    // ),
  ],
};

export const Default = {
  args: {
    plant: {
      name: "Arbres fruitiers",
      description:
        "Lorem ipsum dolor sit amet consectetur. Erat amet porta netus mauris accumsan tellus massa in justo. Et tellus tempor lorem in sed. Lorem vel sit rhoncus vitae quis feugiat. Fringilla rutrum ac viverra odio ultrices risus nunc nunc.",
      difficulty: 2,
      images: [
        "https://api.tela-botanica.org/img:000092753CRS.jpg",
        "https://api.tela-botanica.org/img:000116167CRS.jpg",
        "https://api.tela-botanica.org/img:002251388CRS.jpg",
      ],
    },
  },
};
