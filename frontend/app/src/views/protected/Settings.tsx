import {FormEvent, useEffect, useState} from "react";
import Header from "../../components/Molecules/Header/Header";
import Switch from "../../components/Atoms/Switch/Switch/Switch";
import Dropdown from "../../components/Molecules/Dropdown/Dropdown";
import Option from "../../components/Atoms/Option/Option";
import ChoiceBlock from "../../components/Molecules/ChoiceBlock/ChoiceBlock";
import {useMutation, useQuery} from "@tanstack/react-query";
import {flore} from "../../services/api/flore";
import {PlantType} from "../../services/api/types/plants";
import {SettingsType} from "../../types/helpers";
import {ErrorBoundary} from "react-error-boundary";
import Input from "../../components/Atoms/Input/Input";
import Button from "../../components/Atoms/Buttons/Button";
import usePrivateFetch from "../../hooks/auth/usePrivateFetch";
import {users} from "../../services/api/plantaludum/users";
import {Check} from "react-feather";
import useUser from "../../hooks/auth/useUser";
import {AxiosError} from "axios";
import {useAuth} from "../../context/AuthProvider";

function Settings() {
  const {accessToken} = useAuth()
  const [settings, setSettings] = useState<SettingsType>({
    showRankingTab: true,
    switchingGardenSection: false,
    buttonsSound: false,
    imageDefilementEnabled: false,
    imageDefilementTime: "3"
  });
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // set default settings values if they don't exists
    for (const s of Object.keys(settings)) {
      let settingName = s as keyof SettingsType

      if (localStorage.getItem(`settings.${settingName}`) === null) {
        localStorage.setItem(`settings.${settingName}`, settings[settingName].toString());
      }
    }

    setSettings({
      showRankingTab: JSON.parse(
        localStorage.getItem("settings.showRankingTab") as string,
      ),
      switchingGardenSection: JSON.parse(
        localStorage.getItem("settings.switchingGardenSection") as string,
      ),
      buttonsSound: JSON.parse(
        localStorage.getItem("settings.buttonsSound") as string,
      ),
      imageDefilementEnabled: JSON.parse(
        localStorage.getItem("settings.imageDefilementEnabled") as string
      ),
      imageDefilementTime: localStorage.getItem("settings.imageDefilementTime") as string
    });
    setShowSettings(true);
  }, []);

  function switchSettings(value: boolean, settingsName: keyof SettingsType) {
    setSettings({
      ...settings,
      [settingsName]: value,
    });
    localStorage.setItem(
      `settings.${settingsName}`,
      (!settings[settingsName]).toString(),
    );
  }

  return (
    <div>
      <Header.Root type="page">
        <Header.Title>Paramètres</Header.Title>
      </Header.Root>

      {showSettings && (
        <>
          <div className="content-container flex f-col gg-1">
            {accessToken && <>
              <Switch
                label="Afficher l’onglet du classement"
                takeValue={true}
                value={settings.showRankingTab as boolean}
                handleValueChange={(value) =>
                  switchSettings(value as boolean, "showRankingTab")
                }
              />
              <Switch
                label="Intervertir les sections dans Mon Jardin"
                takeValue={true}
                value={settings.switchingGardenSection}
                handleValueChange={(value) =>
                  switchSettings(value as boolean, "switchingGardenSection")
                }
              />
            </>}
            <Switch
              label="Son des boutons"
              takeValue={true}
              value={settings.buttonsSound}
              handleValueChange={(value) =>
                switchSettings(value as boolean, "buttonsSound")
              }
            />
            <Switch
              label="Activer le défilement automatique des images"
              takeValue={true}
              value={settings.imageDefilementEnabled}
              handleValueChange={(value) =>
                switchSettings(value as boolean, "imageDefilementEnabled")
              }
            />
            <div className="mt-1">
              <Input
                style={{maxWidth: "400px"}}
                disabled={!settings.imageDefilementEnabled}
                label="Temps entre chaque défilement"
                value={settings.imageDefilementTime}
                type="number"
                handleValueChange={value => {
                  setSettings({...settings, imageDefilementTime: value})
                  localStorage.setItem("settings.imageDefilementTime", value)
                }}
                helperText={parseInt(settings.imageDefilementTime) <= 0 || settings.imageDefilementTime.length === 0 ? "Attention le temps doit être supérieur à 1." : ""}
              />
            </div>
          </div>

          <ButtonInfoSection/>

          {accessToken && <RestoreThePlantGameStats/>}
        </>
      )}
    </div>
  );
}

