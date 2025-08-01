import React from 'react';
// import './Administracion.css';

class ItemsTable extends React.Component{
    constructor(props){
        super(props)

        this.state={
            displayedList: this.props.originalList,
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleNewInput = this.handleNewInput.bind(this);
        this.handleRemoveInput = this.handleRemoveInput.bind(this);

        this.handleStartDemo = this.handleStartDemo.bind(this);
        this.handleFinishDemo = this.handleFinishDemo.bind(this);

        this.handleNewItem = this.handleNewItem.bind(this);
        this.handleRemoveItem = this.handleRemoveItem.bind(this);
    }

    handleInputChange(index, key, info, index2, key2){

        const updatedList = this.state.displayedList;

        if (key2) {
            updatedList[index][key][index2][key2] = info;
        } else if(index2 || index2 === 0){
            updatedList[index][key][index2] = info;
        } else {
            updatedList[index][key] = info;
        }

        this.setState({
            displayedList: updatedList
        })
    }

    handleNewInput(index, key, data){

        const updatedList = this.state.displayedList; 

        console.log("llego");

        updatedList[index][key][updatedList[index][key].length] = data;

        this.setState({
            displayedList: updatedList
        })
    }

    handleRemoveInput(index, key){

        const updatedList = this.state.displayedList; 

        updatedList[index][key].splice(-1, 1);

        this.setState({
            displayedList: updatedList
        })
    }

    handleStartDemo(){
        localStorage.setItem("demoList", JSON.stringify(this.state.displayedList));
        window.location.reload();
    }

    handleFinishDemo(){
        localStorage.removeItem("demoList");
        window.location.reload();
    }
    
    handleNewItem(){

        let newItemId;

        const usedIds = this.state.displayedList.map(elem => elem.id);

        console.log("ids: ", usedIds)

        do{
            newItemId = (Math.floor(Math.random() * (999 - 1)) + 99).toString();
        }while(usedIds.includes(newItemId))
        // }while(this.state.displayedList.find(elem => (elem.id === newItemId)))


        const newItemObj = {
            'id': newItemId,
            'nombre': '',
            'precios': [
                ["", ""]
            ],
            'descripcion': '',
            'images': [
                ""
            ]
        }

        this.state.displayedList.push(newItemObj);

        this.setState({
            displayedList: this.state.displayedList
        })
    }

    handleRemoveItem(index){
        const updatedList = [...this.state.displayedList];
        
        updatedList.splice(index, 1);

        this.setState({
            displayedList: updatedList
        })
        // console.log("displayedList: ", updatedList)
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
                        <tr>
                            <th style={{width: "3rem"}}>ID</th>
                            <th style={{width: "15rem"}}>Nombre</th>
                            <th style={{width: "15svw"}}>Tamaño/Precio</th>
                            <th style={{width: "27rem"}}>Descripcion</th>
                            <th>Imagenes (max: 4)</th>
                            <th style={{width: "3rem"}}>DEL</th>
                        </tr>
                    </thead>

                    <tbody>

                        {
                            this.state.displayedList.map((elem, index) => {
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
                                                elem.priceXSize.map((pElem, pIndex) => 

                                                    <div style={{width: "100%"}}>
                                                        <input onChange={(e) => this.handleInputChange(index, 'priceXSize', e.target.value, pIndex, 'size')} style={{width: "40%"}} value={pElem.size} type="text" placeholder={pElem.size}/>
                                                        $
                                                        <input onChange={(e) => this.handleInputChange(index, 'priceXSize', e.target.value, pIndex, 'price')} style={{width: "40%"}} value={pElem.price} type="text" placeholder={pElem.price}/>
                                                    </div>
                                                )
                                            }

                                            <span style={{display: "flex"}}>
                                                {
                                                    // elem.precios.length === 0 || (elem.precios[elem.precios.length-1][0] && elem.precios[elem.precios.length-1][1])? 
                                                    elem.priceXSize[elem.priceXSize.length-1].price && elem.priceXSize[elem.priceXSize.length-1].size? 
                                                    <button style={{width: "40%", margin: "0 auto"}} onClick={(e) => this.handleNewInput(index, 'priceXSize', {})}>AGREGAR</button>
                                                    : false
                                                }

                                                {
                                                    elem.priceXSize.length > 1 ?
                                                    <button style={{width: "40%", margin: "0 auto"}} onClick={(e) => this.handleRemoveInput(index, 'priceXSize')}>BORRAR</button>
                                                     : false
                                                }

                                            </span>
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
                                                    elem.images.length < 4 && (elem.images[elem.images.length-1] || elem.images.length === 0)? 
                                                    <button style={{width: "40%", margin: "0 auto"}} onClick={(e) => this.handleNewInput(index, 'images', "")}>AGREGAR</button>
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