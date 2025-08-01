// import ReactDOM from 'react-dom';
import React from 'react';
import './Inicio.css';
import Mostrador from './Mostrador';
import { Link } from 'react-router-dom'


class Inicio extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className='body'>

                <div id="inicio-container">
                    {/* <img id="logo" src="https://media.discordapp.net/attachments/1393296986161152141/1393297141987938360/logo02.png?ex=6872a894&is=68715714&hm=3278d166722fd2b044e8ea0c80afac9b4873ed873a2e11b29da98e5a5c12a6de&=&format=webp&quality=lossless&width=800&height=800" alt="ArteYSoluciones Logo"/> */}
                    <img id="logo" src="https://media.discordapp.net/attachments/1393296986161152141/1393297141987938360/logo02.png?ex=688d0694&is=688bb514&hm=a52793225e3f6b526c0ec058c4378fe17b6ac69c8c6541b5d50db7dcdb9bcf1c&=&format=webp&quality=lossless&width=576&height=576" alt="ArteYSoluciones Logo"/>
                    <Link to="/catalogo" className="catalogo-completo-btn btn">
                        <h4>CATÁLOGO COMPLETO</h4>
                    </Link>
                    <Mostrador originalList={this.props.originalList}/>
                </div>

            </div>
        )
    }
}

export default Inicio;