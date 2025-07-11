import React from "react";

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

class CarroDeCompra extends React.Component{
    constructor(props){
        super(props);
        // this.state={
        //     cartList : []
        // }
        
        this.loadCartList = this.loadCartList.bind(this);
        this.loadCartList();
    }

    loadCartList(){
        const data = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];

        const finalList = listaDeArticulos.filter(elem => {
            for (let item of data){
                if (item.id == elem.id) {
                    elem.precioFinal = item.precio;
                    return true;
                }
            }
            return false;
        })

        console.log("final list: ", finalList);

        this.state = {
            cartList : finalList
        }
    }

    // componentWillMount() {
    //     this.loadCartList();
    // }

    render(){
        // this.loadCartList();

        console.log("cartList: ", this.state.cartList);

        const list = this.state.cartList.map(elem => {
            return (
                <li className="carrito-articulo">
                    <img className="carrito-articulo-img" src={elem.imagen} alt="imagen del producto"/>
                    <h4 className="carrito-articulo-h4">{elem.nombre}</h4>
                    <h4 className="carrito-articulo-h4">{elem.precios[elem.precioFinal][0]} ${elem.precios[elem.precioFinal][1]}</h4>
                </li>
            )
        })

        return(
            <div>
                <ul>
                    {list}
                </ul>
            </div>
        )
    }
}

export default CarroDeCompra;