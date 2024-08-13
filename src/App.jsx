import CodeEditor from "./components/CodeEditor";
import {BrowserRouter as Router ,Routes,Route} from 'react-router-dom'
import Home from "./components/Home";
import { ToastContainer } from "react-toastify";
import {Provider} from 'react-redux'
import store from "./store/store";
function App() {
  return (
<Provider store={store}>
<div className="min-h-screen bg-gray-900 text-gray-500 px-6 py-8">

  <div>
  <ToastContainer autoClose={500}
/>
  </div>
    <Router>
      <Routes>

        <Route path="/" element={<Home/>} />
        <Route path="/editor/:id" element={<CodeEditor/>} />
     
      </Routes>

    </Router>
    </div>
    </Provider>
  );
}

export default App;
