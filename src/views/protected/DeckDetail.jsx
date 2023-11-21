import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient
} from "@tanstack/react-query";
import {Link, useLocation, useParams} from "react-router-dom";
import {
  loadPlantsIdsList,
  loadPlants,
  loadDeck,
  loadDeckPlants, loadPlantsIdsListImages
} from "../../api/api.js";
import Loader from "../../components/Loader/index.jsx";
import ButtonLink from "../../components/Buttons/ButtonLink.jsx";
import {ArrowRight, EyeOff, RefreshCcw, Trash2} from "react-feather";
import Button from "../../components/Buttons/Button.jsx";
import Stars from "../../components/Stars/index.jsx";
import React, {useEffect} from "react";
import ListItem from "../../components/ListItem/index.jsx";
import useDeck from "../../hooks/api/useDeck.js";
import {getObjectKeyValues} from "../../utils.js";
import Navbar from "../../components/Navbar/index.jsx";
import useAuth from "../../hooks/auth/useAuth.js";


function DeckDetail(props) {

  const {deckId} = useParams()
  const {user} = useAuth()

  const {
    deckQuery,
    deckPlantsQuery
  } = useDeck({
     deckId,
    fetchPlants: true,
  })

  return <>
      <Navbar >
        <div className="left">
          <Link to="/mon-jardin">Mon jardin</Link>
          <Link to="/explorer">Explorer</Link>
        </div>
        <div className="right">
          {user && <ButtonLink
            to="/decks/create"
            state={{from: {pathname: location.pathname}}}
            label="Nouveau deck"
            size="large"
            color="gray"
          />}
        </div>
      </Navbar>

      {deckQuery.isSuccess && <>

        <header className="page-header center">
          <h1>{deckQuery.data.name}</h1>
          {deckQuery.data.private && <EyeOff />}
        </header>

        <div>
          <div className="img-container">
            <img src={deckQuery.data.preview_image_url} alt="Preview image"/>
          </div>

          <ButtonLink
            to={`/decks/${deckId}/game`}
            label="Jouer"
            color="primary"
            icon={<ArrowRight />}
            fill
          />

          <ButtonLink
            to={`/decks/${deckId}/update`}
            label="Mettre à jour"
            color="secondary"
            icon={<RefreshCcw />}
            fill
          />

          <Button
            label="Supprimer"
            color="danger"
            icon={<Trash2 />}
            fill
          />
        </div>

        <div>
          <div className="header">
            <div className="title">
              <h1>{deckQuery.data.name}</h1>
              {deckQuery.data.private && <EyeOff />}
            </div>

            <Stars count={deckQuery.data.difficulty} />

            <p>
              {deckQuery.data.description}
            </p>
          </div>

          <div className="plants-container">
            <h2>Plantes</h2>

            {deckPlantsQuery.isSuccess && <>

              {deckPlantsQuery.data.map((plant, index) => (
                <ListItem key={plant.id} index={index} title={plant.french_name} />
              ))}

            </>}

            {deckPlantsQuery.isLoading && <Loader />}
          </div>
        </div>
      </>}
      {deckQuery.isLoading && <Loader />}
    </>
}

export default DeckDetail;