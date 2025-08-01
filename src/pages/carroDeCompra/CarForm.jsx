import React from "react";
// import CarroDeCompra from "./CarroDeCompra";

class CarForm extends React.Component{
    constructor(props){
        super(props)

        this.state={
            customerInfo: {
                // 'name': '',
                // 'contact': '',
                // 'date': '',
                // 'finalPrice': '',
            }
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(e, key){
        const updatedCustomerInfo = {
            ...this.state.customerInfo,
            [key]: e.target.value
        }

        this.setState({
            customerInfo: updatedCustomerInfo,
        })
    }

    handleSubmit(e){
        e.preventDefault();

        console.log("target: ", e.target.lastChild);

        if(this.props.finalPrice<=0){
            return;
        }

        e.target.lastChild.style.animation = "encargar-btn-ready-click-anim 0.1s ease-in-out";
        setTimeout(() => {
            e.target.lastChild.style.animation = "none";
        }, 100);

        setTimeout(() => {
            for (let i = e.target.childNodes.length-1; i >= 0; i--) {
                setTimeout(() => {
                    
                    e.target.childNodes[i].style.display = "none";
                }, (100*(e.target.childNodes.length-i)));
            }
        }, 1000);

        setTimeout(() => {
            e.target.style.animation = "none";
        }, 100);

        const data = localStorage.getItem("requests") ? JSON.parse(localStorage.getItem("requests")) : [];

        console.log("itemsList: ", this.props.itemsList);

        const itemsList = this.props.itemsList.map(elem => {
            return {
                'id': elem.id,
                'name': elem.nombre,
                'priceXSizeRequest': elem.priceXSize[elem.priceXSizeIndex],
                'cant': elem.cant
            }
        })

        const date = new Date();

        const formerDate = date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

        const newRequest = {
            ...this.state.customerInfo,
            'date': formerDate,
            'items': itemsList,
            'finalPrice': this.props.finalPrice
        }
        
        // console.log("customerInfo: ", newRequest);
        
        data.push(newRequest);
        // console.log("data: ", data);
        localStorage.setItem("requests", JSON.stringify(data));

        // setTimeout(() => {
            
            localStorage.removeItem("car");
        // }, 1000);

    }


    render(){
        return(
            <div  id="carform" style={{width: "100%"}}>
                <form className="car-form" onSubmit={this.handleSubmit}>
                    <h1>Completar PEDIDO!</h1>
                    <label htmlFor="input-name">Nombre y apellido:</label>
                    <input id="input-name" type="text" onChange={(e) => this.handleInputChange(e, 'name')} required/>

                    <label htmlFor="input-contact">Contacto:</label>
                    <input id="input-contact" type="text" onChange={(e) => this.handleInputChange(e, 'contact')} required/>

                    <h3>Tu encargo:</h3>
                    {
                        this.props.itemsList.map(elem => {
                            return elem.cant > 0 ?
                            (
                                <h5 style={{marginTop: "0.1rem"}}>(x{elem.cant}) {elem.nombre} [{elem.priceXSize[elem.priceXSizeIndex].size}]</h5>
                            )
                            :
                            null
                        })
                    }

                    <h1>Precio Final: ${this.props.finalPrice}</h1>

                    {
                        this.state.customerInfo.name && this.state.customerInfo.contact && this.props.finalPrice>0 ?
                        <button className="send-request-btn-ready send-request-btn">ENVIAR</button>
                        :
                        <button className="send-request-btn" style={{backgroundColor: "transparent"}}>ENVIAR</button>
                    }

                </form>
            </div>
        )
    }
}

export default CarForm;