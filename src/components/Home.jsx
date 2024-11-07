import About from "./About";
import Footer from "./Footer";
import GetStarted from "./GetStarted";
import Header from "./Header";
import Process from "./Process";
import Register from "./Register";
import Login from "./Login";
import Why from "./Why";
import Reviews from "./Reviews";
import { useEffect, useState } from "react";

function Home() {
  const [reflect, setReflect] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="flex relative">
        <img
          src="images/background3.jpg"
          className="hidden md:block h-screen w-full"
          alt="background"
        />
        <img
          src="images/background-mobile.jpg"
          className="md:hidden h-[95vh] w-full"
          alt="background"
        />
        <Header
          onData={(login) => {
            setReflect(login);
          }}
        />

        {reflect ? (
          <Login
            onRegister={(f) => {
              setReflect(f);
            }}
          />
        ) : (
          <Register />
        )}
      </div>
      <About />
      <div className="w-full bg-pink-50">
        <Process />
      </div>
      <Reviews />
      <GetStarted />
      <Why />
      <Footer />
    </>
  );
}

export default Home;
