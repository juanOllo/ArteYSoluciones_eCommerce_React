// import logo from './logo.svg';
import React, { useEffect } from 'react';
import {Routes, Route} from 'react-router-dom';
import './App.css';
import Navbar from './Navbar';
import Inicio from './pages/inicio/Inicio';
import Catalogo from './pages/catalogo/Catalogo';
import Producto from './pages/producto/Producto';
import CarroDeCompra from './pages/carroDeCompra/CarroDeCompra';
import Administracion from './pages/administracion/Administracion';
import Footer from './Footer';


function App() {
  const [allItemsList, setAllItemsList] = React.useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
          // const response = await fetch("http://localhost:2000/items/allItemsList", {
          const response = await fetch("https://ays-api.onrender.com/items/allItemsList", {
              method: "GET",
              headers: { "Content-Type": "application/json" }
          });
          const data = await response.json();
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
          <Route path="/" element={<Inicio originalList={allItemsList || []}/>}/>
          <Route path="/catalogo" element={<Catalogo originalList={allItemsList || []}/>}/>
          <Route path="/producto/:_id" element={<Producto />}/>
          <Route path="/carro" element={<CarroDeCompra />}/>
          <Route path='/administracion' element={<Administracion />}/>
        </Routes>

        <Footer />
    </div>
  );
}

export default App;
