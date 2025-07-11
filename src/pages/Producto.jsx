import React from 'react';
import { useLocation } from 'react-router-dom';
import './Producto.css'

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
    }
    
]

const Producto = () =>{
    const location = useLocation();
    const id = location.state?.itemId;
    // console.log(id);

    const itemToRender = listaDeArticulos.find(elem => elem.id === id);

    return(
        <div className='producto-body'>
            <ProductoRender itemToRender={itemToRender}/>
        </div>
    )
}

class ProductoRender extends React.Component {

    constructor(props){
        super(props);
        this.state={
            item : props.itemToRender,
            selectedPrice : null
        }
        this.selectPrice = this.selectPrice.bind(this);
        this.addToCart = this.addToCart.bind(this);
    }

    selectPrice(e){
        this.setState({
            selectedPrice : e.target.value
        })
    }

    addToCart(){
        if (this.state.selectedPrice) {
            
        }
    }

    render(){


        console.log("new selectedPrice: ", this.state.selectedPrice);

        const precios = this.state.item.precios.map((elem, index) => {
            return <li onClick={this.selectPrice} value={index} className="precio">{elem[0]} = ${elem[1]}</li>
        })

        // console.log(precios);

        return(
            <div>
                <h1>{this.state.item.nombre}</h1>
                <img className="img-producto" src={this.state.item.imagen} alt="imagen del producto"/>
                <p>{this.state.item.descripcion}</p>
                <h1>Seleccione un precio por tamaño:</h1>
                {/* <span className="span-precios">${preciosHTML}</span> */}
                <ul>
                    {precios}
                </ul>
                <div className="encargar-btns-div">
                    <button className="encargar-btn btn">AGREGAR AL CARRO</button>
                </div>
            </div>
        )
    }
}

export default Producto;