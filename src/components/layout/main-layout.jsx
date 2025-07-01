import Header from "components/header/header";
import Footer from "components/footer/footer";
const MainLayout = (props) => {
  return (
    <div>
      <header>
        <Header />
      </header>
      <main
        style={{
          margin: "134px 16px 24px",
          backgroundColor: "var(--white-color)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: "20px",
          // padding: "16px",
        }}
      >
        {props.component}
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default MainLayout;
