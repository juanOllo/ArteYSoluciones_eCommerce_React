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

        const data = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];

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

        this.state = {
            cartList : finalList
        }

        this.clearCartList = this.clearCartList.bind(this);
        this.removeArticle = this.removeArticle.bind(this);
        this.changeCant = this.changeCant.bind(this);

    }

    clearCartList(e){
        localStorage.removeItem("cart");

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
                                        <Link to="/producto" state={{itemId : elem.id, originalList: this.props.originalList}} style={{color: "black"}}>{elem.nombre}</Link>
                                        <h4 style={{textAlign: "end", marginLeft: "auto"}} className="carrito-articulo-precio">{elem.precios[elem.precioFinal][0]} <br/>${parseInt(elem.precios[elem.precioFinal][1]) * elem.cant}</h4>   
                                        <span style={{fontWeight: "900", display: "flex", flexDirection: "column", position: "relative", right: "-1rem"}}>
                                                <button className="car-cant-btn"  name={index} onClick={this.changeCant}>+</button>
                                                <span style={{display: "flex", justifyContent: "center", margin: "0.6rem 0"}}>
                                                    <div>x</div>
                                                    {/* <div>{elem.cant}</div> */}
                                                    <input name={index} type="text" value={elem.cant} onChange={this.changeCant} style={{backgroundColor: "transparent", border: "none", width: "2.5rem", fontSize: "1.3rem", margin: "-0.5rem 0"}}/>
                                                </span>
                                                <button className="car-cant-btn" name={index} onClick={this.changeCant}>-</button>
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
                    {/* {
                        this.state.cartList.length ? */}
                        <CarForm finalPrice={this.state.cartList.reduce((acc, cur) => acc + parseInt(cur.precios[cur.precioFinal][1]) * parseInt(cur.cant), 0)} itemsList={this.state.cartList}/>
                        {/* : null
                    } */}
                </div>
            </div>
        )
    }
}

export default CarroDeCompra;