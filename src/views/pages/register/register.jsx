import "./register.scss";
import { useTranslation } from "react-i18next";
const Register = () => {
  const { t } = useTranslation();
  return (
    <div className="register-container">
      <h1>{t("welcome")}</h1>
    </div>
  );
};

export default Register;
