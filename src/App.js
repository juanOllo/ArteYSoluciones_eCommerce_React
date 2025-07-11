import logo from './logo.svg';
import './App.css';
import Navbar from './Navbar';
import Inicio from './pages/Inicio';
import Catalogo from './pages/Catalogo';
import Producto from './pages/Producto';
import CarroDeCompra from './pages/CarroDeCompra';
import NotFoundPage from './pages/NotFoundPage';

import {Routes, Route} from 'react-router-dom';

function App() {
  return (
    <div id="App">
        <Navbar />

        <Routes>
          <Route path="/" element={<Inicio />}/>
          <Route path="/catalogo" element={<Catalogo />}/>
          <Route path="/producto" element={<Producto />}/>
          <Route path="/carro" element={<CarroDeCompra />}/>
        </Routes>
    </div>
  );
}

export default App;
