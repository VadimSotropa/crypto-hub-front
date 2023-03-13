// import './App.css';
// import { BrowserRouter, Route, Routes, Switch } from "react-router-dom";
// import {
//   RecoilRoot,
// } from 'recoil';

// import Home from './pages/Home'
// import Favorite from './pages/Favorite'
// import Exchange from './pages/Exchange'
// import AllCrypto from './pages/AllCrypto'
// import Login from './pages/Login'
// import Signup from './pages/Signup'
// import CryptoList from './components/CryptoList'
// import CryptoDetails from './pages/Crypto'

// function App() {
//   return (
    
//     <BrowserRouter>
//     <RecoilRoot>
//     <Routes>
      
//       <Route path="/" element={<Home />} />
//       <Route path="/Favorite" element={<Favorite />} />
//       <Route path="/Exchange" element={<Exchange />} />
//       <Route path="/AllCrypto" element={<AllCrypto />} />
//       <Route path="/Login" element={<Login />} />
//       <Route path="/Signup" element={<Signup />} />
    
//     </Routes>
//     </RecoilRoot>
//   </BrowserRouter>
  
//   );
// }

// export default App;

import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RecoilRoot } from 'recoil';
import Home from './pages/Home';
import Favorite from './pages/Favorite';
import Exchange from './pages/Exchange';
import AllCrypto from './pages/AllCrypto';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CryptoList from './components/CryptoList';
import CryptoDetails from './pages/Crypto';

function App() {
  return (
    <BrowserRouter>
      <RecoilRoot>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorite" element={<Favorite />} />
          <Route path="/exchange" element={<Exchange />} />
          <Route path="/Allcrypto" element={<AllCrypto />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/crypto-list" element={<CryptoList />} />
          <Route path="/crypto/:id" element={<CryptoDetails />} />
          
        </Routes>
      </RecoilRoot>
    </BrowserRouter>
  );
}

export default App;