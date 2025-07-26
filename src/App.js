import logo from './logo.svg';
import './App.css';
// import Navbar from './Navbar';
import Inicio from './pages/Inicio';
import Catalogo from './pages/Catalogo';
import Producto from './pages/Producto';
import CarroDeCompra from './pages/carroDeCompra/CarroDeCompra';
import Administracio from './pages/administracion/Administracion';

import {Routes, Route} from 'react-router-dom';
import NavbarConLocation from './NavbarConLocation';

const listaDeArticulos = localStorage.getItem("demoList") ? JSON.parse(localStorage.getItem("demoList")) 
  :  [
    {
        'id': '111',
        'nombre': 'Lámpara de Luna RGB!',
        'precios': [
            ['20x20', '12300']
        ],
        'descripcion': '🌕Con luces LED que cambian de color o se pueden personalizar con el control, crea la atmósfera perfecta para cualquier ocasión. 🌙¡Esperamos tu pedido!✨',
        'images': [
            'https://media.discordapp.net/attachments/1393296986161152141/1393297903199584417/luna_02.png?ex=6872a94a&is=687157ca&hm=2507ee4ede3e1d1c47fea25f93385766b24f5918fba88c7fa43c896124b022fa&=&format=webp&quality=lossless&width=756&height=810',
            'https://media.discordapp.net/attachments/1393296986161152141/1397013807431155722/358981121_248312211328204_9180331510808372686_n.jpg?ex=68802dfe&is=687edc7e&hm=e2cce2ab62381ae489e0949ce65c04df1b189a3e11cb18d585ddd53a2e7fba2a&=&format=webp&width=940&height=940',
        ]
    },
    {
        'id': '222',
        'nombre': 'SOPORTES PLEGABLES para NOTEBOOKS y netbooks!',
        'precios': [
            ['20x20', '12500'],
            ['10x10', '7000'],
            ['30x30', '17000'],
        ],
        'descripcion': ' 💻🙌🏼3 tamaños distintos según la medida X (ver imagen 4)',
        'images': [
            'https://media.discordapp.net/attachments/1393296986161152141/1393297903526871050/soporte_notebook_01.png?ex=6872a94a&is=687157ca&hm=82f72219e153214a4fe81bc3ad933ad258c490f41d26b14e6b54e92429f83950&=&format=webp&quality=lossless&width=756&height=810',
            
        ]
    },
    {
        'id': '333',
        'nombre': '🐙 Pulpo centro de mesa 🐙',
        'precios': [
            ['20x20', '12500'],
            ['10x10', '100']
        ],
        'descripcion': 'Soporte de botellas 🍾🥂, color: uva metalizado',
        'images': [
            'https://media.discordapp.net/attachments/1393296986161152141/1394852853960413255/image.png?ex=68785173&is=6876fff3&hm=18330c7eebbdcb218bead5621ee517d7049a73c919e42f4efe68fd91639c55b6&=&format=webp&quality=lossless&width=941&height=940',
            
        ]
    }
    
]

function App() {
  return (
    <div id="App">
        <NavbarConLocation />

        <Routes>
          <Route path="/" element={<Inicio originalList={listaDeArticulos}/>}/>
          <Route path="/catalogo" element={<Catalogo originalList={listaDeArticulos}/>}/>
          <Route path="/producto" element={<Producto state={{originalList: listaDeArticulos}}/>}/>
          <Route path="/carro" element={<CarroDeCompra originalList={listaDeArticulos}/>}/>
          <Route path='/administracion' element={<Administracio originalList={listaDeArticulos}/>}/>
        </Routes>
    </div>
  );
}

export default App;
