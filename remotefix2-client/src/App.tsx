import { useTranslation } from "react-i18next";
import Header from "./components/common/header/Header";
import AppRoutes from "./router/routes";

const App = () => {
  const { t } = useTranslation()
  return (
    <>
      <Header bigTitle={t("Remotefix")} />
      <AppRoutes />
    </>
  );
};

export default App;
