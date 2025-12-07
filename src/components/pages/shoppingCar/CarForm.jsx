import React from "react";
// import CarroDeCompra from "./CarroDeCompra";
import Checkout from "./Checkout";

class CarForm extends React.Component{
    constructor(props){
        super(props)

        this.state={
            customerInfo: {},
            email: "",
            code : "",
            verified: null,
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.sendCode = this.sendCode.bind(this);
        this.verifyCode = this.verifyCode.bind(this);
    }
    // const [email, setEmail] = useState("");
    // const [code, setCode] = useState("");
    // const [verified, setVerified] = useState(null);

    sendCode = async () => {

        await fetch("http://localhost:2000/emailVerify/send-code", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: this.state.email })
        });
        alert("Código enviado a tu correo");
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

        if(data.verified)
            this.handleInputChange(this.state.email, 'email');
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

    handleSubmit(e){
        e.preventDefault();

        // console.log("target: ", e.target.lastChild);

        // no te permite enviar pedido vacio
        if(this.props.finalPrice<=0){
            return;
        }

        // // animacion de boton ENVIAR listo
        // e.target.lastChild.style.animation = "encargar-btn-ready-click-anim 0.1s ease-in-out";
        // setTimeout(() => {
        //     e.target.lastChild.style.animation = "none";
        // }, 100);

        // // desaparece todos los elementos del form
        // setTimeout(() => {
        //     for (let i = e.target.childNodes.length-1; i >= 0; i--) {
        //         setTimeout(() => {
                    
        //             e.target.childNodes[i].style.display = "none";
        //         }, (100*(e.target.childNodes.length-i)));
        //     }
        // }, 1000);

        // setTimeout(() => {
        //     e.target.style.animation = "none";
        // }, 100);

        const data = localStorage.getItem("requests") ? JSON.parse(localStorage.getItem("requests")) : [];

        // console.log("itemsList: ", this.props.itemsList);

        // crea la lista de items del pedido
        const itemsList = this.props.itemsList.map(elem => {
            return {
                'id': elem.id,
                'name': elem.name,
                'priceXSizeRequest': elem.priceXSize[elem.priceXSizeIndex],
                'cant': elem.cant
            }
        })

        // crea y forma la fecha del pedido
        const date = new Date();
        const formerDate = date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

        // crea finalmente el pedido
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
                    <h1>Completá con tu información.</h1>

                    <label style={{width: "45%"}} htmlFor="input-name">Nombre:</label>
                    <label style={{width: "45%"}} htmlFor="input-lastname">Apellido:</label>
                    <input id="input-name" type="text" onChange={(e) => this.handleInputChange(e.target.value, 'name')} required/>
                    {/* <input id="input-name" type="text" onChange={(e) => this.setState({customerInfo : {name : e.target.value}})} required/> */}

                    <input id="input-lastname" type="text" onChange={(e) => this.handleInputChange(e.target.value, 'lastname')} required/>

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
                    <input id="input-email" type="email" onChange={(e) => this.setState({email : e.target.value})} required/>
                    <button onClick={this.sendCode}>Enviar código</button>

                    <input
                        type="text"
                        placeholder="Ingresa el código"
                        value={this.state.code}
                        onChange={(e) => this.setState({code : e.target.value})}
                    />
                    <button onClick={this.verifyCode}>Verificar</button>

                    {this.state.verified !== null && (
                        <p>{this.state.verified ? "✅ Email verificado" : "❌ Código incorrecto"}</p>
                    )}

                    <hr style={{width: "100%"}} />

                    <Checkout />

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

                    <p>Proximamente...</p>

                </form>
            </div>
        )
    }
}

export default CarForm;