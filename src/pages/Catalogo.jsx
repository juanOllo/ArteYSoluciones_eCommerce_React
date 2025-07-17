// import ReactDOM from 'react-dom';
import React from 'react';
import './Catalogo.css'
import {Link} from 'react-router-dom'

class Catalogo extends React.Component{
    constructor(props){
        super(props);
        this.userInput = "";

        // this.state = {
        //     userInput: ''
        // }

        this.listItems = this.listItems.bind(this);
        this.searchItems = this.searchItems.bind(this);
        this.changeUserInput = this.changeUserInput.bind(this);

        this.listItems();
    }

    listItems(){
        const listaCompleta = this.props.originalList.map(elem => {
            return(
                <Link to="/producto" state={{itemId : elem.id, originalList: this.props.originalList}} className="catalogo-article">
                    <h2>{elem.nombre}</h2>
                    <img src={elem.images[0]} alt="imagen del producto" className="catalogo-img"/>
                </Link>
            )
        })

        this.state={
            listaCompleta: listaCompleta,
            listaEnPantalla: listaCompleta
        }
    }

    searchItems(){

        if (this.userInput) {
            const newList = this.props.originalList.filter(x => x.nombre.toLowerCase().replaceAll("á", "a").includes(this.userInput)).map(elem => {
                return(
                    <Link to="/producto" state={{itemId : elem.id}} className="catalogo-article">
                        <h2>{elem.nombre}</h2>
                        <img src={elem.images[0]} alt="imagen del producto" className="catalogo-img"/>
                    </Link>
                )
            })
    
            this.setState({
                listaEnPantalla: newList
            })
        }
    }

    changeUserInput(e){

        if (e.target.value) {
            this.userInput = e.target.value;
            // this.setState({
            //     userInput: e.target.value
            // });
        } else {
            this.userInput = "";
            this.setState({
                // userInput: e.target.value,
                listaEnPantalla: this.state.listaCompleta
            })
        }


    }

    render(){
        return(
            <div className='catalogo-body'>
                <div id="catalogo-buscador">
                    <input onChange={this.changeUserInput} type="text" placeholder="Buscar"/>
                    <button onClick={this.searchItems}>
                        <img alt="lupa" className="search-img" src="https://media.discordapp.net/attachments/1393296986161152141/1393357055397593209/free-search-icon-2907-thumb.png?ex=6872e061&is=68718ee1&hm=2b6d0585cff0fe2861e3117aa14d052319329cc15ca854265e1788e4cd3321fe&=&format=webp&quality=lossless&width=640&height=640"/>
                    </button>
                </div>
                <div id="catalogo-lista">
                    {this.state.listaEnPantalla}
                    {/* {this.state.listaEnPantalla.length != 0 ? this.state.listaEnPantalla : this.state.listaCompleta} */}
                </div>
            </div>
        )
    }
}

export default Catalogo;