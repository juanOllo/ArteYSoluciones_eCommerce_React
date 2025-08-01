import logo from './logo.svg';
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
        'descripcion': '🌕Con luces LED que cambian de color o se pueden personalizar con el control, crea la atmósfera perfecta para cualquier ocasión. 🌙¡Esperamos tu pedido!✨',
        'images': [
            'https://media.discordapp.net/attachments/1393296986161152141/1393297903199584417/luna_02.png?ex=688d074a&is=688bb5ca&hm=909d959e362ea9ec23795e249ef80f65658c0932f7091471996ae0d9d6b6499b&=&format=webp&quality=lossless&width=541&height=580',
            'https://media.discordapp.net/attachments/1393296986161152141/1397013807431155722/358981121_248312211328204_9180331510808372686_n.jpg?ex=688cb43e&is=688b62be&hm=f7f9a17121a158ffe3fc670913df6d4fdd46c3b86f9e27465b0fea36a32d38e3&=&format=webp&width=673&height=673',
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
        'descripcion': ' 💻🙌🏼3 tamaños distintos según la medida X (ver imagen 4)',
        'images': [
            'https://media.discordapp.net/attachments/1393296986161152141/1393297903526871050/soporte_notebook_01.png?ex=688d074a&is=688bb5ca&hm=5ea2b6e3f9eac48df76841c52b7e7f40f75375af72d2efa969357c42d6f187c5&=&format=webp&quality=lossless&width=541&height=580',
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
        'descripcion': 'Soporte de botellas 🍾🥂, color: uva metalizado',
        'images': [
            'https://media.discordapp.net/attachments/1393296986161152141/1394852853960413255/image.png?ex=688cc0b3&is=688b6f33&hm=2567ac44ed80e8333bb8466d2cfe58e94cd7f628b17ab17832f24eb568a4ce79&=&format=webp&quality=lossless&width=674&height=673',
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
          <Route path="/producto" element={<Producto state={{originalList: listaDeArticulos}}/>}/>
          <Route path="/carro" element={<CarroDeCompra originalList={listaDeArticulos}/>}/>
          <Route path='/administracion' element={<Administracio originalList={listaDeArticulos}/>}/>
        </Routes>
    </div>
  );
}

export default App;
