import { Route, Routes } from "react-router-dom";
import Root from "./views/Root.jsx";
import Home from "./views/Home.jsx";
import Register from "./views/Register.jsx";
import Login from "./views/Login.jsx";
import MainMenu from "./views/protected/MainMenu.jsx";
import DeckChoice from "./views/protected/DeckChoice.jsx";
import DeckGame from "./views/protected/DeckGame.jsx";
import QuizResult from "./views/protected/DeckGameResult.jsx";
import Explorer from "./views/Explorer.jsx";
import PersistLogin from "./routes/PersistLogin";
import DeckCreate from "./views/protected/DeckCreate.jsx";
import DeckCreatePlant from "./views/protected/DeckCreatePlant.jsx";
import DeckDetail from "./views/protected/DeckDetail.jsx";
import Test from "./views/Test.jsx";
import RequireAuth from "./routes/RequireAuth";
import PageNotFound from "./views/PageNotFound";

function App() {
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

          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth />}>
              <Route path="mon-jardin" element={<MainMenu />}>
                <Route path="choix" element={<DeckChoice />} />
              </Route>

              <Route path="decks/:deckId" element={<DeckDetail />} />

              <Route path="decks/:deckId/game" element={<DeckGame />} />

              <Route
                path="decks/:deckId/game/resultat"
                element={<QuizResult />}
              />

              <Route path="decks/create" element={<DeckCreate />} />

              <Route
                path="decks/:deckId/plants/create"
                element={<DeckCreatePlant />}
              />
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
