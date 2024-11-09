import { AuthProvider } from "context/authContext";
import AllRoutes from "views/routes/route";
import { BrowserRouter } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AllRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
