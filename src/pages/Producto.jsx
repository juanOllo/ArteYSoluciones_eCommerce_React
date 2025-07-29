import React from 'react';
import { useLocation } from 'react-router-dom';
import './Producto.css'
import Navbar from '../Navbar';

const Producto = () =>{
    const location = useLocation();
    const id = location.state?.itemId;
    // console.log(id);

    const itemToRender = location.state.originalList.find(elem => elem.id === id);

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
            selectedPrice : -1, //hay q corregir esto y su intervencion en el if de addToCart()
            imageIndex: 0
        }
        this.selectPrice = this.selectPrice.bind(this);
        this.addToCart = this.addToCart.bind(this);
        this.changeImageFocusIndex = this.changeImageFocusIndex.bind(this);
    }

    selectPrice(e){

        const encargarBtn = e.target.parentElement.parentElement.childNodes[4].children[0];
        // encargarBtn.style.backgroundColor = "var(--amarillo)";
        encargarBtn.classList.add("encargar-btn-ready");

        for(let p of e.target.parentElement.childNodes){
            if(p.classList.contains("precios-selected")){
                p.classList.remove("precios-selected");
            }
        }

        e.target.classList.add("precios-selected");

        this.setState({
            selectedPrice : e.target.value
        })

    }

    // Este metodo agrega el id y el precio seleccionado del producto a una lista en el localStorage
    addToCart(e){
        if(this.state.selectedPrice >= 0){
            
            const btn = e.target.classList.contains("btn") ? e.target : e.target.parentElement;

            // btn.style.backgroundColor = "transparent";
            btn.style.animation = "none";

            btn.style.animation = "encargar-btn-ready-click-anim 0.1s ease-in-out";
            setTimeout(() => {
                btn.style.animation = "none";
            }, 100);




            const newItemToCart = {
                id : this.state.item.id, 
                precio : this.state.selectedPrice,
                cant : 1
            };

            const data = localStorage.getItem("car") ? JSON.parse(localStorage.getItem("car")) : [];

            // este if no permite agregar el mismo item con el mismo precio al carrito
            if (data.find(elem => (elem.precio === newItemToCart.precio && elem.id === newItemToCart.id))) {
                console.log("este elemento ya esta en el carro de compra");
            } else {
                data.unshift(newItemToCart);
                localStorage.setItem("car", JSON.stringify(data));

                // anim punto rojo en el boton del carrito
                document.getElementById("navbar-div").childNodes[3].childNodes[0].style.animation = "ponit-car-img-anim 0.25s ease-in-out forwards";
                setTimeout(() => {
                    document.getElementById("navbar-div").childNodes[3].childNodes[0].style.backgroundColor = "red";
                    document.getElementById("navbar-div").childNodes[3].childNodes[0].style.animation = "none";
                }, 400);
            }

        } else {
            console.log("precio no seleccionado");
        }
    }

    changeImageFocusIndex(e){
        this.setState({
            imageIndex: e.target.id
        })
    }

    render(){
        // console.log("new selectedPrice: ", this.state.selectedPrice);

        const precios = this.state.item.precios.map((elem, index) => {
            return <button onClick={this.selectPrice} value={index} className="precios">{elem[0]} = ${elem[1]}</button>
        })

        // console.log(precios);

        return(
            <div id='producto'>
                <div className='images-tile'>
                    <img className="img-producto-focus" src={this.state.item.images[this.state.imageIndex]} alt="imagen del producto"/>
                    {this.state.item.images.map((elem, index) => {
                        return index != this.state.imageIndex ? <img onClick={this.changeImageFocusIndex} id={index} className='img-producto' src={elem}/> : <img className="img-producto" src="" alt="" />;
                    })}
                </div>
                <span className='producto-span'>
                    <h1>{this.state.item.nombre}</h1>
                    <p>{this.state.item.descripcion}</p>
                    <h2>Seleccione el tamaño:</h2>
                    <div className='span-precios'>
                        {precios}
                    </div>
                    <div className="encargar-btns-div">
                        <button onClick={this.addToCart} className="encargar-btn btn">AGREGAR AL CARRO</button>
                    </div>
                </span>
            </div>
        )
    }
}

export default Producto;