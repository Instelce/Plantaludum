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
import PropTypes from "prop-types";
import Explorer from "./pages/Explorer.jsx";

function App(props) {
  const [user, setUser] = useState(null);

  const handleLogin = (user) => setUser(user);
  const handleLogout = () => setUser(null);

  console.log(user);

  return (
    <>
      <Routes>
        <Route path="/" element={<Root />} errorElement={<Error />}>
          <Route index path="/" element={<Home />} />
          <Route path="inscription" element={<Register />} />
          <Route
            path="connexion"
            element={<Login handleLogin={handleLogin} />}
          />
          <Route
            path="menu"
            element={
              <ProtectedRoute isAllowed={!!user}>
                <MainMenu />
              </ProtectedRoute>
            }
          >
            <Route
              path="choix"
              element={
                <ProtectedRoute isAllowed={!!user}>
                  <QuizChoice />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="explorer" element={<Explorer />} />
          <Route
            path="quiz/:quizId"
            element={
              // <ProtectedRoute isAllowed={!!user}>
              <QuizPage />
              // </ProtectedRoute>
            }
          />
          <Route
            path="quiz/:quizId/resultat"
            element={
              // <ProtectedRoute isAllowed={!!user}>
              <QuizResult />
              // </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

function ProtectedRoute({ isAllowed, redirectPath = "/connexion", children }) {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  isAllowed: PropTypes.bool,
  redirectPath: PropTypes.string,
  children: PropTypes.node,
};

export default App;
