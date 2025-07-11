// import ReactDOM from 'react-dom';
import React from 'react';
import { Link } from 'react-router-dom';

class NotFoundPage extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div>
                <h1 style={{marginTop: "5rem"}}>404 Not Found</h1>

                <Link to="/">VOLVER</Link>

            </div>
        )
    }
}

export default NotFoundPage;