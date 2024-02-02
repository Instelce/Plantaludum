import React, { useEffect, useState } from "react";
import Header from "../../components/Molecules/Header/Header";
import Switch from "../../components/Atoms/Switch/Switch/Switch";
import { Link } from "react-router-dom";
import Button from "../../components/Atoms/Buttons/Button";
import Navbar from "../../components/Organisms/Navbar/Navbar";
import Dropdown from "../../components/Molecules/Dropdown/Dropdown";
import Option from "../../components/Atoms/Option/Option";
import ChoiceBlock from "../../components/Molecules/ChoiceBlock/ChoiceBlock";
import { useQuery } from "@tanstack/react-query";
import { flore } from "../../services/api/flore";
import { PlantType } from "../../services/api/types/plants";

function Settings() {
  const [settings, setSettings] = useState({
    showRankingTab: false,
    switchingGardenSection: false,
    buttonsSound: true,
  });

  useEffect(() => {
    // set default settings values if they don't exists
    if (!localStorage.getItem("settings.showRankingTab")) {
      localStorage.setItem("settings.showRankingTab", "false");
    } else {
      setSettings({
        ...settings,
        showRankingTab:
          localStorage.getItem("settings.showRankingTab") === "true",
      });
    }
    if (!localStorage.getItem("settings.switchingGardenSection")) {
      localStorage.setItem("settings.switchingGardenSection", "false");
    } else {
      setSettings({
        ...settings,
        switchingGardenSection:
          localStorage.getItem("settings.switchingGardenSection") === "true",
      });
    }
    if (!localStorage.getItem("settings.buttonsSound")) {
      localStorage.setItem("settings.buttonsSound", "false");
    } else {
      setSettings({
        ...settings,
        buttonsSound: localStorage.getItem("settings.buttonsSound") === "true",
      });
    }
    console.log(settings);
  }, []);

  return (
    <div>
      <Navbar.Root>
        <Navbar.Left>
          <Link to="/mon-jardin">Mon jardin</Link>
          <Link to="/explorer">Explorer</Link>
        </Navbar.Left>
        <Navbar.Right>
          <Button asChild label="Nouveau deck" size="large" color="gray">
            <Link
              to="/decks/create"
              state={{ from: { pathname: location.pathname } }}
            >
              Nouveau deck
            </Link>
          </Button>
        </Navbar.Right>
      </Navbar.Root>

      <Header.Root type="page">
        <Header.Title>Paramètres</Header.Title>
      </Header.Root>

      <div className="content-container">
        <Switch
          className="mb-1"
          label="Afficher l’onglet du classement"
          takeValue="true"
          value={settings.showRankingTab}
          handleValueChange={(value) => {
            setSettings({
              ...settings,
              showRankingTab: value,
            });
            localStorage.setItem(
              "settings.showRankingTab",
              (!settings.showRankingTab).toString(),
            );
          }}
        />
        <Switch
          className="mb-1"
          label="Intervertir les sections dans Mon Jardin"
          takeValue="true"
          value={settings.switchingGardenSection}
          handleValueChange={(value) => {
            setSettings({
              ...settings,
              switchingGardenSection: value,
            });
            localStorage.setItem(
              "settings.switchingGardenSection",
              (!settings.switchingGardenSection).toString(),
            );
          }}
        />
        <Switch
          label="Son des boutons"
          takeValue="true"
          value={settings.buttonsSound}
          handleValueChange={(value) => {
            setSettings({
              ...settings,
              buttonsSound: value,
            });
            localStorage.setItem(
              "settings.buttonsSound",
              (!settings.buttonsSound).toString(),
            );
          }}
        />
      </div>

      <ButtonInfoSection />
    </div>
  );
}

function ButtonInfoSection() {
  const [title, setTitle] = useState<keyof PlantType>("french_name");
  const [subTitle, setSubTitle] = useState<keyof PlantType>("scientific_name");

  const randomPlantQuery = useQuery({
    queryKey: ["randomPlant"],
    queryFn: () =>
      flore.plants.random({
        number: 1,
      }),
  });

  const t = {
    scientific_name: "Nom scientifique",
    correct_name: "Nom correct",
    french_name: "Nom français",
    num_inpn: "Numéro Inpn",
  };

  useEffect(() => {
    if (localStorage.getItem("settings.gameButtonInfo")) {
      const { title, subtitle } = JSON.parse(
        localStorage.getItem("settings.gameButtonInfo")!,
      );
      setTitle(title);
      setSubTitle(subtitle);
    } else {
      localStorage.setItem(
        "settings.gameButtonInfo",
        JSON.stringify({
          title: "french_name",
          subtitle: "scientific_name",
        }),
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "settings.gameButtonInfo",
      JSON.stringify({
        title: title,
        subtitle: subTitle,
      }),
    );
  }, [title, subTitle]);

  return (
    <>
      <Header.Root type="sub-section">
        <Header.Title>Modifier les info des boutons en jeu</Header.Title>
      </Header.Root>

      <div className="content-container">
        <form style={{ maxWidth: "400px" }}>
          <Dropdown
            label="Titre"
            defaultValue={
              t[
                JSON.parse(localStorage.getItem("settings.gameButtonInfo")!)
                  ?.title
              ]
            }
            handleValueChange={setTitle}
          >
            <Option value="scientific_name">Nom scientifique</Option>
            <Option value="correct_name">Nom correct</Option>
            <Option value="french_name">Nom français</Option>
            <Option value="num_inpn">Numéro Inpn</Option>
          </Dropdown>

          <Dropdown
            label="Sous titre"
            defaultValue={
              t[
                JSON.parse(localStorage.getItem("settings.gameButtonInfo")!)
                  ?.subtitle
              ]
            }
            handleValueChange={setSubTitle}
          >
            <Option value="scientific_name">Nom scientifique</Option>
            <Option value="correct_name">Nom correct</Option>
            <Option value="french_name">Nom français</Option>
            <Option value="num_inpn">Numéro Inpn</Option>
          </Dropdown>
        </form>

        <h4 className="mb-1 mt-1">Aperçu</h4>

        {randomPlantQuery.isSuccess && (
          <div style={{ maxWidth: "400px" }}>
            <ChoiceBlock
              title={randomPlantQuery.data[0][title] as string}
              subtitle={randomPlantQuery.data[0][subTitle] as string}
              isRightAnswer={true}
              showResult={false}
              setShowResult={() => false}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default Settings;
