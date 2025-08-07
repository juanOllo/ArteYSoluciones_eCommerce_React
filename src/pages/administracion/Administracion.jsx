// import ReactDOM from 'react-dom';
import React from 'react';
import './Administracion.css';
import RequestTable from './RequestTable';
import ItemsTable from './ItemsTable';

class Administracion extends React.Component{
    // constructor(props){
    //     super(props);
    // }

    render(){

        return(
            <div className='administracion-body'>

                <div className='admin-text'>
                    <h3>SECCIÓN DE ADMINISTRACIÓN</h3>
                    <h5 style={{width: "30rem", margin: "0 auto 2rem"}}>
                        Esta seccion te da control sobre los productos de la pagina.
                        <br />
                        {/* En este caso se creara una version demo luego de editar la informacion 
                        y clickear el boton "GUARDAR",  */}
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
                </div>

                <ItemsTable originalList={this.props.originalList} updateOriginalList={this.props.updateOriginalList}/>

                <RequestTable />

            </div>
        )
    }
}

export default Administracion;