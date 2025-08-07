import React from 'react';
import { Link } from 'react-router-dom';

class ItemsTable extends React.Component{
    constructor(props){
        super(props)

        this.state={
            displayedList: structuredClone(this.props.originalList),
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleNewInput = this.handleNewInput.bind(this);
        this.handleRemoveInput = this.handleRemoveInput.bind(this);

        this.handleStartDemo = this.handleStartDemo.bind(this);
        this.handleFinishDemo = this.handleFinishDemo.bind(this);

        
        
        this.handleUpdateItem = this.handleUpdateItem.bind(this);
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
        // uso "data" porq el nuevo inputpuede ser un obj o un string

        const updatedList = this.state.displayedList;

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

    async handleUpdateItem(id, index) {
        // console.log("id to update: ", id);
        // console.log("item updated: ", JSON.stringify(this.state.displayedList[index]));

        try {
            const response = await fetch(`http://localhost:2000/items/updateItem/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(this.state.displayedList[index])
            });

            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            }

            // const updatedItem = await response.json();
            // console.log("Respuesta del servidor:", updatedItem);

            this.props.updateOriginalList(structuredClone(this.state.displayedList));

        } catch (error) {
            console.error("Error fetching items:", error);
        }
    }

    async handleNewItem(){

        let newItemId;

        const usedIds = this.state.displayedList.map(elem => elem.id);

        console.log("ids: ", usedIds)

        do{
            newItemId = (Math.floor(Math.random() * (999 - 1)) + 99).toString();
        }while(usedIds.includes(newItemId))
        // }while(this.state.displayedList.find(elem => (elem.id === newItemId)))


        const newItemObj = {
            'id': newItemId,
            'name': '',
            'priceXSize': [
                {
                    'price': '',
                    'size' : ''
                }
            ],
            'info': '',
            'images': [
                ""
            ]
        }

        // this.state.displayedList.push(newItemObj);

        // this.setState({
        //     displayedList: this.state.displayedList
        // })

        try {
            const response = await fetch(`http://localhost:2000/items/addNewItem`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newItemObj)
            });

            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            }

            // const updatedItem = await response.json();
            // console.log("Respuesta del servidor:", updatedItem);

            const updatedList = [...this.state.displayedList];
        
            updatedList.push(newItemObj);

            this.setState({
                displayedList: updatedList
            })

            this.props.updateOriginalList(structuredClone(updatedList));

        } catch (error) {
            console.error("Error fetching items:", error);
        }

    }
    
    async handleRemoveItem(id, index){

        const updatedList = [...this.state.displayedList];
        
        updatedList.splice(index, 1);

        this.setState({
            displayedList: updatedList
        })

        if(window.confirm(`Borrar item "${this.state.displayedList[index].name}" ?`)) {
            try {
                const response = await fetch(`http://localhost:2000/items/deleteItem/${id}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" }
                });
    
                if (!response.ok) {
                    throw new Error(`Error del servidor: ${response.status}`);
                }
    
                // const updatedItem = await response.json();
                // console.log("Respuesta del servidor:", updatedItem);

                const updatedList = [...this.state.displayedList];
        
                updatedList.splice(index, 1);

                this.setState({
                    displayedList: updatedList
                })
    
                this.props.updateOriginalList(structuredClone(updatedList));
    
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        }
    }

    render(){

        return(
            <div>
                {/* <button onClick={this.handleStartDemo}>GUARDAR</button>
                {
                    localStorage.getItem("demoList") ?
                    <button onClick={this.handleFinishDemo}>TERMINAR DEMO</button>
                    : false
                } */}

                <table>
                    <thead>
                        <tr>
                            <th style={{width: "3rem"}}>ID</th>
                            <th style={{width: "15rem"}}>name</th>
                            <th style={{width: "15svw"}}>Tamaño/Precio</th>
                            <th style={{width: "27rem"}}>Descripcion</th>
                            <th>Imagenes (max: 4)</th>
                            {/* <th style={{width: "3rem"}}>DEL</th> */}
                            <th style={{width: "3rem"}}> </th>
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
                                            value={elem.name}
                                            onChange={(e) => this.handleInputChange(index, 'name', e.target.value)}
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
                                            value={elem.info}
                                            onChange={(e) => this.handleInputChange(index, 'info', e.target.value)}
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
                                    {/* DEL */}
                                        {/* <td>
                                        </td> */}
                                    {/* SAVE */}
                                        <td>
                                            {
                                               JSON.stringify(this.props.originalList[index]) !== JSON.stringify(this.state.displayedList[index]) ?
                                                <button style={{height: "2rem"}} onClick={() => this.handleUpdateItem(elem._id, index)}>GUARDAR</button>
                                                :
                                                <button style={{cursor: "default", height: "2rem", backgroundColor: "transparent", borderColor: "transparent", color: "gray"}}>GUARDAR</button>
                                            }
                                            <button style={{margin: "0.5rem 0", height: "2rem"}} onClick={() => this.handleRemoveItem(elem._id, index)}>ELIMINAR</button>

                                            <Link to={`/producto/${elem._id}`} style={{color: "black", width: "15rem", padding: "0.3rem"}}>VISTA_PREV.</Link>
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