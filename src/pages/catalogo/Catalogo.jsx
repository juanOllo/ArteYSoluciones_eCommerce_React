import React, { useEffect, useState } from 'react';
import './Catalogo.css';
import {Link} from 'react-router-dom';
// import { render } from '@testing-library/react';
import Header from './Header.jsx';

class Catalogo extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            // displayedList: localStorage.getItem("demoList") ? JSON.parse(localStorage.getItem("demoList")) : this.props.originalList,
            displayedList: [],
            originalList: [],
            isLoading: true,
            isFetchError: false,
            listKeys: {
                'sort': '',
                'search': ''
            },
        }

        // this.searchItems = this.searchItems.bind(this);
        // this.changeInputSearch = this.changeInputSearch.bind(this);
        // this.handleHeaderAction = this.handleHeaderAction.bind(this);

        this.setUpdatedKeys = this.setUpdatedKeys.bind(this);

        this.searchItems = this.searchItems.bind(this);
        this.cleanName = this.cleanName.bind(this);

        // document.title = "Arte Y Soluciones / Catálogo";
    }

    // componentDidUpdate(prevProps, prevState) {
    //     if (prevState.displayedList == [] || this.state.displayedList == []) {
    //         console.log("no entro")
    //         return;
    //     } else if (prevState.displayedList !== this.state.displayedList) {
    //         // this.setState({allowItemDisplayAnim: false});
    //     }
    // }

    // Pasarle originalList como props hace que se cargue mas rapido siempre,
    //  pero si refrecas la pagina o entras a la pagina /catalogo directamente
    //  por la url los props no llegan de ningun lado, entonces hago el fetch.
    async componentDidMount(){
        // if (Array.isArray(this.props.originalList) && this.props.originalList.length > 0) {
        //     this.setState({
        //         displayedList: this.props.originalList,
        //         originalList: this.props.originalList,
        //         isLoading: false
        //     })
        //     console.log("setState originalList");
        // } else{
            try {
                // const response = await fetch("http://localhost:2000/items/allItemsList", {
                const response = await fetch("https://ays-api.onrender.com/items/allItemsList", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                });
                const data = await response.json();
                this.setState({
                    displayedList: data,
                    originalList: data,
                    isLoading: false
                })
            } catch (error) {
                console.error("Error fetching items:", error);
                this.setState({
                    isLoading: false,
                    isFetchError: true
                })
            }
            console.log("setState fetch");
        // }


    }

    // handleHeaderAction(newDisplayedList){
    //     if (newDisplayedList && Array.isArray(newDisplayedList) && newDisplayedList.length > 0) {
    //         this.setState({
    //             displayedList: newDisplayedList
    //         })
    //     } else {
    //         this.setState({
    //             displayedList: this.props.originalList
    //         })
    //     }
    // }

    setUpdatedKeys(updatedListKeys){
        console.log("Updated list keys: ", updatedListKeys);
        this.setState({
            listKeys: updatedListKeys,
            // displayedList: this.state.originalList
        }, this.searchItems)

    }

    searchItems(){

        let newDisplayedList = [...this.state.originalList];

        if (this.state.listKeys.search) {
            const inputSearch = this.state.listKeys.search;
            console.log("Input search: ", inputSearch);
    
            if (inputSearch) {
                const newList = this.state.originalList.filter(x => x.name.toLowerCase().replaceAll("á", "a").replaceAll("é", "e").replaceAll("í", "i").replaceAll("ó", "o").replaceAll("ú", "u").includes(inputSearch))
        
                // this.setState({
                //     displayedList: newList
                // });
                newDisplayedList = newList;
            } 
        }

        if (this.state.listKeys.sort) {
            const sortKey = this.state.listKeys.sort;
            // console.log("Sort key: ", sortKey);
    
            newDisplayedList.sort((a, b) => {
                switch (sortKey) {
                    case "name-asc":
                        return this.cleanName(a.name).localeCompare(this.cleanName(b.name));
                    
                    case "name-desc":
                        return this.cleanName(b.name).localeCompare(this.cleanName(a.name));

                    case "price-asc":
                        // return a.priceXSize.length - b.priceXSize.length;
                        return (a.priceXSize.reduce((acc, cur) => acc + parseInt(cur.price), 0) / a.priceXSize.length) - (b.priceXSize.reduce((acc, cur) => acc + parseInt(cur.price), 0) / b.priceXSize.length);

                    case "price-desc":
                        // return b.priceXSize.length - a.priceXSize.length;
                        return (b.priceXSize.reduce((acc, cur) => acc + parseInt(cur.price), 0) / b.priceXSize.length) - (a.priceXSize.reduce((acc, cur) => acc + parseInt(cur.price), 0) / a.priceXSize.length);
                
                    default:
                        return 0; // Default case
                }
            })
            
        }

        this.setState({
            displayedList: newDisplayedList
        });
    }

    cleanName(str) {
        // Elimina todos los caracteres que no sean letras o números al principio
        return str.replace(/^[^\p{L}\p{N}]+/u, '').toLowerCase();
    }

    render(){
        return(
            <div className='catalogo-body'>
                
                {/* <button className='filter-btn'>
                    <img src="https://imgs.search.brave.com/rwtpttxP_Wxz2KDBuiQvkfWObbuoHIC5YKFU_8JhGIk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/aWNvbnNjb3V0LmNv/bS9pY29uL3ByZW1p/dW0vcG5nLTI1Ni10/aHVtYi9maWx0ZXIt/aWNvbi1kb3dubG9h/ZC1pbi1zdmctcG5n/LWdpZi1maWxlLWZv/cm1hdHMtLWZpbHRl/cmluZy1zZXR0aW5n/LXNlYXJjaC1vcHRp/b25zLWVzc2VudGlh/bHMtcGFjay11c2Vy/LWludGVyZmFjZS1p/Y29ucy0xMDMxMjI4/MC5wbmc_Zj13ZWJw/Jnc9MTI4" alt="filters" />
                </button>
                <div className='filters-div'></div> */}

                {
                    !this.state.isLoading?
                    <Header listKeys={this.state.listKeys} setUpdatedKeys={this.setUpdatedKeys} cantItems={this.state.displayedList.length}/>
                    :
                    null
                }
                
                <div id="catalogo-lista">
                    {
                        this.state.isLoading ? 
                        <div style={{margin: "30svh auto 0", fontFamily: "var(--ffamily01)", fontSize: "1.5rem"}}>CARGANDO ITEMS!!!</div>
                        :
                        this.state.displayedList.map((elem, index) => {
                            return( elem.stock ?
                                        <Article key={elem._id} item={elem} index={index}/>
                                        :
                                        null
                            )
                        })
                    }

                </div>
            </div>
        )
    }
}

