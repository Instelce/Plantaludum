import FloatingPlantCard from "./index";

export default {
  title: "Molecules/FloatingPlantCard",
  component: FloatingPlantCard,
  parameters: {},
};

export const Default = {
  args: {
    plant: {
      name: "Plant Name",
      src: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=60&w=500&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGxhbnRlc3xlbnwwfHwwfHx8MA%3D%3D",
      found: false,
      size: 300,
    },
  },
};
