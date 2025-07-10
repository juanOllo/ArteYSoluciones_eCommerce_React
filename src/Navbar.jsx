// import ReactDOM from 'react-dom';
import React from 'react';
import './Navbar.css'

class Navbar extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            indexVisivility: 1
        }

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(i){
        console.log("hola");
        this.setState( {
            indexVisivility : i
        })
    }

    render(){
        console.log("el index es: ", this.state.indexVisivility);
        return(
            <div id="navbar-div" value={this.state.indexVisivility}>
                {/* <h1>NAVBAR</h1> */}
                <a className="navbar-btn" onClick={() => this.handleClick(0)}>CONTACTO</a>
                <a className="navbar-btn" onClick={() => this.handleClick(1)}>INICIO</a>
                <a className="navbar-btn" onClick={() => this.handleClick(2)}>CATALOGO</a>
                {/* <h1>{this.state.indexVisivility}</h1> */}
            </div>
        )
    }
}

export default Navbar;
// ReactDOM.render(<Navbar />, document.getElementById("App"));