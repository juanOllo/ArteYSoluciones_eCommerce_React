import React, { useEffect, useState } from 'react';
import './Catalog.css';
// import { render } from '@testing-library/react';
import Header from './Header.jsx';
import ArticleCard from '../../ArticleCard.jsx';
import LoadingScreen from '../../LoadingScreen.jsx';

class Catalogo extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            displayedList: [],
            originalList: [],
            isLoading: true,
            isFetchError: false,
            listKeys: {
                'sort': '',
                'search': ''
            },
        }

        this.setNewKeys = this.setNewKeys.bind(this);
        this.updateDisplayedList = this.updateDisplayedList.bind(this);
        this.cleanName = this.cleanName.bind(this);
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
        if (Array.isArray(this.props.originalList) && this.props.originalList.length > 0) {
            this.setState({
                displayedList: this.props.originalList,
                originalList: this.props.originalList,
                isLoading: false
            })
            console.log("setState originalList");
        } else{
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
        }
        document.title = "Arte Y Soluciones/ Catálogo";
    }

    setNewKeys(updatedListKeys){
        this.setState({
            listKeys: updatedListKeys
        }, this.updateDisplayedList)
    }

    updateDisplayedList(){

        let newDisplayedList = [...this.state.originalList];

        if (this.state.listKeys.search) {
            const inputSearch = this.cleanName(this.state.listKeys.search);
    
            if (inputSearch) {
                newDisplayedList = this.state.originalList.filter(x => this.cleanName(x.name).includes(inputSearch));
            }
        }

        if (this.state.listKeys.sort) {
            newDisplayedList.sort((a, b) => {
                switch (this.state.listKeys.sort) {
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
                        return 0;
                }
            })
        }

        this.setState({ displayedList: newDisplayedList });
    }

    // Elimina todos los caracteres que no sean letras, números o espacios 
    //  y remplaza las letras que llevan tilde.
    cleanName(str) {
        return str.replace(/[^\p{L}\p{N}\p{Zs}]+/ug, '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    render(){
        return(
            <div className='catalogo-body'>
                {!this.state.isLoading?
                    <Header listKeys={this.state.listKeys} setNewKeys={this.setNewKeys} cantItems={this.state.displayedList.length}/>
                    :
                    <LoadingScreen />
                    // null
                }
                
                <div id="catalogo-lista">
                    {!this.state.isLoading ?                         
                        this.state.displayedList.map((elem, index) => {
                            return( elem.stock ?
                                        <ArticleCard key={elem._id} item={elem} index={index}/>
                                        :
                                        null
                            )
                        })
                        :
                        null
                    }
                </div>
            </div>
        )
    }
}

export default Catalogo;