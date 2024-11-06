import Header from "components/header/header";
import Footer from "components/footer/footer";
const MainLayout = (props) => {
  return (
    <div>
      <header>
        <Header />
      </header>
      <main>
        {/* Your main content goes here */}
        {props.component}
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default MainLayout;
