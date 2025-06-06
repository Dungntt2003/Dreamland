import { useTranslation } from "react-i18next";
const AdminPage = () => {
  const { t } = useTranslation();
  return (
    <div style={{ padding: "16px" }}>
      <h1>{t("text1")} Admin</h1>
      <p>{t("text2")}</p>
      <p>{t("text3")}</p>
    </div>
  );
};
export default AdminPage;
