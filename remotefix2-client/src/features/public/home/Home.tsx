import React, { Suspense } from "react";
import { Helmet } from "react-helmet-async";

const Home = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Helmet>
        <title>Home Page</title>
      </Helmet>
      <div>Hello World! This is Home page!</div>
    </Suspense>
  );
};

export default Home;