const Article = ({item, index}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [indexImageHovered, setIndexImageHovered] = useState(0);
    const [animationEnded,setAnimationEnded] = useState(false);

    return (
            // <Link to={`/producto/${item._id}`} className={"catalogo-article" + (isHovered ? " catalogo-article-hover" : "")}
            // <Link style={{animation: `catalogo-article-show 0.3s ease ${0.1 * (index + 1)}s forwards`}} to={`/producto/${item._id}`} state={item} className={"catalogo-article" + (isHovered ? " catalogo-article-hover" : "")}
            // <Link to={`/producto/${item._id}`} state={item} className={"catalogo-article" + (isHovered ? " catalogo-article-hover" : "")}

            <Link
                to={`/producto/${item._id}`} 
                onAnimationEnd={() => setAnimationEnded(true)}
                style={
                    animationEnded?
                        {opacity: "100%"}
                        :
                        {animation: `catalogo-article-show 0.3s ease ${0.1 * (index + 1)}s forwards`}
                }
                // state={item} 

                // className={"catalogo-article" + (isHovered && animationEnded ? " catalogo-article-hover" : "")}
                className={"catalogo-article"}
            
                // onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {setIsHovered(false); setIndexImageHovered(0)}}
                onMouseOver={() => setIsHovered(true)}
                onMouseOut={() => setIsHovered(false)}
            >

                {
                    item.off && item.off > 0 ?
                        <div className='article-off-star'>
                            <h4 style={{margin: "-0.6rem 0 0 0.55rem"}}>
                                -{item.off}%
                            </h4>
                        </div>
                        :
                        null
                }
                <h2>{item.name}</h2>
                <span style={{display: isHovered && item.images.length > 1 ? "flex" : "none"}} className='catalog-img-span'>
                {/* <span style={{animation: "catalog-img-span-spawn-delay 0.1s forwards"}} className='catalog-img-span'> */}
                    {
                        item.images.map((src, imageIndex) => {
                            // la primera imagen no aparece en el span y no debe reservarse el espacio, solo muestra 4 imagenes
                            if (imageIndex === 0 || imageIndex >= 5) return null

                            return indexImageHovered !== imageIndex ? 
                                <img key={imageIndex} src={src} alt="" className='catalogo-img' onMouseEnter={() => setIndexImageHovered(imageIndex)}/>
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