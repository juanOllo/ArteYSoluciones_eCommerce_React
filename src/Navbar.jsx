// import ReactDOM from 'react-dom';
import React from 'react';
import './Navbar.css'
import { Link } from 'react-router-dom'

class Navbar extends React.Component{
    constructor(props){
        super(props);

        this.handleClick = this.handleClick.bind(this);

    }

    // maneja el punto rojo del carrito
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
                <Link to="/administracion" className="navbar-btn">
                    {this.props.location.pathname === "/administracion" ? <div className="estrella estrella-focus"></div> : <div className="estrella"></div>}
                    <p>ADMIN</p>
                </Link>
                {/* <Link to="/" className="navbar-btn">
                    {this.props.location.pathname === "/" ? <div className="estrella estrella-focus"></div> : <div className="estrella"></div>}
                    <p>INGENIERIA</p>
                </Link> */}
                <Link to="/" className="navbar-btn">
                    {this.props.location.pathname === "/" ? <div className="estrella estrella-focus"></div> : <div className="estrella"></div>}
                    <p>INICIO</p>
                </Link>
                <Link to="/catalogo" className="navbar-btn">
                    {this.props.location.pathname === "/catalogo" ? <div className="estrella estrella-focus"></div> : <div className="estrella"></div>}
                    <p>CATÁLOGO</p>
                </Link>

                {/* {this.props.location.pathname !== "/carro" ? */}
                    <Link to="/carro" onClick={this.handleClick} className="shopping-car-btn btn">
                        <div className='shopping-car-point'></div>
                        <img src="https://media.discordapp.net/attachments/1393296986161152141/1393297674601496717/basket-cart-icon-27.png?ex=688d0713&is=688bb593&hm=d355350c51b10997096680c1fd28b2997a60a28da4b8e8e97c19506ba971f434&=&format=webp&quality=lossless&width=288&height=288" alt="shopping car" className="shopping-car-img"/>
                    </Link>
                    {/* :
                    null
                } */}

            </div>
        )
    }
}

export default Navbar;
// ReactDOM.render(<Navbar />, document.getElementById("App"));