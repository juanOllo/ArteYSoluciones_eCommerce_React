import React from "react";
// import CarroDeCompra from "./CarroDeCompra";
import Checkout from "./Checkout";
import { Toaster, toast } from 'sonner';

class CarForm extends React.Component{
    constructor(props){
        super(props)

        this.state={
            // customerInfo: {},
            customerInfo: localStorage.getItem("customer-info") ? JSON.parse(localStorage.getItem("customer-info")) : {},
            
            email: localStorage.getItem("customer-info") ? JSON.parse(localStorage.getItem("customer-info")).email : "",
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
        this.sendRequest = this.sendRequest.bind(this);

    }

    sendCode = async () => {

        await fetch("http://localhost:2000/emailVerify/send-code", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: this.state.email, name: this.state.customerInfo.name })
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

            // const data = localStorage.getItem("verified-emails") ? JSON.parse(localStorage.getItem("verified-emails")) : [];
            // if (!data.includes(this.state.email)) {
            //     data.push(this.state.email);
            //     localStorage.setItem("verified-emails", JSON.stringify(data));
            // }

            const data = {
                ...this.state.customerInfo,
                'email': this.state.email,
            };
            localStorage.setItem("customer-info", JSON.stringify(data));
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

        // console.log("customerInfo: ", updatedCustomerInfo);
    }

    // handleSubmit(e){
    createPurchaseData(){
        // e.preventDefault();

        // no te permite enviar pedido vacio
        if(this.props.finalPrice<=0){
            return;
        }

        // crea la lista de items del pedido
        const itemsList = this.props.itemsList.map(elem => {
            return {
                'id': elem._id,
                'name': elem.name,
                'price_size_request': elem.priceXSize[elem.priceXSizeIndex],
                'cant': elem.cant,
                'color': {
                    'color_id': elem.selectedColorId,
                    'color_name': elem.colors.find(i => i.colorId == elem.selectedColorId)?.colorName,
                }
            }
        })

        // crea finalmente el pedido
        const newRequest = {
            ...this.state.customerInfo,
            'items': itemsList,
            'finalPrice': this.props.finalPrice,
            'state': 'PENDIENTE'
        }

        return newRequest;
    }

    isFormComplete(){
        // Validación: todos los campos requeridos completos
        return (this.state.customerInfo.name && this.state.customerInfo.lastname && this.state.verified === true && this.props.finalPrice > 0)
    }

