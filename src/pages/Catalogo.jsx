import React, { useState, useEffect } from 'react';
import './Catalogo.css';
import {Link} from 'react-router-dom';
import { render } from '@testing-library/react';

class Catalogo extends React.Component{
    constructor(props){
        super(props);
        this.inputSearch = "";

        this.state = {
            // displayedList: this.props.originalList,
            displayedList: localStorage.getItem("demoList") ? JSON.parse(localStorage.getItem("demoList")) : this.props.originalList,
        }

        this.searchItems = this.searchItems.bind(this);
        this.changeInputSearch = this.changeInputSearch.bind(this);
    }

    searchItems(){

        // tengo que hacer esto porq no se si el usuario va a usar mayusculas y/o tildes
        const cleanInputSearch = this.inputSearch.toLowerCase().replaceAll("á", "a").replaceAll("é", "e").replaceAll("í", "i").replaceAll("ó", "o").replaceAll("ú", "u");

        if (cleanInputSearch) {
            const newList = this.props.originalList.filter(x => x.name.toLowerCase().replaceAll("á", "a").replaceAll("é", "e").replaceAll("í", "i").replaceAll("ó", "o").replaceAll("ú", "u").includes(cleanInputSearch))
    
            this.setState({
                displayedList: newList
            })
        }
    }

    changeInputSearch(e){

        if (e.target.value) {
            this.inputSearch = e.target.value;
            // this.searchItems();
        } else {
            this.inputSearch = "";
            this.setState({
                displayedList: this.props.originalList
            })
        }
    }

    render(){
        return(
            <div className='catalogo-body'>
                
                {/* <button className='filter-btn'>
                    <img src="https://imgs.search.brave.com/rwtpttxP_Wxz2KDBuiQvkfWObbuoHIC5YKFU_8JhGIk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/aWNvbnNjb3V0LmNv/bS9pY29uL3ByZW1p/dW0vcG5nLTI1Ni10/aHVtYi9maWx0ZXIt/aWNvbi1kb3dubG9h/ZC1pbi1zdmctcG5n/LWdpZi1maWxlLWZv/cm1hdHMtLWZpbHRl/cmluZy1zZXR0aW5n/LXNlYXJjaC1vcHRp/b25zLWVzc2VudGlh/bHMtcGFjay11c2Vy/LWludGVyZmFjZS1p/Y29ucy0xMDMxMjI4/MC5wbmc_Zj13ZWJw/Jnc9MTI4" alt="filters" />
                </button>
                <div className='filters-div'></div> */}

                <div id="catalogo-buscador">
                    <input onChange={this.changeInputSearch} type="text" placeholder="Buscar"/>
                    <button onClick={this.searchItems}>
                        <img alt="lupa" className="search-img" src="https://i.postimg.cc/4dcKcFvN/free-search-icon-2907-thumb.png"/>
                    </button>
                </div>
                
                <div id="catalogo-lista">
                    {
                        this.state.displayedList.map((elem, index) => {
                            return(
                                // <Link to={`/producto/${elem.id}`} className="catalogo-article">
                                //     <h2>{elem.name}</h2>
                                //     <img src={elem.images[0]} alt="imagen del producto" className="catalogo-img"/>
                                // </Link>
                                <Article item={elem}/>
                            )
                        })
                    }

                </div>
            </div>
        )
    }
}

const Article = ({item}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [indexImageHovered, setIndexImageHovered] = useState(0);
    
    // const [showAltImage, setShowAltImage] = useState(false);
    // useEffect(() => {
    //     let timer;
    //     if (isHovered) {
    //         timer = setTimeout(() => {
    //         setShowAltImage(true);
    //     }, 500); // Delay de 100ms
    //     } else {
    //         setShowAltImage(false);
    //         clearTimeout(timer);
    //     }

    //     return () => clearTimeout(timer); // Limpieza
    // }, [isHovered]);



    return (
            <Link to={`/producto/${item._id}`} className={"catalogo-article" + (isHovered ? " catalogo-article-hover" : "")}
                // onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {setIsHovered(false); setIndexImageHovered(0)}}
                onMouseOver={() => setIsHovered(true)}
                onMouseOut={() => setIsHovered(false)}
            >
                <h2>{item.name}</h2>
                <span style={{animation: "catalog-img-span-spawn-delay 0.15s ease-in-out 0.5s forwards", display: isHovered && item.images.length > 1 ? "flex" : "none"}} className='catalog-img-span'>
                {/* <span style={{animation: "catalog-img-span-spawn-delay 0.1s forwards"}} className='catalog-img-span'> */}
                    {
                        item.images.map((src, index) => {
                            // la primera imagen no aparece en el span y no deve reservarse el espacio
                            if (index === 0) return null

                            return indexImageHovered !== index ? 
                                <img src={src} alt="" className='catalogo-img' onMouseEnter={() => setIndexImageHovered(index)}/>
                                :
                                <div style={{width: "3rem"}} className='catalogo-img'/>
                        })
                    }
                </span>
                <img src={item.images[indexImageHovered]} alt="imagen del producto" className="catalogo-img-focus"/>
            </Link>
        )
}

export default Catalogo;