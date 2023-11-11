import React, { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Root from "./views/Root.jsx";
import Error from "./views/Error.jsx";
import Home from "./views/Home.jsx";
import Register from "./views/Register.jsx";
import Login from "./views/Login.jsx";
import MainMenu from "./views/protected/MainMenu.jsx";
import QuizChoice from "./views/protected/QuizChoice.jsx";
import QuizGame from "./views/protected/QuizGame.jsx";
import QuizResult from "./views/protected/QuizResultS.jsx";
import Explorer from "./views/Explorer.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import QuizCreate from "./views/protected/QuizCreate.jsx";
import QuizPlantCreate from "./views/protected/QuizPlantCreate.jsx";
import QuizDetail from "./views/protected/QuizDetail.jsx";


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
                  <QuizChoice />
                </ProtectedRoute>
              } />
          </Route>

          <Route path="quiz/:quizId" element={
            <ProtectedRoute>
              <QuizDetail />
            </ProtectedRoute>
          } />

          <Route path="quiz/:quizId/game" element={
              <ProtectedRoute>
                <QuizGame />
              </ProtectedRoute>
            } />

          <Route path="quiz/:quizId/game/resultat" element={
              <ProtectedRoute>
                <QuizResult />
              </ProtectedRoute>
          } />

          <Route path="quiz/create" element={
            <ProtectedRoute>
              <QuizCreate />
            </ProtectedRoute>
          } />

          <Route path="quiz/:quizId/plants/create" element={
            <ProtectedRoute>
              <QuizPlantCreate />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </>
  );
}

export default App;
