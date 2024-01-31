import { Route, Routes, useParams } from "react-router-dom";
import Root from "./views/Root.jsx";
import Home from "./views/Home.jsx";
import Register from "./views/Register.jsx";
import Login from "./views/Login.jsx";
import MainMenu from "./views/protected/MainMenu.jsx";
import DeckChoice from "./views/protected/DeckChoice.jsx";
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
import useUser from "./hooks/auth/useUser";
import OwnDeck from "./routes/OwnDeck";
import UserProfile from "./views/protected/UserProfile";
import DeckGameResult from "./views/protected/DeckGameResult.jsx";
import Settings from "./views/protected/Settings";

function App() {
  const { deckId } = useParams();
  const user = useUser();

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

          <Route path="decks/:deckId" element={<DeckDetail />} />

          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth />}>
              <Route path="settings" element={<Settings />} />
              <Route path="profile/:userId" element={<UserProfile />} />

              <Route path="mon-jardin" element={<MainMenu />}>
                <Route path="choix" element={<DeckChoice />} />
              </Route>

              <Route path="decks/">
                <Route path=":deckId/game/:deckLevel" element={<DeckGame />} />
                <Route
                  path=":deckId/game/:deckLevel/resultat"
                  element={<DeckGameResult />}
                />

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
