import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './Navbar.css'

const Navbar = () => {
  const location = useLocation();
  return <NavbarTile location={location} />;
};

class NavbarTile extends React.Component{
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

                {
                // this.props.location.pathname !== "/carro" && 
                this.props.location.pathname !== "/administracion" ?
                    <Link to="/carro" onClick={this.handleClick} className="shopping-car-btn btn">
                        <div className='shopping-car-point'></div>
                        <img src="https://i.postimg.cc/Jh4cbmt7/basket-cart-icon-27.png" alt="shopping car" className="shopping-car-img"/>
                    </Link>
                    :
                    null
                }

            </div>
        )
    }
}

export default Navbar;