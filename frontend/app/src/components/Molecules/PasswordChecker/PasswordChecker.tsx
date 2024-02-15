import { useMemo } from "react";

import "./PasswordChecker.scss";
import ProgressBar from "../../Atoms/ProrgessBar/ProgressBar";

type PasswordCheckerType = {
  password: string;
};

function PasswordChecker({ password }: PasswordCheckerType) {
  const status = useMemo(() => {
    return checkPassword(password);
  }, [password]);
  return (
    <div className="password-checker">
      <ProgressBar
        value={status[0] as number}
        color={status[1] as string}
        thickness="medium"
        shape="rounded"
      />
      <p>{status[2]}</p>
    </div>
  );
}

function checkPassword(password: string) {
  if (password.length >= 16) {
    return [
      100,
      "#AF52DE",
      "Waouu, votre mot de passe est extraordaire. Enfin presque ;)",
    ];
  }
  if (password.length > 10) {
    return [80, "#34C759", "Super bravo !"];
  } else if (password.length > 6) {
    return [
      40,
      "#FF9330",
      "Vous y êtes persque... Ajouter peut-être quelques symboles.",
    ];
  }
  return [
    20,
    "#FF3B30",
    "Mettez plus de caractère/symbole/chiffre, sinon même une plante pourra le cracker.",
  ];
}

export default PasswordChecker;
