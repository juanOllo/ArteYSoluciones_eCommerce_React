import React from 'react';

class Header extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            listKeys: this.props.listKeys || {
                'sort': '',
                'search': ''
            },
            inputSearch: "",
            sortValue: "",
        }

        this.setNewKey = this.setNewKey.bind(this);
    }

    setNewKey(keyName, newKeyValue) {
        const updatedListKeys = {
            ...this.state.listKeys,
            [keyName]: newKeyValue
        }

        this.props.setNewKeys(updatedListKeys);

        this.setState({ listKeys: updatedListKeys })
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
                    <input value={this.state.inputSearch} onKeyDown={e => e.key === 'Enter' ? this.setNewKey('search', this.state.inputSearch) : null} type="text" placeholder="Buscar" 
                    onChange={e => this.setState({ inputSearch: e.target.value })} 
                    />
                    <button onClick={() => this.setNewKey('search', this.state.inputSearch)}>
                        <img alt="lupa" className="search-img" src="https://i.postimg.cc/4dcKcFvN/free-search-icon-2907-thumb.png"/>
                    </button>
                </div>

                <select value={this.state.sortValue} name="ordenar" className='select-ordenar' onChange={(e) => {this.setState({ sortValue: e.target.value }); this.setNewKey('sort', e.target.value)}}>
                    <option value="">Ordenar por</option>
                    <option value="name-asc">Nombre A-Z</option>
                    <option value="name-desc">Nombre Z-A</option>
                    <option value="price-asc">Mas Barato Primero</option>
                    <option value="price-desc">Mas Caro Primero</option>
                </select>

                <p style={{marginLeft: "auto", fontFamily: "var(--ffamily01)", fontWeight: "600", color: "rgba(0, 0, 0, 0.7)"}}>{this.props.cantItems} {this.props.cantItems>1 ? "artículos.":"artículo."}</p>

                <div className='aplicated-filters-div'
                style={(this.state.listKeys.search || this.state.listKeys.sort)? {} : {display: "none"}}
                >
                    {
                    this.state.listKeys.search?
                        <div className='aplicated-filter'>
                            <p>
                                Buscando: "{this.state.listKeys.search}"
                            </p>
                            <button onClick={() => {this.setState({inputSearch: ""}); this.setNewKey('search', '')}}>X</button>
                        </div>
                        :
                        null
                    }

                    {
                    this.state.listKeys.sort?
                        <div className='aplicated-filter'>
                            <p>
                                Ordenando por: "{this.getSortLabel(this.state.listKeys.sort)}"
                            </p>
                            <button onClick={() => {this.setState({ sortValue: "" }); this.setNewKey('sort', '')}}>X</button>
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