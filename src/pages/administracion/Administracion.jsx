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
        }
    }

    whitchRender() {
        switch (this.state.setKeyToRender) {
            case 'items':
                return <ItemsTable />;
            case 'colors':
                return <ColorsTable />;
            default:
                return null;
        }
    }

    render(){

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

                <div style={{display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", width: "calc(100% - 1rem)", padding: "0 0.5rem", marginTop: "4.5rem"}}>
                    <button onClick={() => this.setState({ setKeyToRender: 'items' })} style={{padding: "0.5rem"}}>
                        CARGAR LISTA DE PRODUCTOS
                    </button>
                    <button onClick={() => this.setState({ setKeyToRender: 'colors' })} style={{padding: "0.5rem"}}>
                        CARGAR LISTA DE COLORES
                    </button>
                </div>

                {this.whitchRender()}

                {/* <RequestTable /> */}

            </div>
        )
    }
}

export default Administracion;