// import ReactDOM from 'react-dom';
import React, { useEffect } from 'react';
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
    const [menuItemsList, setMenuItemsList] = React.useState([]);
    
      useEffect(() => {
        const fetchItems = async () => {
            if (Array.isArray(originalList) && originalList.length > 0) {
                setMenuItemsList(originalList);
                console.log("setMenuItemsList originalList");
            } else {
                try {
                    const response = await fetch(`http://localhost:2000/items/getSomeItems`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify([ {"_id": "68941664903bfa05a0b8a922"}, {"_id": "68942b1146529ae49d07ab83"}, {"_id": "68953464a268f6d35c975b08"}])
                    });
                    const data = await response.json();
                    setMenuItemsList(data);
                    console.log("setMenuItemsList fetch");
                } catch (error) {
                    console.error("Error fetching items:", error);
                }
            }
        };
        fetchItems();
      }, []);

    return(
        <div id="mostrador">
            {menuItemsList.slice(0, 3).map(elem => {
                return ( elem.stock ?
                            <Link key={elem.id} to={`/producto/${elem._id}`} className="inicio-article">
                                <img src={elem.images[0]} alt="imagen del producto" />
                                <h3>{elem.name}</h3>
                            </Link>
                            :
                            null
                        )
            })}
        </div>
    )
}

export default Inicio;