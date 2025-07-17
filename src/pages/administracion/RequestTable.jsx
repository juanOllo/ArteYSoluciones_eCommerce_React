import React from 'react';
// import './Administracion.css';

class RequestTable extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            requestsList : localStorage.getItem("requests") ? JSON.parse(localStorage.getItem("requests")) : [],
        }

        this.handleClearRequestList = this.handleClearRequestList.bind(this);
    }

    handleClearRequestList(){
        localStorage.clear("requests");
        this.setState({
            requestsList : []
        })
    }

    render(){
        // console.log("requestList: ", this.state.requestsList);
        return(
            <div style={{marginBottom: "3rem"}}>
                {/* <h1>RequestTableH1</h1> */}
                <table>
                    <thead>
                        <th>Cliente</th>
                        <th>Contacto</th>
                        <th style={{width: "45rem"}}>Lista de compra</th>
                        <th style={{width: "10rem"}}>Precio Final</th>
                        <th style={{width: "5rem"}}>Fecha</th>
                    </thead>

                    <tbody>

                        {
                            this.state.requestsList.map(elem => {
                                return(
                                    <tr>
                                        <td>{elem.name}</td>

                                        <td>{elem.contact}</td>

                                        <td>
                                            {
                                                elem.items.map(item => {
                                                    return(
                                                        <div style={{display: "flex"}}>

                                                            <h5 style={{marginRight: "1rem"}}>[{item.id}]</h5>
                                                            <h5>{item.name}</h5>
                                                            <h5 style={{marginLeft: "auto"}}>{item.size[0]}</h5>
                                                            <h5 style={{marginLeft: "1rem"}}>(X{item.cant})</h5>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </td>

                                        <td>${elem.finalPrice}</td>

                                        <td>{elem.date}</td>
                                    </tr>
                                )
                            })
                        }

                    </tbody>
                </table>

                <button style={{margin: "3rem 0"}} onClick={this.handleClearRequestList}>BORRAR PEDIDOS</button>
            </div>
        )
    }
}

export default RequestTable;