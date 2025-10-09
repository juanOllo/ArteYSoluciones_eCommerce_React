// import ReactDOM from 'react-dom';
import React from 'react';
import { Link } from 'react-router-dom';

class NotFoundPage extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div style={{textAlign: "center"}}>
                {/* <h1 style={{marginTop: "5rem"}}>404 Not Found...</h1> */}
                <h2 style={{marginTop: "10rem"}}>Error. Pagina no encontrada.</h2>

                <Link to="/"
                 style={{textDecoration: "none", color: "black", backgroundColor: "var(--amarillo)", padding: "1rem", borderRadius: "2rem", marginTop: "1rem", display: "inline-block",
                    fontWeight: "bold", border: "0.15rem solid black", 
                 }}
                >
                    VOLVER AL INICIO
                </Link>
            </div>
        )
    }
}

export default NotFoundPage;