import React from 'react';

class Header extends React.Component {
    constructor(props) {
        super(props);

        // this.inputSearch = "";

        this.state = {
            listKeys: this.props.listKeys || {
                'sort': '',
                'search': ''
            },
            inputSearch: "",
            sortValue: "default",
        }

        this.changeInputSearch = this.changeInputSearch.bind(this);
        this.setKeys = this.setKeys.bind(this);
    }

    changeInputSearch(e){

        if (e.target.value) {
            this.setState({
                inputSearch: e.target.value
            });
            // this.setKeys('search', this.state.inputSearch);
        } else {
            this.setState({
                inputSearch: e.target.value
            });
            this.setKeys('search', '');
        }
    }

    setKeys(keyName, newKeyValue) {
        
        switch (keyName) {
            case 'search':
                        // tengo que hacer esto porq no se si el usuario va a usar mayusculas y/o tildes
                // const cleanInputSearch = this.inputSearch.toLowerCase().replaceAll("á", "a").replaceAll("é", "e").replaceAll("í", "i").replaceAll("ó", "o").replaceAll("ú", "u");
                const cleanInputSearch = newKeyValue.toLowerCase().replaceAll("á", "a").replaceAll("é", "e").replaceAll("í", "i").replaceAll("ó", "o").replaceAll("ú", "u");
                
                const updatedListKeys = {
                    ...this.state.listKeys,
                    'search': cleanInputSearch
                };

                this.props.setUpdatedKeys(updatedListKeys);

                this.setState({
                    listKeys: updatedListKeys
                });
                break;

            case 'sort':
                const updatedListKeys2 = {
                    ...this.state.listKeys,
                    'sort': newKeyValue
                };

                this.props.setUpdatedKeys(updatedListKeys2);

                this.setState({
                    listKeys: updatedListKeys2
                });
                break;
        
            default:
                break;
        }
    }

    getSortLabel(sortKey) {
        switch(sortKey) {
            case "name-asc":
                return "Nombre A-Z";
            case "name-desc":
                return "Nombre Z-A";
            case "price-asc":
                return "Mas Barato Primero";
            case "price-desc":
                return "Mas Caro Primero";
            default:
                return "";
        }
    }
    
    render() {
        return (
            <div className="catalogo-header">
                <h1>Catálogo.</h1>

                <div id="catalogo-buscador">
                    <input onChange={this.changeInputSearch} type="text" placeholder="Buscar" value={this.state.inputSearch}/>
                    <button onClick={() => this.setKeys('search', this.state.inputSearch)}>
                        <img alt="lupa" className="search-img" src="https://i.postimg.cc/4dcKcFvN/free-search-icon-2907-thumb.png"/>
                    </button>
                </div>

                <select value={this.state.sortValue} name="ordenar" className='select-ordenar' onChange={(e) => {this.setState({ sortValue: e.target.value }); this.setKeys('sort', e.target.value)}}>
                    <option value="default">Ordenar por</option>
                    <option value="name-asc">Nombre A-Z</option>
                    <option value="name-desc">Nombre Z-A</option>
                    <option value="price-asc">Mas Barato Primero</option>
                    <option value="price-desc">Mas Caro Primero</option>
                </select>

                <p style={{marginLeft: "auto", fontFamily: "var(--ffamily01)", fontWeight: "600", color: "rgba(0, 0, 0, 0.7)"}}>{this.props.cantItems} {this.props.cantItems>1 ? "artículos.":"artículo."}</p>

                <div className='aplicated-filters-div'>
                    {
                        this.state.listKeys.search?
                            <div className='aplicated-filter'>
                                <p>
                                    Buscando: "{this.state.listKeys.search}"
                                </p>
                                <button onClick={() => {this.setState({inputSearch: ""}); this.setKeys('search', '')}}>X</button>
                            </div>
                            :
                            null
                    }
                    {
                        this.state.listKeys.sort && this.state.listKeys.sort !== "default"?
                            <div className='aplicated-filter'>
                                <p>
                                    Ordenando por: "{this.getSortLabel(this.state.listKeys.sort)}"
                                </p>
                                <button onClick={() => {this.setState({ sortValue: "default" }); this.setKeys('sort', 'default')}}>X</button>
                            </div>
                            :
                            null
                    }
                </div>

            </div>
        );
    }
}

export default Header;