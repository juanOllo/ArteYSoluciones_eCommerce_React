import React from "react";
// import CarroDeCompra from "./CarroDeCompra";
import Checkout from "./Checkout";
import { Toaster, toast } from 'sonner';

class CarForm extends React.Component{
    constructor(props){
        super(props)

        this.state={
            // customerInfo: {},
            customerInfo: localStorage.getItem("customer-info") ? 
                JSON.parse(localStorage.getItem("customer-info")) 
                : 
                {
                    name: "",
                    lastname: "",
                    email: ""
                },
            
            email: localStorage.getItem("customer-info") ? JSON.parse(localStorage.getItem("customer-info")).email : "",
            code : "",
            // verified: null,
            verified: localStorage.getItem("customer-info") ? true : null,
            isCodeSended: false,

            sendType: null,

            isTryingToSendRequest: false,
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.createPurchaseData = this.createPurchaseData.bind(this);

        this.sendCode = this.sendCode.bind(this);
        this.verifyCode = this.verifyCode.bind(this);
        
        this.isFormComplete = this.isFormComplete.bind(this);
        this.sendRequest = this.sendRequest.bind(this);

    }

    sendCode = async () => {

        if (this.state.customerInfo.name === "" || this.state.customerInfo.lastname === "") {
            toast.error("Completa la informacion anterior 👆", {
                style: { backgroundColor: "var(--rojo)", border: "0.1rem solid black"}
            });
            return;
        }

        await fetch("http://localhost:2000/emailVerify/send-code", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: this.state.email, name: this.state.customerInfo.name })
        });

        toast.success("Codigo enviado. 📨", {
            style: { backgroundColor: "var(--azul)", border: "0.1rem solid black"}
        });
        // alert("Código enviado a tu correo");
        this.setState({ isCodeSended: true })
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
            this.requestSendedSoClearData();
            return Promise.resolve();

        } catch (error) {
            console.error('Error en onSubmit:', error);
            return Promise.reject(error);
        }
    }

    requestSendedSoClearData(){
        localStorage.removeItem("car");
        this.props.clearCarList();
        this.setState({isTryingToSendRequest: false});
    }

    render(){
        return(
            <div  id="carform" style={{width: "100%"}}>
                <form className="car-form" onSubmit={(e) => {e.preventDefault()}}>
                    <h1>Completá con tu información.</h1>

                    <hr style={{width: "100%"}} />
                    
                    <label style={{width: "45%"}} htmlFor="input-name">Nombre *</label>
                    <label style={{width: "45%"}} htmlFor="input-lastname">Apellido *</label>
                    
                    <input id="input-name" type="text" 
                        value={this.state.customerInfo.name || ""} 
                        onChange={(e) => this.handleInputChange(e.target.value, 'name')} required
                        // readOnly={this.state.verified}
                        disabled={this.state.verified}
                        style={this.state.verified ? {opacity: "0.5"} : {}}
                    />

                    <input id="input-lastname" type="text" 
                        value={this.state.customerInfo.lastname || ""} 
                        onChange={(e) => this.handleInputChange(e.target.value, 'lastname')} required
                        // readOnly={this.state.verified}
                        disabled={this.state.verified}
                        style={this.state.verified ? {opacity: "0.5"} : {}}
                    />

                    {/* <hr />
                    <p>Si preferis recibir la información de tu compra via Whatsapp entonces ingresá tu número, 
                        preciona VERIFICAR NUMERO y deberias recibir un codigo 
                        para verificar que el numero es correcto.
                    </p>
                    <label htmlFor="input-contact">Numero de telefono:</label>
                    <input id="input-contact" type="text" onChange={(e) => this.handleInputChange(e, 'contact')} required/>
                    <button>VERIFICAR NUMERO</button> */}

                    {/* <hr style={{width: "100%"}} /> */}

                    <label style={{width: "20%", margin: "1.5rem auto -1.2rem 2.5%"}} htmlFor="input-email">Email *</label>
                    <p style={{...((this.state.email !== "")&&this.state.verified != true ? { opacity: "0.8" } : { opacity: "0" }), backgroundColor: "", margin: "0 0 0 auto", width:"85%", textAlign:"center" }}>
                        (Enviaremos un código a tu dirección de email para verificarlo.)</p>
                    <input value={this.state.customerInfo.email || this.state.email || ""} id="input-email" type="email" 
                        onChange={(e) => this.setState({email : e.target.value})} required
                        // readOnly={this.state.verified}
                        disabled={this.state.verified}
                        style={{width: "50%", margin: "0 0 0 2.5%", ...(this.state.verified ? {opacity: "0.5"} : {})}} 
                    />

                    {this.state.verified ?

                        <button style={{marginRight: "auto"}} 
                            onClick={() => this.setState({
                                customerInfo: {},
                                email: "",
                                verified: null
                            })}
                        >Usar otra información</button>   
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
                        this.state.isCodeSended && !this.state.verified?
                            <div style={{width: "100%"}}>
                                <input style={{width: "30%", margin: "0.5rem 5% 0 2.5%"}}
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

                    {/* PARA TRATAR LA ENTREGA DEL PRODUCTO */}
                    {/* <hr style={{width: "100%"}} />

                    <div className="car-form-send-tipe-btns-div">
                        <button className="car-form-send-tipe-btn"
                            style={{
                                "--border-color": this.state.sendType === "retiro" ? "var(--amarillo)" : "rgba(0,0,0,0.3)",
                                border: this.state.sendType === "retiro" ? "0.5rem solid var(--amarillo)" : "0.5rem solid rgba(0,0,0,0.3)",
                                // backgroundColor: this.state.sendType === "retiro" ? "rgba(255,255,255,0.3)" : "var(--verde)"
                            }}
                            onClick={() => this.setState({ sendType: "retiro" })}
                        >
                        Retiro
                        </button>
                        <button className="car-form-send-tipe-btn"
                            style={{
                                "--border-color": this.state.sendType === "envio" ? "var(--amarillo)" : "rgba(0,0,0,0.3)",
                                border: this.state.sendType === "envio" ? "0.5rem solid var(--amarillo)" : "0.5rem solid rgba(0,0,0,0.3)",
                                // backgroundColor: this.state.sendType === "envio" ? "rgba(255,255,255,0.3)" : "var(--verde)"
                            }}
                            onClick={() => this.setState({ sendType: "envio" })}
                        >
                        Envio
                        </button>
                    </div>

                    {this.state.sendType ?
                        this.state.sendType === "retiro" ?
                            <p style={{margin: "2rem 0 0 0", maxWidth: "80%"}}>
                                Información de retiro.
                                Información de retiro.
                                Información de retiro.
                                Información de retiro.
                                Información de retiro.
                                Información de retiro.
                                Información de retiro.
                                Información de retiro.
                                Información de retiro.
                                Información de retiro.
                                Información de retiro.
                                Información de retiro.
                                Información de retiro.
                                Información de retiro.
                                Información de retiro.
                                Información de retiro.
                            </p>
                            :
                            <p style={{margin: "2rem 0 0 0", maxWidth: "80%"}}>
                                Información de envio.
                            </p>
                        :
                        null
                    } */}

                    <hr style={{width: "100%"}} />

                    <h2 className="car-form-final-price" key={this.props.finalPrice} style={{width: "99%", textAlign: "center"}}>Precio Final: ${this.props.finalPrice}</h2>

                    {this.isFormComplete() && (
                        <div>
                            {/* <h3>IMPORTANTE:</h3>

                            <p>Recibirá un mail de xxxxx con los datos de tranferencia, 
                                todos los posibles destinatarios de la tranferencia están SI O SI a nombre de "Lucas Emanuel Ollo", 
                                IMPORTANTE nunca le vamos a pedir una tranferencia a otra direccion q no esté a ese mismo nombre.
                                <br /><br />
                                Su pedido actualmente está en espera de aprobación, 
                                será notificado via email por cualquier información.
                            </p> */}

                            <h3 style={{opacity: "0", animation: "fadeInToRight 0.8s ease-in-out 0.2s forwards"}}>
                                Método de Pago.
                            </h3>

                            <p style={{opacity: "0", animation: "fadeInToRight 0.8s ease-in-out 0.3s forwards", backgroundColor: "rgba(255, 255, 255, 0.3)", padding: "0.5rem", borderRadius: "0.3rem"}}>
                            {/* <p> */}
                                Una vez confirmado el pedido, recibirás los datos bancarios por email para realizar la transferencia. El pedido se procesará cuando recibamos el comprobante.
                            </p>

                            <h4 style={{opacity: "0", animation: "fadeInToRight 0.8s ease-in-out 0.8s forwards"}}>IMPORTANTE:</h4>

                            <p style={{opacity: "0", animation: "fadeInToRight 0.8s ease-in-out 0.9s forwards", backgroundColor: "rgba(255, 255, 255, 0.3)", padding: "0.5rem", borderRadius: "0.3rem"}}>
                                Todos los posibles destinatarios de la tranferencia están SÍ O SÍ a nombre de "Lucas Emanuel Ollo", 
                                nunca le vamos a pedir una tranferencia a una cuenta que no esté a ese mismo nombre.
                            </p>

                            <div style={{display: "flex", justifyContent: "start", columnGap: "1.5rem"}}>
                                <button className="send-request-btn"
                                    onClick={(e) => {
                                        if (!this.state.isTryingToSendRequest) {
                                            this.setState({isTryingToSendRequest: true})
                                            this.sendRequest(e)
                                        }
                                    }} 
                                    // style={this.state.isTryingToSendRequest ? {animation: "encargar-btn-ready-click-anim 0.1s ease-in-out"} : {animation: "none"}}
                                    // style={this.state.isTryingToSendRequest ? {boxShadow: "0 0 transparent", transform: "translate(0.3rem, 0.3rem)", backgroundColor: "var(--verde)"} : {}}
                                    style={this.state.isTryingToSendRequest ? {animation: "car-form-send-request-btn-pressed-anim 0.05s ease-in-out 0s forwards"} : {animation: "fadeInToRight 0.8s ease-in-out 1.4s forwards"}}
                                >
                                    ENVIAR PEDIDO
                                </button>

                                <p style={{opacity: "0", ...(this.state.isTryingToSendRequest ? {animation: "fadeInToRight 0.4s ease-in-out 0s forwards"} : {})}}>enviando...</p>
                                <div className="car-form-yellow-star-01"
                                    style={this.state.isTryingToSendRequest ? {display: "block"} : {display: "none"}}
                                ></div>
                            </div>
                            
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