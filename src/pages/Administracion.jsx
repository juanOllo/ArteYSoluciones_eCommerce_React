// import ReactDOM from 'react-dom';
import React from 'react';
import './Administracion.css';

class Administracio extends React.Component{
    constructor(props){
        super(props);
        this.state={
            actualList: this.props.originalList,
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleNewInput = this.handleNewInput.bind(this);
        this.handleRemoveInput = this.handleRemoveInput.bind(this);


        this.handleStartDemo = this.handleStartDemo.bind(this);
        this.handleFinishDemo = this.handleFinishDemo.bind(this);
    }

    handleInputChange(index, key, info, index2){

        if(index2){
            this.state.actualList[index][key][index2] = info;
        } else {
            this.state.actualList[index][key] = info;
        }

        // console.log("actualList: ", this.state.actualList);

        this.setState({
            actualList: this.state.actualList
        })
    }

    handleNewInput(index, key){
        this.state.actualList[index][key][this.state.actualList[index][key].length] = "";
        // console.log(this.state.actualList[index][key]);

        this.setState({
            actualList: this.state.actualList
        })
    }

    handleRemoveInput(index, key){
        // this.state.actualList[index][key][this.state.actualList[index][key].length] = "";
        // console.log(this.state.actualList[index][key]);

        this.state.actualList[index][key].splice(-1, 1);

        this.setState({
            actualList: this.state.actualList
        })
    }

    handleStartDemo(){
        localStorage.setItem("demoList", JSON.stringify(this.state.actualList));
        window.location.reload();
    }

    handleFinishDemo(){
        localStorage.clear("demoList");
        window.location.reload();
    }

    render(){

        // console.log("render");

        return(
            <div className='administracion-body'>

                {/* <h1 style={{paddingTop: "-5rem"}}>ADMINISTRACION</h1> */}
                <div style={{height: "3.5rem"}}></div>

                <table>
                    <thead>
                        <th style={{width: "5rem"}}>ID</th>
                        <th style={{width: "15rem"}}>Nombre</th>
                        <th style={{width: "15svw"}}>Tamaño/Precio</th>
                        <th>Descripcion</th>
                        <th>Imagenes</th>
                    </thead>

                    <tbody>

                        {
                            this.state.actualList.map((elem, index) => {
                                return(
                                    <tr>
                                        {/* ID */}
                                        <td>{elem.id}</td>

                                        {/* NAME */}
                                        <td>
                                            <textarea
                                            value={elem.nombre}
                                            onChange={(e) => this.handleInputChange(index, 'nombre', e.target.value)}
                                            />
                                        </td>

                                        {/* PRICES */}
                                        <td style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                                            {
                                                elem.precios.map((pElem) => 
                                                    <div style={{width: "100%"}}>
                                                        <input style={{width: "40%"}} value={pElem[0]} type="text" placeholder={pElem[0]}/>
                                                        $
                                                        <input style={{width: "40%"}} value={pElem[1]} type="text" placeholder={pElem[1]}/>
                                                    </div>
                                            )}
                                        </td>

                                        {/* INFO */}
                                        <td>
                                            <textarea
                                            value={elem.descripcion}
                                            onChange={(e) => this.handleInputChange(index, 'descripcion', e.target.value)}
                                            />
                                        </td>

                                        {/* IMAGES */}
                                        <td style={{display: "flex", flexDirection: "column"}}>
                                            {
                                                elem.images.map((iElem, iIndex) => <input 
                                                    onChange={(e) => this.handleInputChange(index, 'images', e.target.value, iIndex)}
                                                    value={iElem} type="text" placeholder={iElem}
                                                    />)
                                            }
                                            <span style={{display: "flex"}}>
                                                {
                                                    elem.images.length < 4 && elem.images[elem.images.length-1]? 
                                                    <button style={{width: "40%", margin: "0 auto"}} onClick={(e) => this.handleNewInput(index, 'images')}>AGREGAR</button>
                                                    : false
                                                }

                                                <button style={{width: "40%", margin: "0 auto"}} onClick={(e) => this.handleRemoveInput(index, 'images')}>BORRAR</button>
                                            </span>
                                            
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>

                    
                </table>

                <button onClick={this.handleStartDemo}>GUARDAR</button>
                {
                    localStorage.getItem("demoList") ?
                    <button onClick={this.handleFinishDemo}>TERMINAR DEMO</button>
                    : false
                }

            </div>
        )
    }
}

export default Administracio;