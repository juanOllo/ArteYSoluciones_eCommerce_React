import React from 'react';
// import './Administracion.css';

class ItemsTable extends React.Component{
    constructor(props){
        super(props)

        this.state={
            actualList: this.props.originalList,
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleNewInput = this.handleNewInput.bind(this);
        this.handleRemoveInput = this.handleRemoveInput.bind(this);


        this.handleStartDemo = this.handleStartDemo.bind(this);
        this.handleFinishDemo = this.handleFinishDemo.bind(this);

        this.handleNewItem = this.handleNewItem.bind(this);
        this.handleRemoveItem = this.handleRemoveItem.bind(this);
    }

    handleInputChange(index, key, info, index2){

        if(index2 || index2==0){
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
    
    handleNewItem(){

        let newItemId;

        do{
            newItemId = Math.floor(Math.random() * (999 - 1)) + 1;
        }while(this.state.actualList.find(elem => (elem.id === newItemId)))

        const newItemObj = {
            'id': newItemId,
            'nombre': '',
            'precios': [],
            'descripcion': '',
            'images': []
        }

        this.state.actualList.push(newItemObj);

        this.setState({
            actualList: this.state.actualList
        })
    }

    handleRemoveItem(index){
        const updatedList = [...this.state.actualList];
        updatedList.splice(index, 1);


        // this.state.actualList.splice(index, 1)
        this.setState({
            actualList: updatedList
        })
        console.log("actualList: ", updatedList)
    }

    render(){
        return(
            <div>
                <button onClick={this.handleStartDemo}>GUARDAR</button>
                {
                    localStorage.getItem("demoList") ?
                    <button onClick={this.handleFinishDemo}>TERMINAR DEMO</button>
                    : false
                }

                <table>
                    <thead>
                        <th style={{width: "3rem"}}>ID</th>
                        <th style={{width: "15rem"}}>Nombre</th>
                        <th style={{width: "15svw"}}>Tamaño/Precio</th>
                        <th style={{width: "27rem"}}>Descripcion</th>
                        <th>Imagenes (max: 4)</th>
                        <th style={{width: "3rem"}}>DEL</th>
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
                                                    elem.images.length < 4 && (elem.images[elem.images.length-1] || elem.images.length == 0)? 
                                                    <button style={{width: "40%", margin: "0 auto"}} onClick={(e) => this.handleNewInput(index, 'images')}>AGREGAR</button>
                                                    : false
                                                }

                                                {
                                                    elem.images.length > 1 ?
                                                    <button style={{width: "40%", margin: "0 auto"}} onClick={(e) => this.handleRemoveInput(index, 'images')}>BORRAR</button>
                                                     : false
                                                }

                                            </span>
                                            
                                        </td>
                                        <td>
                                            <button onClick={() => this.handleRemoveItem(index)}>X</button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>

                </table>

                <button onClick={this.handleNewItem} style={{margin: "3rem auto"}}>AÑADIR PRODUCTO</button>

            </div>
        )
    }
}

export default ItemsTable;