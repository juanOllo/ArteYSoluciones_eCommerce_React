// import logo from './logo.svg';
import React, { setState, useEffect } from 'react';
import {Routes, Route} from 'react-router-dom';
import './App.css';
import Navbar from './Navbar';
import Inicio from './pages/inicio/Inicio';
import Catalogo from './pages/Catalogo';
import Producto from './pages/Producto';
import CarroDeCompra from './pages/carroDeCompra/CarroDeCompra';
import Administracion from './pages/administracion/Administracion';


function App() {
  const [allItemsList, setAllItemsList] = React.useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
          const response = await fetch("http://localhost:2000/items/allItemsList", {
              method: "GET",
              headers: { "Content-Type": "application/json" }
          });
          const data = await response.json();
          // setAllItemsList(data.slice().reverse());
          setAllItemsList(data);
      } catch (error) {
          console.error("Error fetching items:", error);
      }
    };
    fetchItems();
  }, []);

  return (
    <div id="App">
        <Navbar />

        <Routes>
          <Route path="/" element={<Inicio originalList={allItemsList}/>}/>
          <Route path="/catalogo" element={<Catalogo originalList={allItemsList}/>}/>
          <Route path="/producto/:_id" element={<Producto />}/>
          {/* <Route path="/producto/:id" element={<Producto originalList={allItemsList}/>}/> */}
          <Route path="/carro" element={<CarroDeCompra originalList={allItemsList}/>}/>
          <Route path='/administracion' element={<Administracion />}/>
        </Routes>
    </div>
  );
}

export default App;
