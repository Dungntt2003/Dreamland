import { BrowserRouter } from "react-router-dom";
import AllRoutes from "views/routes/route";
function App() {
  return (
    <BrowserRouter>
      <AllRoutes />
    </BrowserRouter>
  );
}

export default App;
