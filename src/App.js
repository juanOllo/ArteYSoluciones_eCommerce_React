// import logo from './logo.svg';
import './App.css';
import Navbar from './Navbar';
import Inicio from './pages/inicio/Inicio';
import Catalogo from './pages/Catalogo';
import Producto from './pages/Producto';
import CarroDeCompra from './pages/carroDeCompra/CarroDeCompra';
import Administracion from './pages/administracion/Administracion';

import {Routes, Route} from 'react-router-dom';
import React, { setState } from 'react';

const getItems = async () => {
    try {
        const response = await fetch("http://localhost:2000/items/allItemsList", {
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

const itemsList = await getItems();

function App() {

                                                        // Lo doy vuelta porq asi me queda mas facil de manejar en admin/itemsTable
  const [allItemsList, setAllItemsList] = React.useState(itemsList.slice().reverse());

  const updateOriginalList = (newList) => {
    setAllItemsList(newList);
    console.log("originalList updated");
  };

  return (
    <div id="App">
        <Navbar />

        <Routes>
          <Route path="/" element={<Inicio originalList={allItemsList}/>}/>
          <Route path="/catalogo" element={<Catalogo originalList={allItemsList}/>}/>
          <Route path="/producto/:_id" element={<Producto />}/>
          {/* <Route path="/producto/:id" element={<Producto originalList={allItemsList}/>}/> */}
          <Route path="/carro" element={<CarroDeCompra originalList={allItemsList}/>}/>
          <Route path='/administracion' element={<Administracion originalList={allItemsList} updateOriginalList={updateOriginalList}/>}/>
        </Routes>
    </div>
  );
}

export default App;
