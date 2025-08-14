// import ReactDOM from 'react-dom';
import React, { useEffect, useState } from 'react';
import './Inicio.css';
import { Link } from 'react-router-dom'


class Inicio extends React.Component{

    render(){
        return(
            <div className='home-body'>


                <div style={{overflow: "hidden", zIndex: "1", left: "0", top: "0", position: "absolute", height: "100svh", width: "100svw", backgroundColor: ""}}>
                    <div class="blur"></div>
                    <div className="star"></div>
                </div>

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
    const [menuItemsList, setMenuItemsList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
      useEffect(() => {
        const fetchItems = async () => {
            if (Array.isArray(originalList) && originalList.length > 0) {
                setMenuItemsList(originalList);
                setIsLoading(false);
                console.log("setMenuItemsList originalList");
            } else {
                try {
                    // const response = await fetch(`http://192.168.1.16:2000/items/getSomeItems`, {
                    const response = await fetch(`https://ays-api.onrender.com/items/getSomeItems`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify([ {"_id": "68941664903bfa05a0b8a922"}, {"_id": "68942b1146529ae49d07ab83"}, {"_id": "68953464a268f6d35c975b08"}])
                    });
                    const data = await response.json();
                    setMenuItemsList(data);
                    setIsLoading(false);
                    console.log("setMenuItemsList fetch");
                } catch (error) {
                    console.error("Error fetching items:", error);
                }
            }
        };
        fetchItems();
      }, []);

    return(
        isLoading?
        <div className="mostrador">
            <div className="inicio-article-loading-skeleton" style={{fontFamily: "var(--ffamily01)"}}></div>
            <div className="inicio-article-loading-skeleton" style={{fontFamily: "var(--ffamily01)"}}></div>
            <div className="inicio-article-loading-skeleton" style={{fontFamily: "var(--ffamily01)"}}></div>
        </div>
        :
        <div className="mostrador">
            {menuItemsList.slice(0, 3).map(elem => {
                return ( elem.stock ?
                            <Link key={elem.id} state={elem} to={`/producto/${elem._id}`} className="inicio-article">
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