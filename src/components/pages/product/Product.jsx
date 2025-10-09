import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ProductRender from './ProductRender';
import ArticleCard from '../../ArticleCard';
import LoadingScreen from '../../LoadingScreen';

// "useParams" solo funciona en funciones de react.
const Producto = () =>{
    const [itemToRender, setItemToRender] = useState(null);
    const [errorItemToRenderNotFounded, setErrorItemToRenderNotFounded] = useState(false);
    
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
                setErrorItemToRenderNotFounded(true);
            }
        };

        getItemById();

    }, [_id]);

    useEffect(() => {
        document.title = itemToRender ? `${itemToRender.name}` : "AYS - Producto";
    }, [itemToRender]);



    const ref = useRef();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
        // ([entry]) => {
        //     setVisible(entry.isIntersecting);
        // },
        ([entry]) => {
            if (entry.isIntersecting) {
                setVisible(true); // Solo lo activa, no lo desactiva
                observer.disconnect(); // Detiene la observación
            }
        },
        { threshold: 0.5 } // 50% del componente debe estar visible
        );

        if (ref.current) {
        observer.observe(ref.current);
        }

        return () => {
        if (ref.current) observer.unobserve(ref.current);
        };
    }, [itemToRender]);



    return(
        <div className='producto-page'>
            {
                itemToRender ?
                    <span>
                        <ProductRender item={itemToRender}/> 
                        <div ref={ref} style={{height: '13rem', 
                            // backgroundColor: "rgba(0,0,0,0.5)", 
                            marginBottom: "-14rem", marginTop: "4rem"}}>
                        </div>
                        <RecomendedItems _id={_id} setItemToRender={setItemToRender} visible={visible} visibleRef={ref}/>
                    </span>
                    :
                    !errorItemToRenderNotFounded ?
                        <LoadingScreen />
                        :
                        <div style={{textAlign: "center", marginTop: "10rem"}}>
                            <h2>El producto que buscas no existe o no se encuentra disponible.</h2>
                            <h3>Por favor, verifica la URL o regresa al catálogo.</h3>
                        </div>
            }
        </div>
    )
}



// Componente para mostrar los productos recomendados.
function RecomendedItems({_id, setItemToRender, visible, visibleRef}){
    const [recomendedItems, setRecomendedItems] = useState([]);

    useEffect(() => {
        const getRecomendedItems = async () => {
            try {
                // const response = await fetch(`http://192.168.1.16:2000/items/getRecomendedItems`, {
                const response = await fetch(`https://ays-api.onrender.com/items/getRecomendedItems`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({"_id": _id, "cant": 3})
                });
                const data = await response.json();
                setRecomendedItems(data); 
                // console.log("randomRecomendedItems: ", data);
                // console.log("item con fetch");
            } catch (error) {
                console.error("Error fetching recomended items:", error);
            }
        };

        getRecomendedItems();
    }, [_id]);

    return(
        <div className='product-recomended-items'
        style={{opacity: visible ? 1 : 0, transition: 'opacity 0.7s ease-in-out'}}
        ref={visibleRef}
        >
            <h3 style={{marginLeft: "23svw"}}>Productos relacionados:</h3>
            <div className='product-recomended-items-tile'>
                {
                    visible?
                        recomendedItems.map((elem, index) => {
                            return(                                     //No me acuerdo para q uso este onclick, deberia borrarlo
                                <ArticleCard item={elem} index={index} onClick={() => setItemToRender(null)}/>
                            )
                        })
                        :
                        <div style={{height: "10rem"}}></div>
                }
            </div>
        </div>
    )
}

export default Producto;