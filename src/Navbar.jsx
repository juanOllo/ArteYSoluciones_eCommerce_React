import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './Navbar.css'

// Uso el location para pintar el Link del navbar
const Navbar = () => {
  const location = useLocation();
  return <NavbarTile location={location} />;
};

class NavbarTile extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div id="navbar-div">

                {/* <Link className="navbar-link navbar-btn" >CONTACTO</Link> */}
                {/* <Link to="/" className="navbar-link navbar-btn">
                    {this.props.location.pathname === "/" ? <div className="navbar-star navbar-star-focus"></div> : <div className="navbar-star"></div>}
                    <p>INGENIERIA</p>
                </Link> */}
                
                <Link to="/administracion" className="navbar-link navbar-btn">
                    <div className={'navbar-star'} style={this.props.location.pathname === "/administracion"? {backgroundColor: "var(--amarillo)"} : {backgroundColor: "rgba(0, 0, 0, 0.15)"}}></div>
                    <p>ADMIN</p>
                </Link>
                <Link to="/" className="navbar-link navbar-btn">
                    <div className={'navbar-star'} style={this.props.location.pathname === "/"? {backgroundColor: "var(--amarillo)"} : {backgroundColor: "rgba(0, 0, 0, 0.15)"}}></div>
                    <p>INICIO</p>
                </Link>
                <Link to="/catalogo" className="navbar-link navbar-btn">
                    <div className={'navbar-star'} style={this.props.location.pathname === "/catalogo"? {backgroundColor: "var(--amarillo)"} : {backgroundColor: "rgba(0, 0, 0, 0.15)"}}></div>
                    <p>CATÁLOGO</p>
                </Link>

                {
                // CarBtn no aparece en la pagina de administracion.
                this.props.location.pathname !== "/administracion" && this.props.location.pathname !== "/carro" ?
                    <Link to="/carro" onClick={e => {
                        // Evita que el anim se aplique a la imagen q está dentro del botón.
                        const btn = e.target.classList.contains("navbar-btn") ? e.target : e.target.parentElement;
                        btn.style.animation = "shopping-car-btn-click-anim 0.1s forwards";
                        setTimeout(() => { btn.style.animation = "none"; }, 300);

                        // Borra el punto rojo del carBtn.
                        // btn.childNodes[0].style.backgroundColor = "transparent";
                        // btn.childNodes[0].style.animation = "none";
                    }} 
                    className="navbar-car-btn navbar-btn">
                        <div className='navbar-car-point'></div>
                        <img src="https://i.postimg.cc/Jh4cbmt7/basket-cart-icon-27.png" alt="navbar car" className="navbar-car-img"/>
                    </Link>
                    :
                    null
                }

            </div>
        )
    }
}

export default Navbar;