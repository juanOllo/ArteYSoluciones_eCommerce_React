import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Producto.css';
import ProductoRender from './ProductoRender';
import Article from '../catalogo/Article';
import LoadingScreen from '../../LoadingScreen';

// "useParams" solo funciona en funciones de react.
const Producto = () =>{
    const [itemToRender, setItemToRender] = useState(null);
    const [randomRecomendedItems, setRandomRecomendedItems] = useState([]);
    
    // Uso el _id del params para hacer el fetch.
    const {_id} = useParams();
    
    useEffect(() => {
        const getItemById = async () => {
            try {
                // const response = await fetch(`http://192.168.1.16:2000/items/getItem/${_id}`, {
                const response = await fetch(`https://ays-api.onrender.com/items/getItem/${_id}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                });
                const data = await response.json();
                setItemToRender(data); // Guarda el item en el estado.
                // console.log("item fetched: ", data);
                // console.log("item con fetch");
            } catch (error) {
                console.error("Error fetching item by id:", error);
            }
        };

        getItemById();

        const getRandomRecomendedItems = async () => {
            try {
                const response = await fetch(`http://192.168.1.16:2000/items/getSomeItems`, {
                // const response = await fetch(`https://ays-api.onrender.com/items/getSomeItems`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify([{"_id": _id}])
                });
                const data = await response.json();
                setRandomRecomendedItems(data); 
                // console.log("randomRecomendedItems: ", data);
                // console.log("item con fetch");
            } catch (error) {
                console.error("Error fetching random items:", error);
            }
        };

        getRandomRecomendedItems();

    }, [_id]);

    useEffect(() => {
        document.title = itemToRender ? `${itemToRender.name}` : "AYS - Producto";
    }, [itemToRender]);

    return(
        <div className='producto-page'>
            { 
            itemToRender? 
                <ProductoRender item={itemToRender}/> 
                : 
                <LoadingScreen />
            }

            {
                itemToRender && randomRecomendedItems.length > 0? 
                    <div className='producto-extend-content'>
                        <h3 style={{marginLeft: "23svw"}}>Más productos:</h3>
                        <div className='producto-mostrdor-tile'>
                            {
                                randomRecomendedItems.map((elem, index) => {
                                    return(
                                        <Article item={elem} index={index}/>
                                    )
                                })
                            }
                        </div>
                    </div>
                    :
                    null
            }

        </div>
    )
}

export default Producto;