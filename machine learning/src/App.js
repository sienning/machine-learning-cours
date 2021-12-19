import { BrowserRouter as Router, Link, Switch, Route, Routes } from "react-router-dom";
import MediaPipeCompo from "./components/MediaPipeCompo";
import PuissanceQuatre from "./components/PuissanceQuatre";
import LinkPage from "./components/LinkPage";
import 'semantic-ui-css/semantic.min.css'

function App() {
  return (
    <div>
      <LinkPage />

      <Router>
        <Routes>
          <Route path="/mediapipe" element={<MediaPipeCompo />}> </Route>
          <Route path="/puissance-4" element={<PuissanceQuatre />}> </Route>
          <Route path="/mediapipe" element={<MediaPipeCompo />}> </Route>
        </Routes>
      </Router>
      {/* <PuissanceQuatre /> */}
    </div>

  );
}

export default App;