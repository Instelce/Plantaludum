import { Outlet } from "react-router-dom";
import useRefreshToken from "../hooks/auth/useRefreshToken.js";
import { useAuth } from "../context/AuthProvider";
import { useEffect, useState } from "react";
import Loader from "../components/Atoms/Loader";

function PersistLogin() {
  const [isLoading, setIsLoading] = useState(true);
  const { accessToken, persist } = useAuth();
  const refresh = useRefreshToken();

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.log(err);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    if (!accessToken) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    console.log("isLoading", isLoading);
    console.log("accessToken", JSON.stringify(accessToken));
  }, [isLoading]);

  return (
    <>
      {!persist ? (
        <Outlet />
      ) : isLoading ? (
        <div className="center-loader">
          <Loader />
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
}

export default PersistLogin;
