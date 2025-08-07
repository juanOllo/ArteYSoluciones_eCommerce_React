// import ReactDOM from 'react-dom';
import React from 'react';
import './Inicio.css';
import { Link } from 'react-router-dom'


class Inicio extends React.Component{

    render(){
        return(
            <div className='body'>

                <div id="inicio-container">
                    <img id="logo" src="https://i.postimg.cc/4NbvKnwH/logo02.png" alt="ArteYSoluciones Logo"/>
                    <Link to="/catalogo" className="catalogo-completo-btn btn">
                        <h4>CATÁLOGO COMPLETO</h4>
                    </Link>
                    <Mostrador originalList={this.props.originalList}/>
                </div>
            </div>
        )
    }
}

const Mostrador = ({originalList}) => {
    return(
        <div id="mostrador">
            {originalList.slice(0, 3).map(elem => {
                return <Link key={elem.id} to={`/producto/${elem._id}`} className="inicio-article">
                            <img src={elem.images[0]} alt="imagen del producto" />
                            <h3>{elem.name}</h3>
                        </Link>
            })}
        </div>
    )
}

export default Inicio;