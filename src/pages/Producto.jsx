import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Producto.css';

// "useParams" solo funciona en funciones de react
const Producto = () =>{

    // itemToRender    // El valor actual del estado           // Lo uso para mostrar datos en el render
    // setItemToRender // La función para actualizar el estado // Lo uso para cambiar el valor y provocar un re-render
    const [itemToRender, setItemToRender] = useState(null);

    // Para una navegacion mas rapida le paso el item en vez de hacer el fetch.
    // const location = useLocation();
    // const item = location.state || {};
    // console.log("location item: ", item);
    
    // Sino uso el _id del params para hacer el fetch del item.
    const {_id} = useParams();
    
    useEffect(() => {
        const getItemById = async () => {
            try {
                // const response = await fetch(`http://192.168.1.16:2000/items/getItem/${_id}`, {
                const response = await fetch(`https://ays-api.onrender.com/items/getItem/${_id}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                });
                const data = await response.json();
                setItemToRender(data); // guarda el item en el estado
                // console.log("item fetched: ", data);
                // console.log("item con fetch");
            } catch (error) {
                console.error("Error fetching item by id:", error);
            }
        };

        getItemById();
    }, [_id]);

    useEffect(() => {
        document.title = itemToRender ? `${itemToRender.name}` : "AYS - Producto";
    }, [itemToRender]);


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
            // priceXSizeIndex : this.props.item.priceXSize.length > 1 ? -1 : 0,
            priceXSizeIndex : 0,
            focusImageIndex: 0,
            selectedColorId: this.props.item.colors.length > 1 ? "" : this.props.item.colors[0].colorId,
            cant: 1,
            animatePrice: false,
        }

        this.selectPriceXSize = this.selectPriceXSize.bind(this);
        this.addToCar = this.addToCar.bind(this);
        this.changeFocusImageIndex = this.changeFocusImageIndex.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if ((prevState.cant !== this.state.cant) || (prevState.priceXSizeIndex !== this.state.priceXSizeIndex)) {
            this.setState({ animatePrice: true }, () => {
                setTimeout(() => this.setState({ animatePrice: false }), 150); // duración de la animación
            });
        }
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
            priceXSizeIndex : this.state.priceXSizeIndex,
            // Uso priceXSizeIndex en vez de usar directamente el precio (o el tamaño) seleccionado
            //  para evitar que si el precio (o el tamañano) del producto es actualizado mientras 
            //  el cliente aun tiene ese producto en el localStorage no se muestre en el carrito
            //  con informacion vieja.
            // En todo caso el cliente veria el producto con un tamaño que no seleccionó.

            selectedColorId: this.state.selectedColorId,
            cant: this.state.cant,
        };

        const data = localStorage.getItem("car") ? JSON.parse(localStorage.getItem("car")) : [];

        // este if no permite agregar el mismo item con el mismo precio al carrito
        if (data.find(elem => (elem.priceXSizeIndex === newItemToCart.priceXSizeIndex && elem._id === newItemToCart._id && elem.selectedColorId === newItemToCart.selectedColorId))) {
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
                            <div className='item-off-star'>
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

                    {/* <div className="images-tile-flex" style={{display: this.props.item.images.length > 1 ? "flex" : "none"}}> */}
                    <div className="images-tile-flex">
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
                    {/* <div className='producto-blur'></div> */}

                {/* TITLE NAME */}
                        {/* LETRAS */}
                    <div className='producto-title-bar'
                        style={{position: "sticky", left: "0", height: "0", minHeight: "0", marginBottom: "-2.3rem", backgroundColor: "transparent", zIndex: "1"}}
                    >
                        <h1 className='producto-h1-compu'>{this.props.item.name}</h1>
                    </div>

                        {/* FONDO */}
                    <div className='producto-title-bar producto-h1-compu-after'
                        style={{position: "sticky", top: "3.5rem", left: "0", minHeight: "0"}}
                    >
                        <h1 className='producto-h1-compu' style={{color: "transparent", height: "100%"}}>{this.props.item.name}</h1>
                    </div>

                {/* PRICE H1 */}
                    { 
                        this.props.item.off?
                            <h1 className='producto-precio-final-h1'>
                                <span style={this.state.animatePrice ? {animation: "producto-precio-final-h1-change-anim 0.15s ease-in-out 0s forwards"} : {}}>
                                    ${parseInt(this.props.item.priceXSize[this.state.priceXSizeIndex].price * (1 - (this.props.item.off || 100) / 100)) * this.state.cant}
                                </span>

                                <span style={{color: "rgba(0, 0, 0, 0.5)", fontSize: "1.7rem", margin: "0 0 0.5rem 1.5rem", textDecoration: "line-through"}}>
                                    ${this.props.item.priceXSize[this.state.priceXSizeIndex].price * this.state.cant}
                                </span>
                            </h1>
                            :
                            <h1 className='producto-precio-final-h1' style={this.state.animatePrice ? {animation: "producto-precio-final-h1-change-anim 0.15s ease-in-out 0s forwards"} : {}}>
                                ${this.props.item.priceXSize[this.state.priceXSizeIndex].price * this.state.cant}
                            </h1>
                    }

                    <p>{this.props.item.info}</p>

                {/* COLORES */}
                    <div style={{marginBottom: "-0.5rem", backgroundColor: "", display: "flex", gap: "0.5rem", justifyContent: "start", alignItems: "center", height: "3rem", width: "90%"}}>
                        <h3 style={{backgroundColor: "transparent", width: "fit-content"}}>Color:</h3>
                        <select className='product-color-select' name="color-select" id="" value={this.state.selectedColorId}
                            style={this.state.selectedColorId === ""?
                                {backgroundColor: "var(--amarillo)", boxShadow: "0.2rem 0.2rem black"}
                                :
                                {backgroundColor: "var(--violeta)", transform: "translate(0.2rem, 0.2rem)"}
                            }
                            onChange={(e) => this.setState({ selectedColorId: e.target.value })}
                        >
                            {
                                this.props.item.colors.length > 1?
                                    <option value="">Colores</option>
                                    :
                                    null
                            }
                            {
                                this.props.item.colors.map((cElem, cIndex) => 
                                    <option key={cIndex} value={cElem.colorId}>
                                        {cElem.colorName}
                                    </option>
                                )
                            }
                        </select>
                        {
                            this.props.item.colors.length === 1 ?
                                <h5 style={{color: "rgba(0, 0, 0, 0.7)"}}>(Unico color disponible)</h5>
                                :
                                null
                        }
                    </div>
                    
                {/* SIZES */}
                    <div className='span-precios'>
                        <h3 style={{marginBottom: "-0.5rem"}}>Tamaño:</h3>
                        {
                            this.props.item.priceXSize.map((elem, index) => 
                                <button onClick={this.selectPriceXSize} value={index} className={"precios" + (index === this.state.priceXSizeIndex || this.props.item.priceXSize.length === 0? " precios-selected" : "")}>
                                    {elem.size}
                                </button>
                            )
                        }
                        {
                            this.props.item.priceXSize.length === 1 ?
                                <h5 style={{height: "0", color: "rgba(0, 0, 0, 0.7)"}}>(Unico tamaño disponible)</h5>
                                :
                                null
                        }
                    </div>

                {/* CANT */}
                    <div style={{marginBottom: "1rem", backgroundColor: "", width: "90%", display: "flex", flexWrap: "wrap"}}>
                        <h3 style={{width: "100%", backgroundColor: "", marginBottom: "0.5rem" }}>Cantidad:</h3>
                        <button className='producto-cant-btn' onClick={(e) => {
                                if (this.state.cant <= 1) return;
                                // e.target.style.animation = "none";
                                e.target.style.animation = "cant-btn-click-anim 0.1s ease-in-out";
                                setTimeout(() => {
                                    e.target.style.animation = "none";
                                }, 100);

                                this.setState({ cant: this.state.cant - 1});
                            }
                            }>-</button>

                        <input className='producto-cant-input'
                            onChange={(e) => {
                                if (e.target.value && !isNaN(e.target.value)) {
                                    this.setState({ cant: parseInt(e.target.value) })
                                } else {
                                    this.setState({ cant: 0 })
                                }
                            }}
                            type="text" value={this.state.cant}/>

                        <button className='producto-cant-btn btn' onClick={(e) => {
                                // e.target.style.animation = "none";
                                e.target.style.animation = "cant-btn-click-anim 0.1s ease-in-out";
                                setTimeout(() => {
                                    e.target.style.animation = "none";
                                }, 100);

                                this.setState({ cant: this.state.cant + 1});
                            }
                            }>+</button>
                    </div>

                {/* ADD TO CAR */}
                    <div className="encargar-btns-div">
                        {
                            this.state.priceXSizeIndex === -1 || this.state.selectedColorId === "" || this.state.cant <= 0?
                                <button onClick={() => { window.alert("Por favor seleccione el color, tamaño y cantidad de unidades que quiere agregar al carro de compra."); }} 
                                className="encargar-btn btn">
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