function ButtonInfoSection() {
  const [title, setTitle] = useState<keyof PlantType>("french_name");
  const [subTitle, setSubTitle] = useState<keyof PlantType>("correct_name");

  const randomPlantQuery = useQuery({
    queryKey: ["randomPlant"],
    queryFn: () =>
      flore.plants.random({
        number: 1,
      }),
  });

  const translation: Record<keyof PlantType, string> = {
    id: "",
    rank_code: "",
    family_id: "",
    genre_id: "",
    scientific_name: "Nom scientifique",
    correct_name: "Nom correct",
    french_name: "Nom français",
    num_inpn: "Numéro Inpn",
    author: "",
    publ_date: "",
    eflore_url: "",
  };

  // default values
  useEffect(() => {
    if (localStorage.getItem("settings.gameButtonInfo")) {
      const {title, subtitle} = JSON.parse(
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
        <Header.Title>Modifier les infos des boutons en jeu</Header.Title>
      </Header.Root>

      <div className="content-container">
        <ErrorBoundary fallback={<p>Une erreur est survenu</p>}>
          <form style={{maxWidth: "400px"}}>
            <Dropdown
              label="Titre"
              defaultValue={
                translation[
                  JSON.parse(localStorage.getItem("settings.gameButtonInfo")!)
                    ?.title as keyof PlantType
                  ] as string || "Nom français"
              }
              handleValueChange={(value) => {
                setTitle(value as keyof PlantType);
              }}
            >
              <Option value="scientific_name">Nom scientifique</Option>
              <Option value="correct_name">Nom correct</Option>
              <Option value="french_name">Nom français</Option>
              <Option value="num_inpn">Numéro Inpn</Option>
            </Dropdown>

            <Dropdown
              label="Sous titre"
              defaultValue={
                translation[
                  JSON.parse(localStorage.getItem("settings.gameButtonInfo")!)
                    ?.subtitle as keyof PlantType
                  ] || "Nom correct"
              }
              handleValueChange={(value) => {
                setSubTitle(value as keyof PlantType);
              }}
            >
              <Option value="scientific_name">Nom scientifique</Option>
              <Option value="correct_name">Nom correct</Option>
              <Option value="french_name">Nom français</Option>
              <Option value="num_inpn">Numéro Inpn</Option>
            </Dropdown>
          </form>

          <h4 className="mb-1 mt-1">Aperçu</h4>

          {randomPlantQuery.isSuccess && (
            <div style={{maxWidth: "400px"}}>
              <ChoiceBlock
                title={randomPlantQuery.data[0][title] as string}
                subtitle={randomPlantQuery.data[0][subTitle] as string}
                isRightAnswer={true}
                showResult={false}
                setShowResult={() => false}
              />
            </div>
          )}
        </ErrorBoundary>
      </div>
    </>
  );
}

function RestoreThePlantGameStats() {
  const privateFetch = usePrivateFetch()
  const user = useUser()

  const restoreStatsMutation = useMutation({
    mutationKey: ["restore-theplantgame-stats"],
    mutationFn: (data: {
      username: string,
      password: string
    }) => users.restorePlantaludumStats(privateFetch, data),
    onSuccess: (data) => {
      console.log(data)
      if (user) {
        users.update(privateFetch, user.id, {
          score: data.data.points > user.score ? data.data.points : user.score,
        })
      }
    }
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement)

    restoreStatsMutation.mutate({
      username: formData.get("username") as string,
      password: formData.get("password") as string
    })
  }

  console.log("res", restoreStatsMutation.data, restoreStatsMutation.status)

  return (
    <>
      <Header.Root type="sub-section">
        <Header.Title>Restaurer les stats de votre compte
          ThePlantGame</Header.Title>
      </Header.Root>

      <div className="content-container">
        {!restoreStatsMutation.isSuccess &&
          <form style={{maxWidth: "400px"}} onSubmit={handleSubmit}>
            <Input label="Pseudo" id="username"/>
            <Input label="Mot de passe" id="password" type="password"/>
            <Button type="submit">
              Restaurer
            </Button>
          </form>}
        <div className="mt-1">
          {restoreStatsMutation.isError && <p style={{
            maxWidth: "400px",
            lineHeight: "140%"
          }}>{(restoreStatsMutation.error as AxiosError<{
            error: string
          }>)?.response?.data?.error}</p>}
          {restoreStatsMutation.isPending && <p>Chargement...</p>}
        </div>

        {restoreStatsMutation.isSuccess && <>
          <div className="flex gg-1 mb-1">
            <Check color="rgb(var(--color-primary-light))"/>
            <p>Vos données ont été récupéré avec succès !</p>
          </div>
          <p className="flex gg-1">Points &#8594; <span
            className="funique h5">{restoreStatsMutation.data.data.points}</span>
          </p>
        </>}
      </div>

    </>
  )
}

export default Settings;
