import React from 'react';
import {Link} from "react-router-dom";

class Mostrador extends React.Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     itemId : 0
        // }
    }

    render(){

        return(
            <div id="mostrador">
                {this.props.originalList.map(elem => {

                    return <Link key={elem.id} to="/producto" state = {{itemId : elem.id, originalList: this.props.originalList}} className="inicio-article">
                                <img src={elem.imagen} alt="imagen del producto" />
                                <h3>{elem.nombre}</h3>
                            </Link>
                })}
            </div>
        )
    }
}

export default Mostrador;