import React from "react";
import './CarroDeCompra.css'
import { Link } from "react-router-dom";

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

        // oculta el punto rojo en el boton del carrito
        
        this.loadCartList = this.loadCartList.bind(this);
        this.clearCartList = this.clearCartList.bind(this);
        this.removeArticle = this.removeArticle.bind(this);
        this.changeCant = this.changeCant.bind(this);

        this.loadCartList();
    }

    loadCartList(){
        const data = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];

        // console.log("data: ", data);

        const finalList = [];
        if (data) {
            // const finalList = listaDeArticulos.filter(elem => {
            //     for (let item of data){
            //         if (item.id == elem.id) {
            //             elem.precioFinal = item.precio;
            //             return true;
            //         }
            //     }
            //     return false;
            // })

            for (const d of data) {
                const articulo = listaDeArticulos.find(a => a.id === d.id);
                if (articulo) {
                    finalList.push({ ...articulo, precioFinal: d.precio, cant: d.cant });
                }
            }
        }

        console.log("final list: ", finalList);

        this.state = {
            cartList : finalList
        }
    }

    clearCartList(e){
        localStorage.clear("cart");

        e.target.style.animation = "encargar-btn-ready-click-anim 0.1s ease-in-out";
        setTimeout(() => {
            e.target.style.animation = "none";
        }, 100);

        this.setState({
            cartList: []
        })
    }

    removeArticle(e){
        const indexToRemove = e.target.value;

        // btn.value es el index del articulo a borrar
        this.state.cartList.splice(indexToRemove, 1);
        this.setState({
            cartList : this.state.cartList 
        })

        // tamb borro el articulo en el localStorage
        const data = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
        data.splice(indexToRemove, 1);
        localStorage.setItem("cart", JSON.stringify(data));

    }

    changeCant(e){
        const indexToEdit = e.target.value;

        switch (e.target.innerText) {
            case '+':
                this.state.cartList[indexToEdit].cant++;
                break;

            case '-':
                if (this.state.cartList[indexToEdit].cant > 1) {
                    this.state.cartList[indexToEdit].cant--;
                }
                break;
        
            default:
                break;
        }

        this.setState({
            cartList: this.state.cartList
        })
    }

    render(){

        const list = this.state.cartList.map((elem, index) => {
            return (
                <article className="carrito-articulo">
                    <img className="carrito-articulo-img" src={elem.imagen} alt="imagen del producto"/>
                    <Link to="/producto" state={{itemId : elem.id}} style={{color: "black"}}>{elem.nombre}</Link>
                    {/* <span style={{display: "flex", flexDirection: "column",  marginLeft: "auto"}}>
                        <span className="carrito-span" style={{display: "flex"}}>
                            <div>x</div>
                            <div>{elem.cant}</div>
                        </span>
                            <button style={{cursor: "pointer", width: "2.5rem", height: "2rem"}} value={index} onClick={this.changeCant}>-</button>
                            <button style={{cursor: "pointer", width: "2.5rem", height: "2rem"}} value={index} onClick={this.changeCant}>+</button>
                    </span> */}
                    <h4 style={{marginLeft: "auto"}} className="carrito-articulo-precio">{elem.precios[elem.precioFinal][0]} <br/>${parseInt(elem.precios[elem.precioFinal][1]) * elem.cant}</h4>   
                    <button value={index} onClick={this.removeArticle} className="remove-article-btn">X</button>
                </article>
            )
        })

        return(
            <div id="carro-de-compra">
                <div className="car-list-tile car-tile">
                    <div className="list-div">
                        {list}
                    </div>
                    <button className="clear-car-btn encargar-btn encargar-btn-ready" onClick={this.clearCartList}>VACIAR CARRO</button>
                </div>
                <div className="car-info-tile car-tile"></div>
            </div>
        )
    }
}

export default CarroDeCompra;