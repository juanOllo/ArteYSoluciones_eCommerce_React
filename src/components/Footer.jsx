import React from 'react';

class Footer extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div id="footer">
                <div id="footer-tile">
                    <p>© 2024 ArteYSoluciones. Todos los derechos reservados.</p>
                    {/* <p>Desarrollado por <a href="https://www.linkedin.com/in/alejandro-yepes-sierra/" target="_blank" rel="noreferrer">Alejandro Yepes Sierra</a></p> */}
                </div>
            </div>
        );
    }
}
export default Footer;