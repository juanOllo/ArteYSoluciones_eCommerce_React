// import ReactDOM from 'react-dom';
import React from 'react';
import './Navbar.css'
import { Link, useLocation } from 'react-router-dom'

class Navbar extends React.Component{
    constructor(props){
        super(props);

        this.handleClick = this.handleClick.bind(this);

    }

    handleClick(e){
        const btn = e.target.classList.contains("btn") ? e.target : e.target.parentElement;

        btn.childNodes[0].style.backgroundColor = "transparent";
        btn.childNodes[0].style.animation = "none";

        btn.style.animation = "shopping-car-btn-click-anim 0.1s forwards";
        setTimeout(() => {
            btn.style.animation = "none";
        }, 300);
    }

    render(){
        return(
            <div id="navbar-div">

                {/* <Link className="navbar-btn" >CONTACTO</Link> */}
                <Link to="/" className="navbar-btn">
                    {/* <div className="estrella estrella-focus"></div> */}
                    {this.props.location.pathname === "/" ? <div className="estrella estrella-focus"></div> : <div className="estrella"></div>}
                    <p>INICIO</p>
                </Link>
                <Link to="/catalogo" className="navbar-btn">
                    {/* <div className="estrella"></div> */}
                    {this.props.location.pathname === "/catalogo" ? <div className="estrella estrella-focus"></div> : <div className="estrella"></div>}
                    <p>CATALOGO</p>
                </Link>

                <Link to="/carro" onClick={this.handleClick} className="shopping-car-btn btn">
                    <div className='shopping-car-point'></div>
                    <img src="https://media.discordapp.net/attachments/1393296986161152141/1393297674601496717/basket-cart-icon-27.png?ex=6872a913&is=68715793&hm=b72a7fb1cdea9fe6310abd4b1ce09ee308df2774b66e25447b0c2e538d1d5256&=&format=webp&quality=lossless&width=400&height=400" alt="shopping car" className="shopping-car-img"/>
                </Link>

            </div>
        )
    }
}

export default Navbar;
// ReactDOM.render(<Navbar />, document.getElementById("App"));