    async sendRequest(e) {
    const purchaseData = this.createPurchaseData();

        try {
            const res = await fetch('http://localhost:2000/requests/send-new-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ purchaseData }),
            });

            if (!res.ok) {
                // Si el servidor devolvió un error (status 4xx o 5xx)
                toast.error("Error al enviar la solicitud. 👀", {
                    style: { backgroundColor: "var(--rojo)", border: "0.1rem solid black"}
                });
                console.error("Error al enviar el request:", res.status);
                return Promise.reject("Error al enviar el request");
            }

            // Si llegó acá, el request fue exitoso (status 2xx)
            console.log("Request enviado correctamente");
            toast.success("Solicitud enviada correctamente. 👍✅", {
                style: { backgroundColor: "var(--azul)", border: "0.1rem solid black"}
            });
            return Promise.resolve();

        } catch (error) {
            console.error('Error en onSubmit:', error);
            return Promise.reject(error);
        }
    }

    render(){
        this.createPurchaseData();
        return(
            <div  id="carform" style={{width: "100%"}}>
                <form className="car-form" onSubmit={(e) => {e.preventDefault()}}>
                    <h1>Completá con tu información.</h1>

                    <hr style={{width: "100%"}} />
                    
                    <label style={{width: "45%"}} htmlFor="input-name">Nombre:</label>
                    <label style={{width: "45%"}} htmlFor="input-lastname">Apellido:</label>
                    
                    <input id="input-name" type="text" 
                        value={this.state.customerInfo.name || ""} 
                        onChange={(e) => this.handleInputChange(e.target.value, 'name')} required
                        readOnly={this.state.verified}/>

                    <input id="input-lastname" type="text" 
                        value={this.state.customerInfo.lastname || ""} 
                        onChange={(e) => this.handleInputChange(e.target.value, 'lastname')} required
                        readOnly={this.state.verified}/>

                    {/* <hr />
                    <p>Si preferis recibir la información de tu compra via Whatsapp entonces ingresá tu número, 
                        preciona VERIFICAR NUMERO y deberias recibir un codigo 
                        para verificar que el numero es correcto.
                    </p>
                    <label htmlFor="input-contact">Numero de telefono:</label>
                    <input id="input-contact" type="text" onChange={(e) => this.handleInputChange(e, 'contact')} required/>
                    <button>VERIFICAR NUMERO</button> */}

                    <hr style={{width: "100%"}} />

                    <label style={{width: "10%"}} htmlFor="input-email">Email:</label>
                    <p style={{...((this.state.email !== "")&&this.state.verified != true ? { opacity: "0.8" } : { opacity: "0" }), backgroundColor: "", margin: "0 0 0 auto", width:"85%", textAlign:"center" }}>
                        (Enviaremos un código a tu dirección de email para verificarlo.)</p>
                    <input value={this.state.customerInfo.email || this.state.email || ""} style={{width: "50%", margin: "0 0 0 3%"}} id="input-email" type="email" 
                        onChange={(e) => this.setState({email : e.target.value})} required
                        readOnly={this.state.verified}/>

                    {this.state.verified ?

                        <button style={{marginRight: "auto"}} 
                            onClick={() => this.setState({
                                customerInfo: {},
                                email: "",
                                verified: null
                            })}
                        >Usar otra direccion de email</button>   
                    :
                        <button style={{...((this.state.email !== "")&&this.state.verified != true ? { opacity: "0.8" } : { opacity: "0" }), marginRight: "auto"}} 
                        onClick={() => {
                            const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                            if (regexEmail.test(this.state.email)) {
                                this.sendCode();
                                // console.log("valido");
                            } else {
                                toast.success("Formato de email incorrecto. 👀", {
                                    style: { backgroundColor: "var(--rojo)", border: "0.1rem solid black"}
                                });
                                    // console.log("invalido");
                            }
                        }}
                        >Enviar código</button>
                    }

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

                    <h2 style={{width: "99%", textAlign: "center"}}>Precio Final: ${this.props.finalPrice}</h2>

                    {this.isFormComplete() && (
                        <div>
                            <h3>IMPORTANTE:</h3>

                            <p>Recibirá un mail de xxxxx con los datos de tranferencia, 
                                todos los posibles destinatarios de la tranferencia están SI O SI a nombre de "Lucas Emanuel Ollo", 
                                IMPORTANTE nunca le vamos a pedir una tranferencia a otra direccion q no esté a ese mismo nombre.
                                <br /><br />
                                Su pedido actualmente está en espera de aprobación, 
                                será notificado via email por cualquier información.
                            </p>

                            <button onClick={(e) => this.sendRequest(e)} className="send-request-btn-ready send-request-btn">
                                ENVIAR PEDIDO
                            </button>
                        </div>
                    )}

                    {/* ESTO ES PARA CUANDO SE PAGUE VIA WEB */}
                        {/* {this.isFormComplete() && (
                            <Checkout finalPrice={this.props.finalPrice} createPurchaseData={this.createPurchaseData} />
                        )} */}


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

                    {/* {
                        this.state.customerInfo.name && this.state.customerInfo.contact && this.props.finalPrice>0 ?
                        <button className="send-request-btn-ready send-request-btn">ENVIAR</button>
                        :
                        <button className="send-request-btn" style={{backgroundColor: "transparent"}}>ENVIAR</button>
                    } */}
                </form>
                <Toaster position='bottom-right' style={{marginTop: "3rem"}} />
            </div>
        )
    }
}

export default CarForm;