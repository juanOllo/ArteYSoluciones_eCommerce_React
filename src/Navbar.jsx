// import ReactDOM from 'react-dom';
import React from 'react';
import './Navbar.css'
import { Link } from 'react-router-dom'

class Navbar extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div id="navbar-div">

                {/* <Link className="navbar-btn" >CONTACTO</Link> */}
                <Link to="/" className="navbar-btn">
                    <div className="estrella estrella-inicio"></div>
                    <p>INICIO</p>
                </Link>
                <Link to="/catalogo" className="navbar-btn">
                    <div className="estrella"></div>
                    <p>CATALOGO</p>
                </Link>

                <div id="shopping-cart-div">
                    <button className="shopping-car-btn btn">
                        <img src="https://media.discordapp.net/attachments/1393296986161152141/1393297674601496717/basket-cart-icon-27.png?ex=6872a913&is=68715793&hm=b72a7fb1cdea9fe6310abd4b1ce09ee308df2774b66e25447b0c2e538d1d5256&=&format=webp&quality=lossless&width=400&height=400" alt="shopping car" className="shopping-car-img"/>
                    </button>
                </div>

            </div>
        )
    }
}

export default Navbar;
// ReactDOM.render(<Navbar />, document.getElementById("App"));