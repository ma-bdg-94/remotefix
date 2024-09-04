import Header from "./components/common/header/Header";
import AppRoutes from "./router/routes";
import { items } from "./utils/data/menuItems";

const App = () => {
  return (
    <>
      <Header bigTitle="Remotefix" navs={items} />
      <AppRoutes />
    </>
  );
};

export default App;
