import React from "react";
import { Link } from "react-router-dom";
import CarForm from './CarForm';
import LoadingScreen from '../../LoadingScreen.jsx';
import { toast } from "sonner";

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

        let readyToRenderItemsList = [];
        
        try {
            // const response = await fetch(`http://localhost:2000/items/getSomeItems`, {
            const response = await fetch(`https://ays-api.onrender.com/items/getSomeItems`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(this.state.localStorageCarList)
            });
            const data = await response.json();
            readyToRenderItemsList = [...data];
            this.setState({
                isLoading: false
            })

        } catch (error) {
            console.error("Error fetching items:", error);
        }
        

        this.setState({
            carList: readyToRenderItemsList,
            isLoading: false
        }, () => {
            // if (response.status === 200) {
                let localStorageCarListWithoutBannedItems = this.state.localStorageCarList.filter(item =>
                    readyToRenderItemsList.some(el => (
                        el._id.toString() === item._id
                        && el.selectedPriceXSizeId === item.selectedPriceXSizeId
                        && el.selectedColorId === item.selectedColorId
                    ))
                );
                console.log("who¿ithoutbanneditems: ", localStorageCarListWithoutBannedItems);

                if (localStorageCarListWithoutBannedItems.length != this.state.localStorageCarList.length) {
                    toast.error("Uno o más de los elementos de tu carrito ya no está disponible ó actualizó su información", {
                        style: { backgroundColor: "var(--rojo2)", border: "0.1rem solid black" }
                    });
                }
    
                localStorage.setItem("car", JSON.stringify(localStorageCarListWithoutBannedItems));
            // }
        })
    }

    clearCarList(){
        localStorage.removeItem("car");

        // e.target.style.animation = "encargar-btn-ready-click-anim 0.1s ease-in-out";
        // setTimeout(() => {
        //     e.target.style.animation = "none";
        // }, 100);

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
        if (this.state.isLoading) {
            return(
                <LoadingScreen />
            )
        }

        return(
            <div id="carro-de-compra">
                <div className="car-list-tile car-tile">
                    <div className="list-div">

                        {this.state.carList.length ?
                            this.state.carList.map((elem, index) => {
                                return (
                                    <article className="carrito-articulo">
                                        <button value={index} onClick={this.removeArticle} className="remove-article-btn">X</button>

                                        <img className="carrito-articulo-img" src={elem.images[0]} alt="imagen del producto"/>

                                        <Link to={`/producto/${elem._id}`} style={{color: "black"}}>{elem.name}</Link>

                                        <h4 style={{textAlign: "end", marginLeft: "auto"}} className="carrito-articulo-precio">
                                            <span style={{backgroundColor: "var(--amarillo)", padding: "0.5rem", filter: "brightness(1.3)", borderRadius: "0.3rem"}}>
                                                {elem.colors.find(c => c.colorId === elem.selectedColorId).colorName}
                                            </span>
                                            <br/>
                                            <br/>
                                            {elem.priceXSize.find(el => el.id === elem.selectedPriceXSizeId).size} 
                                            <br/>
                                            ${parseInt((parseInt(elem.priceXSize.find(el => el.id === elem.selectedPriceXSizeId).price) * (1 - elem.off / 100)) * elem.cant)}
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
                            <h2 style={{textAlign: "center", fontFamily: "var(--ffamily01)", height: "1rem", fontSize: "3.5svh"}}>Carro de compra vacio :(</h2>
                        }
                    </div>
                    <button className="clear-car-btn encargar-btn encargar-btn-ready" 
                        onClick={(e) => {
                            this.clearCarList();
                            e.target.style.animation = "encargar-btn-ready-click-anim 0.1s ease-in-out";
                            setTimeout(() => {
                                e.target.style.animation = "none";
                            }, 100);
                        }}>
                    VACIAR CARRO</button>
                </div>
                <div className="car-info-tile car-tile">
                    <CarForm clearCarList={this.clearCarList} itemsList={this.state.carList} finalPrice={parseInt(this.state.carList.reduce((acc, cur) => acc + (parseInt(cur.priceXSize.find(el => el.id === cur.selectedPriceXSizeId).price) * (1 - cur.off / 100)) * parseInt(cur.cant), 0))}/>
                </div>
            </div>
        )
    }
}

export default CarroDeCompra;