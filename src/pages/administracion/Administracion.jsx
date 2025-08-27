// import ReactDOM from 'react-dom';
import React from 'react';
import './Administracion.css';
import RequestTable from './RequestTable';
import ItemsTable from './ItemsTable';
import ColorsTable from './ColorsTable';

class Administracion extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            setKeyToRender: '',

            isLogged: false,
            username: "",
            password: "",
            token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : "",
            // token: "",

            isDemoStarted: false,
        }

        this.tryLogin = this.tryLogin.bind(this)
    }

    async componentDidMount(){
        if (this.state.token === "") return;

        // Consulta si el token guardado en el localStorage sigue siendo util
        try {
            // const response = await fetch("http://localhost:2000/admin/tokenStillAvailable", {
            const response = await fetch("https://ays-api.onrender.com/admin/tokenStillAvailable", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.state.token}`
                }
            });
            const data = await response.json();
            // console.log("data; ", data);

            if (data.tokenStillAvailable) {
                this.setState({ isLogged: true });
            } else {
                this.setState({ token: "" });
                localStorage.removeItem("token");
            }
        } catch (error) {
            console.error("Token no available:", error);
            this.setState({
                token: "",
            })
        }
    }

    async tryLogin(e){
        e.preventDefault();

        try{
            // const response = await fetch(`http://localhost:2000/admin/login`, {
            const response = await fetch(`https://ays-api.onrender.com/admin/login`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: this.state.username,
                    password: this.state.password,
                }),
            });

            if (!response.ok) {
                window.alert(`Usuario o conrtaseña incorrecta!!`);

                this.setState({ username: "", password: "" });

                throw new Error(`Error del servidor: ${response.status}`);
            } else {
                window.alert(`Login correctamente!!`);
            }
            
            const data = await response.json();

            this.setState({ token: await data.token, isLogged: true});

            localStorage.setItem("token", JSON.stringify(data.token));

        } catch (error) {
            console.error("Login error:", error);
        }
    }

    whitchTableRender() {
        switch (this.state.setKeyToRender) {
            case 'items':
                return <ItemsTable token={this.state.token}/>;
            case 'colors':
                return <ColorsTable token={this.state.token}/>;
            default:
                return null;
        }
    }

    render(){

        console.log("token: ", this.state.token);

        return(
            <div className='administracion-body'>

                {/* <div className='admin-text'>
                    <h3>SECCIÓN ADMINISTRATIVA</h3>
                    <h5 style={{width: "30rem", margin: "0 auto 2rem"}}>
                        Esta seccion te da control sobre los productos de la pagina.
                        <br />
                        En este caso se creara una version demo cada vez que presiones el boton "GUARDAR" 
                        luego de editar la informacion de los productos, 
                        dando asi ejemplo de como responderia la pagina a estos cambios. 
                        <br />
                        Editá y explorá a tu gusto y cuando quieras volver a la versión original 
                        de la pagina solo da click en el boton "TERMINAR DEMO".

                        <br />
                        <br />
                        ACLARACION: Esta seccion estaria oculta en una version final del producto.
                    </h5>
                </div> */}

                {
                    !this.state.isLogged && !this.state.isDemoStarted?
                        <div className='admin-form-div'>
                            <form className="admin-form" onSubmit={this.tryLogin}>
                                <input value={this.state.username} onChange={(e) => this.setState({ username: e.target.value})} type="text" />
                                <input value={this.state.password} onChange={(e) => this.setState({ password: e.target.value})} type="password" />
                                <button>ENVIAR</button>
                            </form>
                            <button onClick={() => this.setState({ isDemoStarted: true })} style={{marginTop: "1rem"}}>MODO DEMO</button>
                        </div>
                        :
                        null
                }

                <div style={{display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", width: "calc(100% - 1rem)", padding: "0 0.5rem", marginTop: "4.5rem"}}>
                    <select name="admin-table-select" id="admin-table-select" value={this.state.setKeyToRender}
                        onChange={e => this.setState({ setKeyToRender: e.target.value })}
                        style={{padding: "0.5rem"}}
                    >
                        <option value="">---DESPLEGAR TABLAS---</option>
                        <option value="items">TABLA DE ITEMS</option>
                        <option value="colors">TABLA DE COLORES</option>
                    </select>
                </div>

                {this.whitchTableRender()}

                {/* <RequestTable /> */}

            </div>
        )
    }
}

export default Administracion;