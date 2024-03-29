import { Route, Routes } from "react-router-dom";
import Root from "./views/Root.jsx";
import Home from "./views/Home.jsx";
import Register from "./views/Register.jsx";
import Login from "./views/Login.jsx";
import MainMenu from "./views/protected/MainMenu.jsx";
import DeckGame from "./views/protected/DeckGame.jsx";
import Explorer from "./views/Explorer.jsx";
import PersistLogin from "./routes/PersistLogin";
import DeckCreate from "./views/protected/DeckCreate.jsx";
import DeckPlants from "./views/protected/DeckPlants";
import DeckDetail from "./views/DeckDetail";
import Test from "./views/Test.jsx";
import RequireAuth from "./routes/RequireAuth";
import PageNotFound from "./views/PageNotFound";
import DeckUpdate from "./views/protected/DeckUpdate";
import OwnDeck from "./routes/OwnDeck";
import UserProfile from "./views/protected/UserProfile";
import DeckGameResult from "./views/protected/DeckGameResult.jsx";
import Settings from "./views/protected/Settings";
import Help from "./views/Help";
import Ranking from "./views/protected/Ranking";
import Identifications from "./views/protected/Identifications";
import IdentificationResponse from "./views/protected/IdentificationResponse";
import LegalMentions from "./views/LegalMentions";

/**
 * Contains all routes of the app
 */
function App() {
  // mobile message
  if (window.innerWidth <= 900) {
    return (
      <div className="mobile">
        <header>
          <img src="/logos/logo.svg" alt="Plantaludum logo" />
          <h1>Plantaludum</h1>
          <p>Un jeux pour découvrir et apprendre à reconnaitre les plantes !</p>
        </header>

        <div className="message">
          <p>
            Désolé, Plantaludum n&apos;est pas disponible sur mobile. Une
            application arrivera sans doute un jour.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Root />}>
          <Route path="*" element={<PageNotFound />} />

          <Route index path="/" element={<Home />} />

          <Route path="test" element={<Test />} />

          <Route path="inscription" element={<Register />} />

          <Route path="connexion" element={<Login />} />

          <Route path="explorer" element={<Explorer />} />

          <Route path="decks/">
            <Route path=":deckId" element={<DeckDetail />} />

            <Route path=":deckId/game/:deckLevel" element={<DeckGame />} />

            <Route
              path=":deckId/game/:deckLevel/resultat"
              element={<DeckGameResult />}
            />
          </Route>

          <Route path="help" element={<Help />} />

          <Route path="mentions-legales" element={<LegalMentions />} />

          <Route path="settings" element={<Settings />} />

          {/* Protected */}
          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth />}>
              <Route path="classement" element={<Ranking />} />

              <Route path="profile/:userId" element={<UserProfile />} />

              <Route path="mon-jardin" element={<MainMenu />} />

              <Route path="identifications" element={<Identifications />} />

              <Route
                path="identifications/:identificationId"
                element={<IdentificationResponse />}
              />

              <Route path="decks/">
                <Route path="create" element={<DeckCreate />} />
                <Route path=":deckId/plants" element={<DeckPlants />} />

                <Route
                  path=":deckId/update"
                  element={
                    <OwnDeck>
                      <DeckUpdate />
                    </OwnDeck>
                  }
                />
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
