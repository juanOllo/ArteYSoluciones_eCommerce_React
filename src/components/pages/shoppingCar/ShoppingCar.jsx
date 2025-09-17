import React from "react";
import './ShoppingCar.css'
import { Link } from "react-router-dom";
import CarForm from './CarForm';

class CarroDeCompra extends React.Component{
    constructor(props){
        super(props);
        this.state={
            // displayedList: [],
            localStorageCarList: localStorage.getItem("car") ? JSON.parse(localStorage.getItem("car")) : [],
            carList: [],
            isLoading: true
        }

        this.clearCarList = this.clearCarList.bind(this);
        this.removeArticle = this.removeArticle.bind(this);
        this.changeCant = this.changeCant.bind(this);

        document.title = "Arte Y Soluciones / Carro de Compra";
    }
    
    // Pasarle originalList como props hace que se cargue mas rapido siempre,
    //  pero si refrecas la pagina o entras a la pagina /carro directamente
    //  por la url los props no llegan de ningun lado, entonces hago el fetch.
    async componentDidMount(){

        // Si no hay nada en el carro de compra no hay informacion que tratar.
        if (!Array.isArray(this.state.localStorageCarList) || !(this.state.localStorageCarList.length > 0)) {
            this.setState({
                isLoading: false
            })
            return;
        }

        let vanillaItemsList = [];
        
        try {
            // const response = await fetch(`http://localhost:2000/items/getSomeItems`, {
            const response = await fetch(`https://ays-api.onrender.com/items/getSomeItems`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(this.state.localStorageCarList)
            });
            const data = await response.json();
            vanillaItemsList = [...data];
            this.setState({
                isLoading: false
            })
        } catch (error) {
            console.error("Error fetching items:", error);
        }
        console.log("setState fetch");

        let readyToRenderItemsList = [];

        for (const d of this.state.localStorageCarList) {
            const articulo = vanillaItemsList.find(a => a._id === d._id);

                            // Si selecciono el ultimo priceXSize disponible y luego lo borro en admin
                            //  podria estar intentando acceder fuera de rango.
                            // El articulo no pusheado en readyToRenderItemsList por lo anteriormente explicado
                            //  sigue en el localStorage, hay q resolverlo.
            if (articulo && (articulo.priceXSize.length > d.priceXSizeIndex) && articulo.stock) {
                readyToRenderItemsList.push({...articulo, 
                    priceXSizeIndex: d.priceXSizeIndex, 
                    cant: d.cant || 1,
                    selectedColorId : d.selectedColorId,
                });
            }
        }

        this.setState({
            carList: readyToRenderItemsList,
        })
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

        if (this.state.carList.length) {
            
            // tamb borro el articulo en el localStorage
            const data = localStorage.getItem("car") ? JSON.parse(localStorage.getItem("car")) : [];
            data.splice(indexToRemove, 1);
            localStorage.setItem("car", JSON.stringify(data));
        } else {
            
            // si borre todos los articulos entonces tamb borro el localStorage
            localStorage.removeItem("car");
        }
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
        // console.log("displayedList: ", this.state.displayedList);

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
                            this.state.carList.length && !this.state.isLoading ?
                            this.state.carList.map((elem, index) => {
                                return (
                                    <article className="carrito-articulo">
                                        <button value={index} onClick={this.removeArticle} className="remove-article-btn">X</button>

                                        <img className="carrito-articulo-img" src={elem.images[0]} alt="imagen del producto"/>

                                        <Link to={`/producto/${elem._id}`} style={{color: "black"}}>{elem.name}</Link>

                                        {/* <h4 style={{textAlign: "end", marginLeft: "auto"}} className="carrito-articulo-precio">{elem.priceXSize[elem.priceXSizeIndex].size} <br/>${parseInt(elem.priceXSize[elem.priceXSizeIndex].price) * elem.cant}</h4>    */}
                                        <h4 style={{textAlign: "end", marginLeft: "auto"}} className="carrito-articulo-precio">
                                            <span style={{backgroundColor: "var(--amarillo)", padding: "0.5rem", filter: "brightness(1.3)", borderRadius: "0.3rem"}}>
                                                {elem.colors.find(c => c.colorId === elem.selectedColorId).colorName}
                                            </span>
                                            <br/>
                                            <br/>
                                            {elem.priceXSize[elem.priceXSizeIndex].size} 
                                            <br/>
                                            ${parseInt((parseInt(elem.priceXSize[elem.priceXSizeIndex].price) * (1 - elem.off / 100)) * elem.cant)}
                                        </h4>   

                                        <span style={{fontWeight: "900", display: "flex", flexDirection: "column", position: "relative"}}>
                                                <button className="car-cant-btn"  name={index} onClick={this.changeCant}>+</button>
                                                
                                                <span style={{display: "flex", justifyContent: "center", margin: "0.6rem 0"}}>
                                                    <div>x</div>
                                                    <input name={index} type="text" value={elem.cant} onChange={this.changeCant} style={{backgroundColor: "transparent", border: "none", width: "1.7rem", fontSize: "1rem", margin: "-0.5rem 0"}}/>
                                                </span>
                                                
                                                <button className="car-cant-btn" name={index} onClick={this.changeCant}>-</button>
                                        </span>
                                    </article>
                                )
                            })
                            :
                            this.state.isLoading ?
                                <h2 style={{textAlign: "center", fontFamily: "var(--ffamily01)", height: "1rem", fontSize: "3.5svh"}}>Cargando items..</h2>
                                :
                                <h2 style={{textAlign: "center", fontFamily: "var(--ffamily01)", height: "1rem", fontSize: "3.5svh"}}>Carro de compra vacio :(</h2>
                        }
                    </div>
                    <button className="clear-car-btn encargar-btn encargar-btn-ready" onClick={this.clearCarList}>VACIAR CARRO</button>
                </div>
                <div className="car-info-tile car-tile">
                    {
                        this.state.carList.length && !this.state.isLoading?
                        <CarForm finalPrice={parseInt(this.state.carList.reduce((acc, cur) => acc + (parseInt(cur.priceXSize[cur.priceXSizeIndex].price) * (1 - cur.off / 100)) * parseInt(cur.cant), 0))} itemsList={this.state.carList}/>
                        : null
                    }
                </div>
            </div>
        )
    }
}

export default CarroDeCompra;