import PlantImageSlider from "./PlantImageSlider";

export default {
  title: "Molecules/PlantImageSlider",
  component: PlantImageSlider,
  parameters: {
    // layout: "centered"
  },
};

export const Default = {
  args: {
    imagesData: [
      {
        id: 69144,
        author: " Hugues Tinguy",
        location: "Ajaccio > Capo di Feno",
        publ_date: "2012-05-24",
        organ: "FLOWER",
        url: "https://api.tela-botanica.org/img:000097271L.jpg",
      },
      {
        id: 69155,
        author: " Marie  Portas",
        location: "Île-de-Batz > Bord de chemin",
        publ_date: "2012-09-09",
        organ: "FRUIT",
        url: "https://api.tela-botanica.org/img:000089401L.jpg",
      },
      {
        id: 69144,
        author: " Hugues Tinguy",
        location: "Ajaccio > Capo di Feno",
        publ_date: "2012-05-24",
        organ: "FLOWER",
        url: "https://api.tela-botanica.org/img:000097271L.jpg",
      },
      {
        id: 69180,
        author: "John De Vos",
        location: "Ensuès-la-Redonne (13)",
        publ_date: "2011-04-10",
        organ: "NONE",
        url: "https://api.tela-botanica.org/img:000027906L.jpg",
      },
      {
        id: 69141,
        author: " Jean-Claude Echardour",
        location: "Saffré",
        publ_date: "2013-06-10",
        organ: "FLOWER",
        url: "https://api.tela-botanica.org/img:000160344L.jpg",
      },
    ],
    plantData: {
      id: 2518,
      num_inpn: "611014",
      rank_code: "290",
      family: "Malvaceae",
      genre: "Malva",
      scientific_name: "Malva wigandii",
      correct_name: "Malva subovata",
      french_name: "Mauve maritime",
      author: "(Alef.) M.F.Ray",
      publ_year: "1998",
      eflore_url: "http://www.tela-botanica.org/bdtfx-nn-101414",
    },
  },
};
