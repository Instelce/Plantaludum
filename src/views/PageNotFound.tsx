import React from "react";
import Button from "../components/Atoms/Buttons/Button";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Organisms/Navbar/Navbar";
import { useAuth } from "../context/AuthProvider";
import Header from "../components/Molecules/Header/Header";
import header from "../components/Molecules/Header/Header";

function PageNotFound() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <>
      <Header.Root type="section">
        <Header.Title>Oups cette page n'existe pas...</Header.Title>
        <Header.Right>
          <Button onClick={() => navigate(-1)}>Revenir en arrière</Button>
        </Header.Right>
      </Header.Root>
    </>
  );
}

export default PageNotFound;
