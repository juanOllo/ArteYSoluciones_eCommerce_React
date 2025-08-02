// import logo from './logo.svg';
import './App.css';
// import Navbar from './Navbar';
import Inicio from './pages/inicio/Inicio';
import Catalogo from './pages/Catalogo';
import Producto from './pages/Producto';
import CarroDeCompra from './pages/carroDeCompra/CarroDeCompra';
import Administracio from './pages/administracion/Administracion';
import NavbarWithLocation from './NavbarWithLocation';

import {Routes, Route} from 'react-router-dom';

const listaDeArticulos = localStorage.getItem("demoList") ? JSON.parse(localStorage.getItem("demoList")) 
  :  [
    {
        'id': '111',
        'nombre': 'Lámpara de Luna RGB!',
        'priceXSize': [
            {
                'price': '12300',
                'size': '20x20'
            }
        ],
        'info': '🌕Con luces LED que cambian de color o se pueden personalizar con el control, crea la atmósfera perfecta para cualquier ocasión. 🌙¡Esperamos tu pedido!✨',
        'images': [
            'https://i.postimg.cc/j2QLgwkp/luna-02.png',
            'https://i.postimg.cc/qvYMGxvt/luna-03.jpg',
        ]
    },
    {
        'id': '222',
        'nombre': 'SOPORTES PLEGABLES para NOTEBOOKS y netbooks!',
        'priceXSize': [
            {
                'price': '12500',
                'size': '20x20'
            },
            {
                'price': '7000',
                'size': '10x10'
            },
            {
                'price': '17000',
                'size': '30x30'
            }
        ],
        'info': ' 💻🙌🏼3 tamaños distintos según la medida X (ver imagen 4)',
        'images': [
            'https://i.postimg.cc/QM9VLnyk/soporte-notebook-01.png',
        ]
    },
    {
        'id': '333',
        'nombre': '🐙 Pulpo centro de mesa 🐙',
        'priceXSize': [
            {
                'price': '12500',
                'size': '20x20'
            },
            {
                'price': '6500',
                'size': '10x10'
            }
        ],
        'info': 'Soporte de botellas 🍾🥂, color: uva metalizado',
        'images': [
            'https://i.postimg.cc/PrXxfq7q/imagepulpo.png'
        ]
    },
    
]

function App() {
  return (
    <div id="App">
        <NavbarWithLocation />

        <Routes>
          <Route path="/" element={<Inicio originalList={listaDeArticulos}/>}/>
          <Route path="/catalogo" element={<Catalogo originalList={listaDeArticulos}/>}/>
          <Route path="/producto/:id" element={<Producto state={{originalList: listaDeArticulos}}/>}/>
          {/* <Route path="/producto/:id" element={<Producto originalList={listaDeArticulos}/>}/> */}
          <Route path="/carro" element={<CarroDeCompra originalList={listaDeArticulos}/>}/>
          <Route path='/administracion' element={<Administracio originalList={listaDeArticulos}/>}/>
        </Routes>
    </div>
  );
}

export default App;
