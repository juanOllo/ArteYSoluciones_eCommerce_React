// import ReactDOM from 'react-dom';
import React from 'react';
import './Catalogo.css'
import {Link} from 'react-router-dom'

let listaDeArticulos = [
    {
        'id': '1',
        'nombre': 'Lámpara de Luna RGB!',
        'precios': [
            ['20x20', '12300']
        ],
        'descripcion': '🌕Con luces LED que cambian de color o se pueden personalizar con el control, crea la atmósfera perfecta para cualquier ocasión. 🌙¡Esperamos tu pedido!✨',
        'imagen': 'https://media.discordapp.net/attachments/1393296986161152141/1393297903199584417/luna_02.png?ex=6872a94a&is=687157ca&hm=2507ee4ede3e1d1c47fea25f93385766b24f5918fba88c7fa43c896124b022fa&=&format=webp&quality=lossless&width=756&height=810',
    },
    {
        'id': '2',
        'nombre': 'SOPORTES PLEGABLES para NOTEBOOKS y netbooks!',
        'precios': [
            ['20x20', '12500'],
            ['10x10', '7000'],
            ['30x30', '17000'],
        ],
        'descripcion': ' 💻🙌🏼3 tamaños distintos según la medida X (ver imagen 4)',
        'imagen': 'https://media.discordapp.net/attachments/1393296986161152141/1393297903526871050/soporte_notebook_01.png?ex=6872a94a&is=687157ca&hm=82f72219e153214a4fe81bc3ad933ad258c490f41d26b14e6b54e92429f83950&=&format=webp&quality=lossless&width=756&height=810',
    },
    {
        'id': '3',
        'nombre': 'SOPORTES PLEGABLES para NOTEBOOKS y netbooks!',
        'precios': [
            ['20x20', '12500'],
            ['10x10', '100']
        ],
        'descripcion': ' 💻🙌🏼3 tamaños distintos según la medida X (ver imagen 4)',
        'imagen': 'https://media.discordapp.net/attachments/1393296986161152141/1393297903526871050/soporte_notebook_01.png?ex=6872a94a&is=687157ca&hm=82f72219e153214a4fe81bc3ad933ad258c490f41d26b14e6b54e92429f83950&=&format=webp&quality=lossless&width=756&height=810',
    },
    {
        'id': '3',
        'nombre': 'SOPORTES PLEGABLES para NOTEBOOKS y netbooks!',
        'precios': [
            ['20x20', '12500'],
            ['10x10', '100']
        ],
        'descripcion': ' 💻🙌🏼3 tamaños distintos según la medida X (ver imagen 4)',
        'imagen': 'https://media.discordapp.net/attachments/1393296986161152141/1393297903526871050/soporte_notebook_01.png?ex=6872a94a&is=687157ca&hm=82f72219e153214a4fe81bc3ad933ad258c490f41d26b14e6b54e92429f83950&=&format=webp&quality=lossless&width=756&height=810',
    },
    
]

class Catalogo extends React.Component{
    constructor(props){
        super(props);

        this.listItems = this.listItems.bind(this);
        this.listItems();
    }

    listItems(){
        const listaCompleta = listaDeArticulos.map(elem => {
            return(
                <Link to="/producto" state={{itemId : elem.id}} className="catalogo-article">
                    <h2>{elem.nombre}</h2>
                    <img src={elem.imagen} alt="imagen del producto" className="catalogo-img"/>
                </Link>
            )
        })

        this.state={
            listaCompleta: listaCompleta,
        }
    }

    render(){

        return(
            <div className='catalogo-body'>
                <div id="catalogo-buscador">
                    <input type="text" placeholder="Buscar"/>
                    <button>
                        <img alt="lupa" className="search-img" src="https://media.discordapp.net/attachments/1393296986161152141/1393357055397593209/free-search-icon-2907-thumb.png?ex=6872e061&is=68718ee1&hm=2b6d0585cff0fe2861e3117aa14d052319329cc15ca854265e1788e4cd3321fe&=&format=webp&quality=lossless&width=640&height=640"/>
                    </button>
                </div>
                <div id="catalogo-lista">
                    {this.state.listaCompleta}
                </div>
            </div>
        )
    }
}

export default Catalogo;