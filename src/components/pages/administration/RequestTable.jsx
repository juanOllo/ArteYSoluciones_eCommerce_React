import React from 'react';
// import './Administracion.css';

class RequestTable extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            requestsList : [],
        }
    }

    async componentDidMount(){
        try {
            // const response = await fetch("http://localhost:2000/admin/all-requests", {
            const response = await fetch("https://ays-api.onrender.com/admin/all-requests", {
                method: "GET",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.props.token}`
                },
            });
            const data = await response.json();
            console.log("Lista de Requests:", data);
            this.setState({ requestsList: data });
        } catch (error) {
            console.error("Error fetching requests:", error);
        }
    }

    render(){
        
        return(
            <div style={{marginBottom: "3rem"}}>
                {
                !Array.isArray(this.state.requestsList)?
                    <h2>Esta tabla solo esta disponible en el modo admin.</h2>
                    :
                    <table>
                        <thead>
                            <tr>
                                <th style={{width: "8rem"}}>Cliente</th>
                                <th style={{width: "8rem"}}>Contacto</th>
                                <th style={{width: "45rem"}}>Lista de compra</th>
                                <th style={{width: "4rem"}}>Precio Final</th>
                                {/* <th style={{width: "4rem"}}>Estado del pago</th> */}
                                <th style={{width: "4rem"}}>Estado</th>
                                <th style={{width: "8rem"}}>Fecha</th>
                            </tr>
                        </thead>

                        <tbody>
                            {this.state.requestsList.map(elem => {
                                return(
                                    <tr>
                                        <td>{elem.name} {elem.lastname}</td>

                                        <td>{elem.email}</td>

                                        <td>
                                            {
                                                elem.items.map((item, index) => {
                                                    return(
                                                        <div style={{display: "flex"}}>
                                                            <h5 >[{item.id}]</h5>
                                                            <h5 style={{marginLeft: "0.5rem"}}>{item.name}</h5>
                                                            {/* Faltaria lo del price_size_request.id */}
                                                            <h5 style={{marginLeft: "auto"}}>{item.price_size_request.size}, ${item.price_size_request.price}</h5>
                                                            <h5 style={{marginLeft: "1rem"}} title={item.color.color_id}>({item.color.color_name})</h5>
                                                            <h5 style={{marginLeft: "1rem", marginRight: "0.5rem"}}>(X{item.cant})</h5>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </td>

                                        <td>${elem.final_price}</td>

                                        {/* <td>{elem.payment_info.payment_status}</td> */}

                                        <td>{elem.state}</td>

                                        <td>{elem.date}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                }
            </div>
        )
    }
}

export default RequestTable;