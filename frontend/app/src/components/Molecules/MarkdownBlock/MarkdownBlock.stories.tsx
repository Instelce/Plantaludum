import MarkdownBlock from "./MarkdownBlock";

export default {
  title: "MarkdownBlock",
  component: MarkdownBlock,
  tags: ["autodocs"],
};

export const Default = () => {
  return (
    <>
      <MarkdownBlock>
        # Coucou

        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi assumenda corporis cum deleniti, eos est et fugit hic in, ipsum nam necessitatibus perferendis perspiciatis quae quaerat quos ratione sunt vitae?

        ## Super cool

        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci deserunt dolor et expedita ipsam maiores nesciunt nihil optio quae quia, quod tempora totam veritatis. Aspernatur blanditiis nostrum porro quidem repellendus.

        [Piti lien](/)
      </MarkdownBlock>
    </>
  );
};
