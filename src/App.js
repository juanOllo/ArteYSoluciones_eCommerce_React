// import logo from './logo.svg';
import './App.css';
import NavbarWithLocation from './NavbarWithLocation';
import Inicio from './pages/inicio/Inicio';
import Catalogo from './pages/Catalogo';
import Producto from './pages/Producto';
import CarroDeCompra from './pages/carroDeCompra/CarroDeCompra';
import Administracion from './pages/administracion/Administracion';

import {Routes, Route} from 'react-router-dom';

const getItems = async () => {
    try {
        const response = await fetch("http://192.168.0.118:2000/items/allItemsList", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching items:", error);
        return [];
    }
};

const allItemsList = await getItems();

function App() {

  return (
    <div id="App">
        <NavbarWithLocation />

        <Routes>
          <Route path="/" element={<Inicio originalList={allItemsList}/>}/>
          <Route path="/catalogo" element={<Catalogo originalList={allItemsList}/>}/>
          <Route path="/producto/:id" element={<Producto />}/>
          {/* <Route path="/producto/:id" element={<Producto originalList={allItemsList}/>}/> */}
          <Route path="/carro" element={<CarroDeCompra originalList={allItemsList}/>}/>
          <Route path='/administracion' element={<Administracion originalList={allItemsList}/>}/>
        </Routes>
    </div>
  );
}

export default App;
