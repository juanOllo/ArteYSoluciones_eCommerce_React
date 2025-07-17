import React from "react";

class CarForm extends React.Component{
    constructor(props){
        super(props)

        this.state={
            customerInfo: {
                'name': '',
                'contact': '',
                'date': '',
                'date': '',
                'finalPrice': '',
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

        const data = localStorage.getItem("requests") ? JSON.parse(localStorage.getItem("requests")) : [];

        console.log("itemsList: ", this.props.itemsList);

        const itemsList = this.props.itemsList.map(elem => {
            return {
                'id': elem.id,
                'name': elem.nombre,
                'size': elem.precios[elem.precioFinal],
                'cant': elem.cant
            }
        })

        const newRequest = {
            ...this.state.customerInfo,
            'date': new Date(),
            'items': itemsList,
            'finalPrice': this.props.finalPrice
        }
        
        console.log("customerInfo: ", newRequest);
        
        data.push(newRequest);
        console.log("data: ", data);
        localStorage.setItem("requests", JSON.stringify(data));
        // localStorage.clear("requests");
    }


    render(){
        return(
            <div style={{width: "100%"}}>
                <form className="car-form" onSubmit={this.handleSubmit}>
                    <h1>Completar PEDIDO!</h1>
                    <label htmlFor="input-name">Nombre:</label>
                    <input id="input-name" type="text" onChange={(e) => this.handleInputChange(e, 'name')} required/>

                    <label htmlFor="input-contact">Contacto:</label>
                    <input id="input-contact" type="text" onChange={(e) => this.handleInputChange(e, 'contact')} required/>

                    <h3>Tu encargo:</h3>
                    {
                        this.props.itemsList.map(elem => {
                            return(
                                <h5 style={{marginTop: "0.1rem"}}>(x{elem.cant}) {elem.nombre} [{elem.precios[0][0]}]</h5>
                            )
                        })
                    }

                    <h1>Precio Final: ${this.props.finalPrice}</h1>

                    <button>ENVIAR</button>

                </form>
            </div>
        )
    }
}

export default CarForm;