import React, { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Root from "./views/Root.jsx";
import Error from "./views/Error.jsx";
import Home from "./views/Home.jsx";
import Register from "./views/Register.jsx";
import Login from "./views/Login.jsx";
import MainMenu from "./views/protected/MainMenu.jsx";
import DeckChoice from "./views/protected/DeckChoice.jsx";
import DeckGame from "./views/protected/DeckGame.jsx";
import QuizResult from "./views/protected/DeckGameResult.jsx";
import Explorer from "./views/Explorer.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import DeckCreate from "./views/protected/DeckCreate.jsx";
import DeckCreatePlant from "./views/protected/DeckCreatePlant.jsx";
import DeckDetail from "./views/protected/DeckDetail.jsx";


function App(props) {
  return (
    <>
      <Routes>
        <Route path="/" element={<Root />} errorElement={<Error />}>
          <Route index path="/" element={<Home />} />

          <Route path="inscription" element={<Register />} />

          <Route path="connexion" element={<Login/>} />

          <Route path="explorer" element={<Explorer />} />

          <Route path="menu" element={
              <ProtectedRoute>
                <MainMenu />
              </ProtectedRoute>
            }>
            <Route path="choix" element={
                <ProtectedRoute>
                  <DeckChoice />
                </ProtectedRoute>
              } />
          </Route>

          <Route path="decks/:deckId" element={
            <ProtectedRoute>
              <DeckDetail />
            </ProtectedRoute>
          } />

          <Route path="decks/:deckId/game" element={
              <ProtectedRoute>
                <DeckGame />
              </ProtectedRoute>
            } />

          <Route path="decks/:deckId/game/resultat" element={
              <ProtectedRoute>
                <QuizResult />
              </ProtectedRoute>
          } />

          <Route path="decks/create" element={
            <ProtectedRoute>
              <DeckCreate />
            </ProtectedRoute>
          } />

          <Route path="decks/:deckId/plants/create" element={
            <ProtectedRoute>
              <DeckCreatePlant />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </>
  );
}

export default App;
