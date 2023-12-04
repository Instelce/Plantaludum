import Modal from "./Modal";
import { useState } from "react";
import Button from "../../Atoms/Buttons/Button";

export default {
  title: "Molecules/Modal",
  component: Modal,
};

export const Default = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <Button onClick={() => setShowModal(true)}>Open Modal</Button>
      <Modal show={showModal}>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aliquam
          blanditiis dicta dolore enim necessitatibus nobis quae rem suscipit
          voluptatem. Cupiditate dignissimos dolore dolores fuga laborum
          molestiae quasi sint tenetur.
        </p>
        <div className="modal-buttons">
          <Button
            className="mt-1"
            color="gray"
            onClick={() => setShowModal(false)}
          >
            Close modal
          </Button>
        </div>
      </Modal>
    </div>
  );
};
