import Header from "./components/common/header/Header";
import AppRoutes from "./router/routes";

const App = () => {
  return (
    <>
      <Header bigTitle="Remotefix" />
      <AppRoutes />
    </>
  );
};

export default App;
