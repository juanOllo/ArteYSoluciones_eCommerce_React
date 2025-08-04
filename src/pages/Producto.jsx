import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Producto.css';

// "useParams" solo funciona en funciones de react
const Producto = () =>{

    // itemToRender    // El valor actual del estado           // Lo uso para mostrar datos en el render
    // setItemToRender // La función para actualizar el estado // Lo uso para cambiar el valor y provocar un re-render
    const [itemToRender, setItemToRender] = useState(null);

    const id = useParams().id;

    useEffect(() => {
        const getItemById = async () => {
            try {
                const response = await fetch(`http://localhost:2000/items/getItemById/${id}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                });
                const data = await response.json();
                setItemToRender(data); // guarda el item en el estado
            } catch (error) {
                console.error("Error fetching item by id:", error);
            }
        };

        getItemById();
    }, [id]);

    return(
        <div className='producto-body'>
            {
                itemToRender?
                <ProductoRender itemToRender={itemToRender}/>
                :
                null
            }
        </div>
    )
}



class ProductoRender extends React.Component {

    constructor(props){
        super(props);
        this.state={
            item : props.itemToRender,
            priceXSizeIndex : -1, //hay q corregir esto y su intervencion en el if de addToCar()
            focusImageIndex: 0
        }
        this.selectPriceXSize = this.selectPriceXSize.bind(this);
        this.addToCar = this.addToCar.bind(this);
        this.changeFocusImageIndex = this.changeFocusImageIndex.bind(this);
    }

    selectPriceXSize(e){

        this.setState({
            priceXSizeIndex : parseInt(e.target.value)
        })
    }

    // Este metodo agrega el id y el precio seleccionado del producto a una lista en el localStorage
    addToCar(e){
        if(this.state.priceXSizeIndex >= 0){
            
            const btn = e.target.classList.contains("btn") ? e.target : e.target.parentElement;

            // btn.style.backgroundColor = "transparent";
            btn.style.animation = "none";

            btn.style.animation = "encargar-btn-ready-click-anim 0.1s ease-in-out";
            setTimeout(() => {
                btn.style.animation = "none";
            }, 100);




            const newItemToCart = {
                id : this.state.item.id, 
                priceXSizeIndex : this.state.priceXSizeIndex
            };

            const data = localStorage.getItem("car") ? JSON.parse(localStorage.getItem("car")) : [];

            // este if no permite agregar el mismo item con el mismo precio al carrito
            if (data.find(elem => (elem.priceXSizeIndex === newItemToCart.priceXSizeIndex && elem.id === newItemToCart.id))) {
                console.log("este elemento ya esta en el carro de compra");
            } else {
                data.unshift(newItemToCart);
                localStorage.setItem("car", JSON.stringify(data));

                // anim punto rojo en el boton del carrito
                document.getElementById("navbar-div").lastElementChild.childNodes[0].style.animation = "ponit-car-img-anim 0.25s ease-in-out forwards";
                setTimeout(() => {
                    document.getElementById("navbar-div").lastElementChild.childNodes[0].style.backgroundColor = "red";
                    document.getElementById("navbar-div").lastElementChild.childNodes[0].style.animation = "none";
                }, 400);
            }

        } else {
            console.log("precio no seleccionado");
        }
    }

    changeFocusImageIndex(e){
        this.setState({
            focusImageIndex: parseInt(e.target.id)
        })
    }

    render(){

        return(
            <div id='producto'>
                <div className='images-tile'>
                    <img className="img-producto-focus" src={this.state.item.images[this.state.focusImageIndex]} alt="imagen del producto"/>
                    {
                        this.state.item.images.map((elem, index) => {
                            return index !== this.state.focusImageIndex ?
                                <img onClick={this.changeFocusImageIndex} id={index} className='img-producto' src={elem} alt='imagen del producto'/> 
                                : 
                                <img className="img-producto" alt=""/>;
                        })
                    }
                </div>
                <span className='producto-span'>
                    <h1>{this.state.item.nombre}</h1>
                    <p>{this.state.item.info}</p>
                    <h2>Seleccione el tamaño:</h2>
                    <div className='span-precios'>
                        {
                            this.state.item.priceXSize.map((elem, index) => {
                                return index === this.state.priceXSizeIndex? 
                                    <button onClick={this.selectPriceXSize} value={index} className="precios precios-selected">{elem.size} = ${elem.price}</button>
                                    :
                                    <button onClick={this.selectPriceXSize} value={index} className="precios">{elem.size} = ${elem.price}</button>;
                            })
                        }
                    </div>
                    <div className="encargar-btns-div">
                        {
                            this.state.priceXSizeIndex === -1?
                                <button onClick={this.addToCar} className="encargar-btn btn">AGREGAR AL CARRO</button>
                                :
                                <button onClick={this.addToCar} className="encargar-btn encargar-btn-ready btn">AGREGAR AL CARRO</button>
                        }
                    </div>
                </span>
            </div>
        )
    }
}

export default Producto;