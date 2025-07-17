import React from "react";
import './CarroDeCompra.css'
import { Link } from "react-router-dom";
import CarForm from './CarForm';

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
        this.sendRequest = this.sendRequest.bind(this);

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
                const articulo = this.props.originalList.find(a => a.id === d.id);
                if (articulo) {
                    finalList.push({ ...articulo, precioFinal: d.precio, cant: d.cant });
                }
            }
        }

        // console.log("final list: ", finalList);

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
        const indexToEdit = e.target.name;

        // console.log("indexToEdir", e.target)

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
                if (e.target.value) {
                    this.state.cartList[indexToEdit].cant = parseInt(e.target.value);
                } else {
                    this.state.cartList[indexToEdit].cant = 0;
                }
                break;
        }

        this.setState({
            cartList: this.state.cartList
        })
    }

    sendRequest(){
        const data = localStorage.getItem("requests") ? JSON.parse(localStorage.getItem("requests")) : [];

        const itemsList = this.state.cartList.map(elem => {
            return {
                'id': elem.id,
                'name': elem.nombre,
                'size': elem.precios[elem.precioFinal],
                'cant': elem.cant
            }
        })

        const newRequest = {
            'name': 'juan',
            'contact': 'juan@gmail.com',
            'date': 'fecha',
            'items': itemsList,
            'price': this.state.cartList.reduce((acc, cur) => acc + parseInt(cur.precios[cur.precioFinal][1]) * parseInt(cur.cant), 0)
        }

        console.log("newRequest: ", newRequest);

        data.push(newRequest);
        localStorage.setItem("requests", JSON.stringify(data));
    }

    render(){

        // console.log("cart-list: ", this.state.cartList)

        return(
            <div id="carro-de-compra">
                <div className="car-list-tile car-tile">
                    <div className="list-div">
                        {
                            this.state.cartList.length ?
                            this.state.cartList.map((elem, index) => {
                                return (
                                    <article className="carrito-articulo">
                                        <button value={index} onClick={this.removeArticle} className="remove-article-btn">X</button>
                                        <img className="carrito-articulo-img" src={elem.images[0]} alt="imagen del producto"/>
                                        <Link to="/producto" state={{itemId : elem.id}} style={{color: "black"}}>{elem.nombre}</Link>
                                        <h4 style={{textAlign: "end", marginLeft: "auto"}} className="carrito-articulo-precio">{elem.precios[elem.precioFinal][0]} <br/>${parseInt(elem.precios[elem.precioFinal][1]) * elem.cant}</h4>   
                                        <span style={{fontWeight: "900", display: "flex", flexDirection: "column", position: "relative", right: "-0.5rem"}}>
                                                <button  name={index} onClick={this.changeCant} style={{fontSize: "1.5rem", fontFamily: "var(--ffamily01)", backgroundColor: "var(--amarillo)", cursor: "pointer", width: "2.5rem", height: "2.3rem", border: "none", borderRadius: "0.3rem"}}>+</button>
                                                <span style={{display: "flex", justifyContent: "center", margin: "0.6rem 0"}}>
                                                    <div>x</div>
                                                    {/* <div>{elem.cant}</div> */}
                                                    <input name={index} type="text" value={elem.cant} onChange={this.changeCant} style={{backgroundColor: "transparent", border: "none", width: "1.5rem"}}/>
                                                </span>
                                                <button  name={index} onClick={this.changeCant} style={{fontSize: "1.5rem", fontFamily: "var(--ffamily01)", backgroundColor: "var(--amarillo)", cursor: "pointer", width: "2.5rem", height: "2.3rem", border: "none", borderRadius: "0.3rem"}}>-</button>
                                        </span>
                                    </article>
                                )
                            })
                            :
                            <div id="carro-de-compra">
                                <h1 style={{marginTop: "35svh", fontFamily: "var(--ffamily01)"}}>Carro de compra vacio :(</h1>
                            </div>

                        }
                    </div>
                    <button className="clear-car-btn encargar-btn encargar-btn-ready" onClick={this.clearCartList}>VACIAR CARRO</button>
                </div>
                <div className="car-info-tile car-tile">
                    {/* <h1>Precio Final: ${this.state.cartList.reduce((acc, cur) => acc + parseInt(cur.precios[cur.precioFinal][1]) * parseInt(cur.cant), 0)}</h1> */}
                    {/* <form action="submit"></form> */}
                    {
                        this.state.cartList.length ?
                        <CarForm finalPrice={this.state.cartList.reduce((acc, cur) => acc + parseInt(cur.precios[cur.precioFinal][1]) * parseInt(cur.cant), 0)} itemsList={this.state.cartList}/>
                        : false
                    }
                    {/* <button onClick={this.sendRequest}>ENVIAR PEDIDO</button> */}
                </div>
            </div>
        )
    }
}

export default CarroDeCompra;