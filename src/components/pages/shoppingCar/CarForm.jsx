import React from "react";
// import CarroDeCompra from "./CarroDeCompra";
import Checkout from "./Checkout";

class CarForm extends React.Component{
    constructor(props){
        super(props)

        this.state={
            // customerInfo: {},
            customerInfo: localStorage.getItem("customer-info") ? JSON.parse(localStorage.getItem("customer-info")) : {},
            
            email: "",
            code : "",
            // verified: null,
            verified: localStorage.getItem("customer-info") ? true : null,
            isCodeSended: false
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.createPurchaseData = this.createPurchaseData.bind(this);

        this.sendCode = this.sendCode.bind(this);
        this.verifyCode = this.verifyCode.bind(this);
        
        this.isFormComplete = this.isFormComplete.bind(this);

    }

    sendCode = async () => {

        await fetch("http://localhost:2000/emailVerify/send-code", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: this.state.email })
        });
        alert("Código enviado a tu correo");
        this.setState({ isCodeSended: true  })
    };

    verifyCode = async () => {

        const res = await fetch("http://localhost:2000/emailVerify/verify-code", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: this.state.email, code: this.state.code })
        });
        const data = await res.json();

        this.setState({
            verified: data.verified
        })

        if(data.verified){
            this.handleInputChange(this.state.email, 'email');

            const data = localStorage.getItem("verified-emails") ? JSON.parse(localStorage.getItem("verified-emails")) : [];
            if (!data.includes(this.state.email)) {
                data.push(this.state.email);
                localStorage.setItem("verified-emails", JSON.stringify(data));
            }
        }
    };

    handleInputChange(newInfo, key){
        const updatedCustomerInfo = {
            ...this.state.customerInfo,
            [key]: newInfo
        }

        this.setState({
            customerInfo: updatedCustomerInfo,
        })

        console.log("customerInfo: ", updatedCustomerInfo);
    }

    // handleSubmit(e){
    createPurchaseData(){
        // e.preventDefault();

        // no te permite enviar pedido vacio
        if(this.props.finalPrice<=0){
            return;
        }

        // const data = localStorage.getItem("requests") ? JSON.parse(localStorage.getItem("requests")) : [];

        // crea la lista de items del pedido
        const itemsList = this.props.itemsList.map(elem => {
            return {
                'id': elem._id,
                'name': elem.name,
                'price_size_request': elem.priceXSize[elem.priceXSizeIndex],
                'cant': elem.cant
            }
        })

        // crea finalmente el pedido
        const newRequest = {
            ...this.state.customerInfo,
            'items': itemsList,
            'finalPrice': this.props.finalPrice
        }

        return newRequest;
        
        // data.push(newRequest);
        // localStorage.setItem("requests", JSON.stringify(data));

        // localStorage.removeItem("car");
    }

    isFormComplete(){
        // Validación: todos los campos requeridos completos
        return (this.state.customerInfo.name && this.state.customerInfo.lastname && this.state.verified === true && this.props.finalPrice > 0)
    }

    render(){
        return(
            <div  id="carform" style={{width: "100%"}}>
                <form className="car-form" onSubmit={(e) => {e.preventDefault()}}>
                    <h1>Completá con tu información.</h1>

                    <label style={{width: "45%"}} htmlFor="input-name">Nombre:</label>
                    <label style={{width: "45%"}} htmlFor="input-lastname">Apellido:</label>
                    
                    <input value={this.state.customerInfo.name || ""} id="input-name" type="text" onChange={(e) => this.handleInputChange(e.target.value, 'name')} required/>
                    <input value={this.state.customerInfo.lastname || ""} id="input-lastname" type="text" onChange={(e) => this.handleInputChange(e.target.value, 'lastname')} required/>

                    {/* <hr />
                    <p>Si preferis recibir la información de tu compra via Whatsapp entonces ingresá tu número, 
                        preciona VERIFICAR NUMERO y deberias recibir un codigo 
                        para verificar que el numero es correcto.
                    </p>
                    <label htmlFor="input-contact">Numero de telefono:</label>
                    <input id="input-contact" type="text" onChange={(e) => this.handleInputChange(e, 'contact')} required/>
                    <button>VERIFICAR NUMERO</button> */}

                    <hr style={{width: "100%"}} />

                    <label style={{width: "95%"}} htmlFor="input-email">Email:</label>
                    <p style={{opacity: "0.8", backgroundColor: "", margin: "0 auto 1rem 4%"}}>
                        (Enviaremos un código a tu dirección de email para verificarlo.)</p>
                    <input  value={this.state.customerInfo.email || this.state.email || ""} style={{width: "50%", margin: "0 0 0 3%"}} id="input-email" type="email" onChange={(e) => this.setState({email : e.target.value})} required/>
                    <button style={{marginRight: "auto"}} onClick={this.sendCode}>Enviar código</button>

                    {
                        this.state.isCodeSended ?
                            <div style={{width: "100%"}}>
                                <input style={{width: "30%", margin: "0.5rem 5% 0 3%"}}
                                    type="text"
                                    placeholder="Ingresa el código"
                                    value={this.state.code}
                                    onChange={(e) => this.setState({code : e.target.value})}
                                />
                                <button style={{margin: "0 auto 0 0", padding: "0.6rem"}} onClick={this.verifyCode}>Verificar</button>
                            </div>
                            :
                            null
                    }

                    {this.state.verified !== null && (
                        <p>{this.state.verified ? "✅ Email verificado" : "❌ Código incorrecto"}</p>
                    )}

                    <hr style={{width: "100%"}} />

                    {this.isFormComplete() && (
                        <Checkout finalPrice={this.props.finalPrice} createPurchaseData={this.createPurchaseData} />
                    )}


                    {/* <h3>Tu encargo:</h3>
                    {
                        this.props.itemsList.map(elem => {
                            return elem.cant > 0 ?
                            (
                                <h5 style={{marginTop: "0.1rem"}}>(x{elem.cant}) {elem.name} <br />- [Tamaño: {elem.priceXSize[elem.priceXSizeIndex].size}] [Color: {elem.colors.find(c => c.colorId === elem.selectedColorId).colorName}]</h5>
                            )
                            :
                            null
                        })
                    } */}

                    <h1 style={{width: "99%", textAlign: "center"}}>Precio Final: ${this.props.finalPrice}</h1>

                    {/* {
                        this.state.customerInfo.name && this.state.customerInfo.contact && this.props.finalPrice>0 ?
                        <button className="send-request-btn-ready send-request-btn">ENVIAR</button>
                        :
                        <button className="send-request-btn" style={{backgroundColor: "transparent"}}>ENVIAR</button>
                    } */}
                </form>
            </div>
        )
    }
}

export default CarForm;