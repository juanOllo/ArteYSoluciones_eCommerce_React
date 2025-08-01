import React from 'react';
import './Catalogo.css'
import {Link} from 'react-router-dom'

class Catalogo extends React.Component{
    constructor(props){
        super(props);
        this.inputSearch = "";

        this.state = {
            displayedList: this.props.originalList,
        }

        this.searchItems = this.searchItems.bind(this);
        this.changeInputSearch = this.changeInputSearch.bind(this);
    }

    searchItems(){

        if (this.inputSearch) {
            const newList = this.props.originalList.filter(x => x.nombre.toLowerCase().replaceAll("á", "a").includes(this.inputSearch))
    
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
                        <img alt="lupa" className="search-img" src="https://media.discordapp.net/attachments/1393296986161152141/1393357055397593209/free-search-icon-2907-thumb.png?ex=688c95a1&is=688b4421&hm=7829fc2628eec35865809ccf19ca9034f78d244e9bc0a2c99f5a0604b57a64a5&=&format=webp&quality=lossless&width=461&height=461"/>
                    </button>
                </div>
                
                <div id="catalogo-lista">
                    {
                        this.state.displayedList.map((elem, index) => {
                            return(
                                // <Link style={{animation: "article-catalog-anim 1s ease 0." + ((index+1)*2) + "s forwards"}} to="/producto" state={{itemId : elem.id, originalList: this.props.originalList}} className="catalogo-article">
                                <Link to="/producto" state={{itemId : elem.id, originalList: this.props.originalList}} className="catalogo-article">
                                    <h2>{elem.nombre}</h2>
                                    <img src={elem.images[0]} alt="imagen del producto" className="catalogo-img"/>
                                </Link>
                            )
                        })
                    }

                </div>
            </div>
        )
    }
}

export default Catalogo;