// import logo from './logo.svg';
import React, { useEffect } from 'react';
import {Routes, Route} from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NotFoundPage from './components/NotFoundPage';

import Inicio from './components/pages/home/Home';
import Catalogo from './components/pages/catalog/Catalog';
import Product from './components/pages/product/Product';
import CarroDeCompra from './components/pages/shoppingCar/ShoppingCar';
import Administracion from './components/pages/administration/Administration';

// Capáz no es necesario hacerlo acá sino cuando vayas a pagar o cuando entres al carrito.
// import { loadMercadoPago } from '@mercadopago/sdk-js';
// loadMercadoPago('TEST-c6fa5ae2-9252-4a75-9094-b7b1ff74215d', {
//   locale: 'es-AR'
// });

function App() {
  const [allItemsList, setAllItemsList] = React.useState([]);

  // // Para controlar el localStorage en fase de pruebas
  // //  Si la informacion del localStorage fue guardad en una version anterior se borra toda
  // const thisVersion = "0.2"
  // const localVersion = localStorage.getItem("ver") ? JSON.parse(localStorage.getItem("ver")) : "";
  // if (localVersion !== thisVersion) {
  //   localStorage.clear();
  //   localStorage.setItem("ver", JSON.stringify(thisVersion));
  // }

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
    <SimpleBar style={{ maxHeight: '100vh' }} autoHide={true}>
      <div id="App">
        <Navbar />

        <Routes>
          <Route path="/" element={<Inicio originalList={allItemsList || []}/>}/>
          <Route path="/catalogo" element={<Catalogo originalList={allItemsList || []}/>}/>
          <Route path="/producto/:_id" element={<Product originalList={allItemsList || []}/>}/>
          <Route path="/carro" element={<CarroDeCompra />}/>
          <Route path='/administracion' element={<Administracion />}/>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        {/* <Footer /> */}
      </div>
    </SimpleBar>
  );
}

export default App;