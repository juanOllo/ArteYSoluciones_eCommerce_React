import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './Producto.css';

// "useParams" solo funciona en funciones de react
const Producto = () =>{

    // itemToRender    // El valor actual del estado           // Lo uso para mostrar datos en el render
    // setItemToRender // La función para actualizar el estado // Lo uso para cambiar el valor y provocar un re-render
    const [itemToRender, setItemToRender] = useState(null);

    // Para una navegacion mas rapida le paso el item en vez de hacer el fetch.
    const location = useLocation();
    const item = location.state || {};
    // console.log("location item: ", item);
    
    // Sino uso el _id del params para hacer el fetch del item.
    const {_id} = useParams();
    
    useEffect(() => {

        const getItemById = async () => {
            if (item && Object.keys(item).length > 0) {
                setItemToRender(item);
                console.log("item con location");
                return;
            }

            try {
                // const response = await fetch(`http://localhost:2000/items/getItem/${_id}`, {
                const response = await fetch(`https://ays-api.onrender.com/items/getItem/${_id}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                });
                const data = await response.json();
                setItemToRender(data); // guarda el item en el estado
                console.log("item con fetch");
            } catch (error) {
                console.error("Error fetching item by id:", error);
            }
        };

        getItemById();

        document.title = itemToRender ? `${itemToRender.name}` : "AYS - Producto";

    }, [_id, itemToRender]);

    return(
        <div className='producto-body'>
            {
                itemToRender?
                <ProductoRender item={itemToRender}/>
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
            priceXSizeIndex : -1, //hay q corregir esto y su intervencion en el if de addToCar()
            focusImageIndex: 0
        }

        this.selectPriceXSize = this.selectPriceXSize.bind(this);
        this.addToCar = this.addToCar.bind(this);
        this.changeFocusImageIndex = this.changeFocusImageIndex.bind(this);
    }

    selectPriceXSize(e){
        // console.log("selectPriceXSize: ", e.target.value);
        // console.log("selectPriceXSize parentElement: ", e.target.parentElement.value);
        // console.log("selectPriceXSize selected: ", parseInt(!isNaN(e.target.value)? e.target.value : e.target.parentElement.value));

        this.setState({
            priceXSizeIndex : parseInt(!isNaN(e.target.value)? e.target.value : e.target.parentElement.value)
        })
    }

    // Este metodo agrega el id y el precio seleccionado del producto a una lista en el localStorage
    addToCar(e){

        const btn = e.target.classList.contains("btn") ? e.target : e.target.parentElement;

        // btn.style.backgroundColor = "transparent";
        btn.style.animation = "none";

        btn.style.animation = "encargar-btn-ready-click-anim 0.1s ease-in-out";
        setTimeout(() => {
            btn.style.animation = "none";
        }, 100);




        const newItemToCart = {
            _id : this.props.item._id, 
            priceXSizeIndex : this.state.priceXSizeIndex
            // Uso priceXSizeIndex en vez de usar directamente el precio (o el tamaño) seleccionado
            //  para evitar que si el precio (o el tamañano) del producto es actualizado mientras 
            //  el cliente aun tiene ese producto en el localStorage no se muestre en el carrito
            //  con informacion vieja.
            // En todo caso el cliente veria el producto con un tamaño que no seleccionó.
        };

        const data = localStorage.getItem("car") ? JSON.parse(localStorage.getItem("car")) : [];

        // este if no permite agregar el mismo item con el mismo precio al carrito
        if (data.find(elem => (elem.priceXSizeIndex === newItemToCart.priceXSizeIndex && elem._id === newItemToCart._id))) {
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
                    <h1 className='producto-h1-mobil'>{this.props.item.name}</h1>

                    {
                        this.props.item.off && this.props.item.off > 0 ?
                            <div className='item-off-star' style={{overflow: "visible"}}>
                                <h4 style={{margin: "0 0 0 0.9rem", fontSize: "2.5rem"}}>
                                    -{this.props.item.off}%
                                </h4>
                            </div>
                            :
                            null
                    }

                    <div className='img-producto-focus-holder'>
                        <img className="img-producto-focus" src={this.props.item.images[this.state.focusImageIndex]} alt="imagen del producto"/>
                    </div>

                    <div className="images-tile-flex" style={{display: this.props.item.images.length > 1 ? "flex" : "none"}}>
                        {
                            this.props.item.images.map((elem, index) => {
                                return index !== this.state.focusImageIndex ?
                                    <img onClick={this.changeFocusImageIndex} id={index} className='img-producto' src={elem} alt='imagen del producto'/> 
                                    : 
                                    <img id={index} className='img-producto' src={elem} alt='imagen del producto' style={{opacity: "0.3"}}/> 
                                    // <img className="img-producto" alt=""/>;
                            })
                        }
                    </div>
                </div>

                <span className='producto-span'>
                    <h1 className='producto-h1-compu'>{this.props.item.name}</h1>

                    <p>{this.props.item.info}</p>
                    <h2>Seleccione el tamaño:</h2>
                    <div className='span-precios'>
                        {
                            this.props.item.priceXSize.map((elem, index) => {
                                // console.log("elem.off: ", elem.off);
                                return index === this.state.priceXSizeIndex? 
                                    <button onClick={this.selectPriceXSize} value={index} className="precios precios-selected">
                                        <span style={{textDecoration: this.props.item.off? "line-through" : ""}}>
                                            {elem.size} = ${elem.price}
                                        </span>

                                        {
                                            this.props.item.off ?
                                                <span>
                                                    <br />
                                                    {elem.size} =${parseInt(elem.price * (1 - (this.props.item.off || 100) / 100))}
                                                </span>
                                                :
                                                null
                                        }
                                    </button>
                                    :
                                    <button onClick={this.selectPriceXSize} value={index} className="precios">
                                        <span style={{textDecoration: this.props.item.off? "line-through" : ""}}>
                                            {elem.size} = ${elem.price}
                                        </span>

                                        {
                                            this.props.item.off ?
                                                <span>
                                                    <br />
                                                    {elem.size} =${parseInt(elem.price * (1 - (this.props.item.off || 100) / 100))}
                                                </span>
                                                :
                                                null
                                        }

                                    </button>;
                            })
                        }
                    </div>
                    <div className="encargar-btns-div">
                        {
                            this.state.priceXSizeIndex === -1?
                                <button onClick={() => { window.alert("SELECCIONE EL TAMAÑO DEL PRODUCTO"); }} className="encargar-btn btn">
                                    AGREGAR AL CARRO
                                </button>
                                :
                                <button onClick={this.addToCar} className="encargar-btn encargar-btn-ready btn">
                                    AGREGAR AL CARRO
                                </button>
                        }
                    </div>
                </span>
            </div>
        )
    }
}

export default Producto;