import Header from "components/header/header";
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
      <footer></footer>
    </div>
  );
};

export default MainLayout;
