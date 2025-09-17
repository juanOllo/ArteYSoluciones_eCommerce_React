import React from 'react';
// import './Product.css';
import { Toaster, toast } from 'sonner';

class ProductoRender extends React.Component {

    constructor(props){
        super(props);

        this.state={
            focusImageIndex: 0,
            animatePrice: false,

            selectedPriceXSizeIndex : 0,
            selectedColorId: this.props.item.colors.length > 1 ? "" : this.props.item.colors[0].colorId,
            selectedCant: 1,
        }

        this.addToCar = this.addToCar.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if ((prevState.selectedCant !== this.state.selectedCant) || (prevState.selectedPriceXSizeIndex !== this.state.selectedPriceXSizeIndex)) {
            this.setState({ animatePrice: true }, () => {
                setTimeout(() => this.setState({ animatePrice: false }), 150); // Duración de la animación.
            });
        }
    }

    // Guarda el _id, tamaño, color y cant/u del producto en el localStorage.
    addToCar(e){

        // Aplica animacion de click al addToCarBtn
        const btn = e.target.classList.contains("btn") ? e.target : e.target.parentElement;
        // btn.style.backgroundColor = "transparent";
        btn.style.animation = "none";
        btn.style.animation = "encargar-btn-ready-click-anim 0.1s ease-in-out";
        setTimeout(() => {
            btn.style.animation = "none";
        }, 100);
        

        const newItemToCart = {
            _id : this.props.item._id, 
            priceXSizeIndex : this.state.selectedPriceXSizeIndex,
            // Uso priceXSizeIndex en vez de usar directamente el precio (o el tamaño) seleccionado
            //  para evitar que si el precio (o el tamañano) del producto es actualizado mientras 
            //  el cliente aun tiene ese producto en el localStorage no se muestre en el carrito
            //  con informacion vieja.
            // En todo caso el cliente veria el producto con un tamaño que no seleccionó.

            selectedColorId: this.state.selectedColorId,
            cant: this.state.selectedCant,
        };

        const data = localStorage.getItem("car") ? JSON.parse(localStorage.getItem("car")) : [];

        // No permito agregar el mismo item con el mismo tamaño al carrito.
        if (data.find(elem => (elem._id === newItemToCart._id && elem.priceXSizeIndex === newItemToCart.priceXSizeIndex && elem.selectedColorId === newItemToCart.selectedColorId))) {
            toast.error("Este elemento ya está en el carro de compra.", {
                style: { backgroundColor: "var(--rojo2)", border: "0.1rem solid black" }
            });
        } else {
            data.unshift(newItemToCart);
            localStorage.setItem("car", JSON.stringify(data));

            toast.success("Producto añadido al carro.", {
                style: {
                    backgroundColor: "var(--azul)",
                    border: "0.1rem solid black"
                }
            });

            // toast.success(
            //     <div>
            //         Producto añadido al 
            //         {/* <a href="http://localhost:3000/carro">Ir</a> */}
            //         <Link to="/carro" style={{backgroundColor: "rgba(255, 255, 255, 0.25)", borderRadius: "1rem", padding: "0.4rem", margin: "0 0.2rem", color: "black", textDecoration: "none"}}>
            //             CARRO 🛒
            //         </Link>
            //     </div>, 
            //     { style: { backgroundColor: "var(--azul)", border: "0.1rem solid black" } }
            // );

            // anim punto rojo en el boton del carrito
            document.getElementById("navbar-div").children[0].childNodes[0].style.animation = "ponit-car-img-anim 0.25s ease-in-out forwards";
            setTimeout(() => {
                document.getElementById("navbar-div").children[0].childNodes[0].style.backgroundColor = "red";
                document.getElementById("navbar-div").children[0].childNodes[0].style.animation = "none";
            }, 400);
        }
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
                                <img id={index} className='img-producto' src={elem} alt='imagen del producto'
                                onClick={e => this.setState({ focusImageIndex: parseInt(e.target.id) })} 
                                /> 
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
                    <div className='producto-title-bar' style={{zIndex: "2"}}>
                        <h1 className='producto-h1-compu'>{this.props.item.name}</h1>
                    </div>

                        {/* FONDO */}
                    <div className='producto-title-bar'
                    style={{zIndex: "1", position: "sticky", top: "3.5rem", left: "0", minHeight: "4rem", marginTop: "-6.3rem"}}>
                        {/* <h1 className='producto-h1-compu' style={{color: "transparent", height: "100%"}}>{this.props.item.name}</h1> */}
                    </div>

                {/* PRICE H1 */}
                    { 
                    this.props.item.off?
                        <h1 className='producto-precio-final-h1'>
                            <span style={this.state.animatePrice ? {animation: "producto-precio-final-h1-change-anim 0.15s ease-in-out 0s forwards"} : {}}>
                                ${parseInt(this.props.item.priceXSize[this.state.selectedPriceXSizeIndex].price * (1 - (this.props.item.off || 100) / 100)) * this.state.selectedCant}
                            </span>

                            <span style={{color: "rgba(0, 0, 0, 0.5)", fontSize: "1.7rem", margin: "0 0 0.5rem 1.5rem", textDecoration: "line-through"}}>
                                ${this.props.item.priceXSize[this.state.selectedPriceXSizeIndex].price * this.state.selectedCant}
                            </span>
                        </h1>
                        :
                        <h1 className='producto-precio-final-h1' style={this.state.animatePrice ? {animation: "producto-precio-final-h1-change-anim 0.15s ease-in-out 0s forwards"} : {}}>
                            ${this.props.item.priceXSize[this.state.selectedPriceXSizeIndex].price * this.state.selectedCant}
                        </h1>
                    }

                    <p>{this.props.item.info}
                        {/* <div className='producto-p-blur'></div> */}
                    </p>

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
                                <button value={index} className={"precios" + (index === this.state.selectedPriceXSizeIndex || this.props.item.priceXSize.length === 0? " precios-selected" : "")}
                                onClick={e => this.setState({ selectedPriceXSizeIndex : parseInt(e.target.value) })}
                                >
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

                        <button className='producto-cant-btn' 
                        onClick={(e) => {
                            if (this.state.selectedCant <= 1) return;
                            e.target.style.animation = "cant-btn-click-anim 0.1s ease-in-out";
                            setTimeout(() => {
                                e.target.style.animation = "none";
                            }, 100);
                            this.setState({ selectedCant: this.state.selectedCant - 1});
                        }}> - </button>

                        <input className='producto-cant-input' type="text" value={this.state.selectedCant}
                        onChange={(e) => {
                            if (e.target.value && !isNaN(e.target.value)) {
                                this.setState({ selectedCant: parseInt(e.target.value) })
                            } else {
                                this.setState({ selectedCant: 0 })
                            }
                        }}/>

                        <button className='producto-cant-btn btn' 
                        onClick={(e) => {
                            e.target.style.animation = "cant-btn-click-anim 0.1s ease-in-out";
                            setTimeout(() => {
                                e.target.style.animation = "none";
                            }, 100);
                            this.setState({ selectedCant: this.state.selectedCant + 1});
                        }}> + </button>
                    </div>

                {/* ADD TO CAR */}
                    <div className="encargar-btns-div">
                        { 
                        this.state.selectedPriceXSizeIndex === -1 || this.state.selectedColorId === "" || this.state.selectedCant <= 0?
                            <button 
                            onClick={() => { 
                                toast.error("Por favor seleccione el color, tamaño y cantidad de unidades que quiere agregar al carro de compra.", {
                                    style: { backgroundColor: "white", border: "0.1rem solid black" }
                                }); 
                            }} 
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

                {/* <Toaster position='top-center' style={{marginTop: "3rem"}}/> */}
                <Toaster position='top-right' style={{marginTop: "3rem"}} />
            </div>
        )
    }
}

export default ProductoRender;