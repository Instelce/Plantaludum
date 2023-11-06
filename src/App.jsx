import React, { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Root from "./pages/Root.jsx";
import Error from "./pages/Error.jsx";
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import MainMenu from "./pages/protected/MainMenu.jsx";
import QuizChoice from "./pages/protected/QuizChoice.jsx";
import QuizPage from "./pages/protected/QuizPage.jsx";
import QuizResult from "./pages/protected/QuizResultS.jsx";
import Explorer from "./pages/Explorer.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import useAuth from "./hooks/auth/useAuth.js";

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
                <QuizPage />
              </ProtectedRoute>
            } />

          <Route path="quiz/:quizId/resultat" element={
              <ProtectedRoute>
                <QuizResult />
              </ProtectedRoute>
            } />
        </Route>
      </Routes>
    </>
  );
}

export default App;
