import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from 'react-redux';
import store from './store';

import Home from './pages/Home'
import Favorite from './pages/Favorite'
import Exchange from './pages/Exchange'
import AllCrypto from './pages/AllCrypto'
import Login from './pages/Login'
import Signup from './pages/Signup'

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Favorite" element={<Favorite />} />
          <Route path="/Exchange" element={<Exchange />} />
          <Route path="/AllCrypto" element={<AllCrypto />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
