import React from "react";
import './CarroDeCompra.css'
import { Link } from "react-router-dom";
import CarForm from './CarForm';

class CarroDeCompra extends React.Component{
    constructor(props){
        super(props);
        // this.state={
        //     carList : []
        // }

        const data = localStorage.getItem("car") ? JSON.parse(localStorage.getItem("car")) : [];

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
            carList : finalList
        }

        this.clearCarList = this.clearCarList.bind(this);
        this.removeArticle = this.removeArticle.bind(this);
        this.changeCant = this.changeCant.bind(this);

    }

    clearCarList(e){
        localStorage.removeItem("car");

        e.target.style.animation = "encargar-btn-ready-click-anim 0.1s ease-in-out";
        setTimeout(() => {
            e.target.style.animation = "none";
        }, 100);

        this.setState({
            carList: []
        })
    }

    removeArticle(e){
        const indexToRemove = e.target.value;

        // btn.value es el index del articulo a borrar
        this.state.carList.splice(indexToRemove, 1);
        this.setState({
            carList : this.state.carList 
        })

        // tamb borro el articulo en el localStorage
        const data = localStorage.getItem("car") ? JSON.parse(localStorage.getItem("car")) : [];
        data.splice(indexToRemove, 1);
        localStorage.setItem("car", JSON.stringify(data));

    }

    changeCant(e){
        const indexToEdit = e.target.name;
        const updatedcarList = this.state.carList;

        // console.log("indexToEdir", e.target)

        switch (e.target.innerText) {
            case '+':
                updatedcarList[indexToEdit].cant++;
                break;

            case '-':
                if (updatedcarList[indexToEdit].cant > 1) {
                    updatedcarList[indexToEdit].cant--;
                }
                break;
        
            default:
                if (e.target.value) {
                    updatedcarList[indexToEdit].cant = parseInt(e.target.value);
                } else {
                    updatedcarList[indexToEdit].cant = 0;
                }
                break;
        }

        this.setState({
            carList: updatedcarList
        })
    }

    render(){

        // console.log("car-list: ", this.state.carList)

        return(
            <div id="carro-de-compra">
                <div className="car-list-tile car-tile">
                        {/* <h2 style={{padding: "0.5rem", 
                                    // color: "white",
                                    backgroundColor: "var(--violeta)", 
                                    // backgroundColor: "var(--amarillo)", 
                                    width: "fit-content",
                                    border: "0.1rem solid black",
                                    // margin: "0.1rem auto 0.5rem",
                                    // margin: "-1.1rem 0 0.5rem 0.7rem",
                                    borderRadius:"0 0 0.5rem 0.5rem",
                                    position: "absolute",
                                    top: "2rem" ,
                                    zIndex: "2",
                                    }}>Tu carriro de compra:</h2> */}
                    <div className="list-div">

                        {
                            this.state.carList.length ?
                            this.state.carList.map((elem, index) => {
                                return (
                                    <article className="carrito-articulo">
                                        <button value={index} onClick={this.removeArticle} className="remove-article-btn">X</button>
                                        <img className="carrito-articulo-img" src={elem.images[0]} alt="imagen del producto"/>
                                        <Link to="/producto" state={{itemId : elem.id, originalList: this.props.originalList}} style={{color: "black"}}>{elem.nombre}</Link>
                                        <h4 style={{textAlign: "end", marginLeft: "auto"}} className="carrito-articulo-precio">{elem.precios[elem.precioFinal][0]} <br/>${parseInt(elem.precios[elem.precioFinal][1]) * elem.cant}</h4>   
                                        <span style={{fontWeight: "900", display: "flex", flexDirection: "column", position: "relative"}}>
                                                <button className="car-cant-btn"  name={index} onClick={this.changeCant}>+</button>
                                                <span style={{display: "flex", justifyContent: "center", margin: "0.6rem 0"}}>
                                                    <div>x</div>
                                                    {/* <div>{elem.cant}</div> */}
                                                    <input name={index} type="text" value={elem.cant} onChange={this.changeCant} style={{backgroundColor: "transparent", border: "none", width: "1.7rem", fontSize: "1rem", margin: "-0.5rem 0"}}/>
                                                </span>
                                                <button className="car-cant-btn" name={index} onClick={this.changeCant}>-</button>
                                        </span>
                                    </article>
                                )
                            })
                            :
                            <div>
                                <h1 style={{textAlign: "center", marginTop: "25svh", fontFamily: "var(--ffamily01)", height: "10rem"}}>Carro de compra vacio :(</h1>
                            </div>

                        }
                    </div>
                    <button className="clear-car-btn encargar-btn encargar-btn-ready" onClick={this.clearCarList}>VACIAR CARRO</button>
                </div>
                <div className="car-info-tile car-tile">
                    {/* {
                        this.state.carList.length ? */}
                        <CarForm finalPrice={this.state.carList.reduce((acc, cur) => acc + parseInt(cur.precios[cur.precioFinal][1]) * parseInt(cur.cant), 0)} itemsList={this.state.carList}/>
                        {/* : null
                    } */}
                </div>
            </div>
        )
    }
}

export default CarroDeCompra;