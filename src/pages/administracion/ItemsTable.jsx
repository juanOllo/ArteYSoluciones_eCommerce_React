import React from 'react';
import { Link } from 'react-router-dom';

class ItemsTable extends React.Component{
    constructor(props){
        super(props)

        this.inputSearch = "";

        this.state={
            displayedList: structuredClone(this.props.originalList),
        }

        this.handleInputSearchChange = this.handleInputSearchChange.bind(this);
        this.searchItems = this.searchItems.bind(this);


        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleNewInput = this.handleNewInput.bind(this);
        this.handleRemoveInput = this.handleRemoveInput.bind(this);

        // this.handleStartDemo = this.handleStartDemo.bind(this);
        // this.handleFinishDemo = this.handleFinishDemo.bind(this);
        
        this.handleUpdateItem = this.handleUpdateItem.bind(this);
        this.handleNewItem = this.handleNewItem.bind(this);
        this.handleRemoveItem = this.handleRemoveItem.bind(this);
    }

    searchItems(){

        // console.log("this.inputSearch: ", this.inputSearch);

        // tengo que hacer esto porq no se si el usuario va a usar mayusculas y/o tildes
        const cleanInputSearch = this.inputSearch.toLowerCase().replaceAll("á", "a").replaceAll("é", "e").replaceAll("í", "i").replaceAll("ó", "o").replaceAll("ú", "u");

        if (cleanInputSearch) {
            const updatedList = this.props.originalList.filter(x => x.name.toLowerCase().replaceAll("á", "a").replaceAll("é", "e").replaceAll("í", "i").replaceAll("ó", "o").replaceAll("ú", "u").includes(cleanInputSearch) || x._id.includes(cleanInputSearch))
    
            this.setState({
                displayedList: updatedList
            })
        }
    }

    handleInputSearchChange(data){

        if (data) {
            this.inputSearch = data;
        } else {
            this.inputSearch = "";
            this.setState({
                displayedList: this.props.originalList
            })
        }
    }

    handleInputChange(index, key, info, index2, key2){

        const updatedList = this.state.displayedList;

        if (key2) {
            // editar price o size
            updatedList[index][key][index2][key2] = info;

        } else if(index2 && index2 >= 0){
            // editar images
            updatedList[index][key][index2] = info;

        } else {
            // editar name o info
            updatedList[index][key] = info;
        }

        this.setState({
            displayedList: updatedList
        })
    }

    handleNewInput(index, key, data){
        // uso "data" porq el nuevo input puede ser un obj o un string

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

    // handleStartDemo(){
    //     localStorage.setItem("demoList", JSON.stringify(this.state.displayedList));
    //     window.location.reload();
    // }

    // handleFinishDemo(){
    //     localStorage.removeItem("demoList");
    //     window.location.reload();
    // }

    async handleUpdateItem(id, index) {
        // console.log("id to update: ", id);
        // console.log("item updated: ", JSON.stringify(this.state.displayedList[index]));

        // handleChange() edita la informacion del item en tiempo real dentro de this.state.displayedList
        //  por eso aqui para actualizarlo solo subo el item sin tocarlo mas.

        const updatedItem = this.state.displayedList.filter(item => item._id === id)[0];
        console.log("updatedItem: ", updatedItem);

        try {
            const response = await fetch(`http://localhost:2000/items/updateItem/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedItem)
            });

            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            } else {
                window.alert("Informacion del item actualizada exitosamente!!");
            }

            // const updatedItem = await response.json();
            // console.log("Respuesta del servidor:", updatedItem);

            const updatedList = this.props.originalList.map(item => {return item._id !== id ? item : updatedItem});

            // Actualizo el originalList para no tener q volver a hacer el fetch de toda la lista
            //  Aun sigo dudando que es mas eficiente/mejor practica.
            this.props.updateOriginalList(structuredClone(updatedList));

        } catch (error) {
            console.error("Error fetching items:", error);
        }
    }

    async handleNewItem(){

        // Creo un id para el item nuevo que no este en uso
        //  probablemente lo quite ya q mongodb le genera uno automaticamente a cada item
        let newItemId;
        const usedIds = this.state.displayedList.map(elem => elem.id);
        // console.log("ids: ", usedIds)
        do{
            newItemId = (Math.floor(Math.random() * (999 - 1)) + 99).toString();
        }while(usedIds.includes(newItemId))

        // Creo un item "vacio" con todos los campos para postearlo en la db
        //  Probablemente haya mejores maneras de tratar la creacion de un item.
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

        try {
            const response = await fetch(`http://localhost:2000/items/addNewItem`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newItemObj)
            });

            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            }

            // Cuando creo un item nuevo necesito recibir el _id creado en la api para darselo al item en el local
            //  Esto es necesario porq no puedo actualizar, ni borrar, el item si no tengo su _id
            const newItem_id = await response.json();
            newItemObj._id = newItem_id.insertedId;

            // const updatedList = [...this.state.displayedList, newItemObj];
            const updatedList = [...this.state.displayedList];
        
            updatedList.unshift(newItemObj);

            this.setState({
                displayedList: updatedList
            })

            // Actualizo el originalList para no tener q volver a hacer el fetch de toda la lista
            this.props.updateOriginalList(structuredClone(updatedList));

        } catch (error) {
            console.error("Error fetching items:", error);
        }

    }
    
    async handleRemoveItem(id, index){
        // Dejo el index solo para mostrar el nombre del item en el window.confirm

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

                const updatedList = this.props.originalList.filter(item => item._id !== id);
                const updatedDisplyedList = this.state.displayedList.filter(item => item._id !== id);
        
                // updatedList.splice(index, 1);

                this.setState({
                    displayedList: updatedDisplyedList
                })
    
                // Actualizo el originalList para no tener q volver a hacer el fetch de toda la lista
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

                <div style={{display: "flex", margin: "0 0 -1rem", width: "100%", backgroundColor: ""}}>
                    <input onChange={(e) => this.handleInputSearchChange(e.target.value)} type="text" placeholder='buscar' style={{margin: "0", padding: "0.5rem", width: "14rem", height: "1.5rem"}} />
                    <button style={{margin: "0 auto 0 0", height: "2.7rem"}} onClick={this.searchItems}>BUSCAR</button>
                    {
                        !this.inputSearch ?
                            <button onClick={this.handleNewItem} style={{margin: "0 1rem 0 5rem"}}>AÑADIR PRODUCTO</button>
                            :
                            null
                    }
                </div>

                <table>
                    <thead>
                        <tr>
                            {/* <th style={{width: "3rem"}}>ID</th> */}
                            <th style={{width: "15rem"}}>Id/Nombre</th>
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
                                        {/* <td>{elem.id}</td> */}

                                    {/* ID/NAME */}
                                        <td style={{borderTop: "1px solid black", borderRight: "1px solid black"}}>
                                            <p style={{backgroundColor: "rgba(0, 0, 0, 0.2)", margin: "-0.1rem -0.1rem 0.3rem", padding: "0.3rem 0", fontSize: "0.9rem", borderBottom: "1px solid black"}}>{elem._id}</p>
                                            <textarea
                                            value={elem.name}
                                            onChange={(e) => this.handleInputChange(index, 'name', e.target.value)}
                                            />
                                        </td>

                                    {/* PRICES */}
                                        <td style={{borderTop: "1px solid black", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
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
                                        <td style={{borderTop: "1px solid black", borderLeft: "1px solid black", borderRight: "1px solid black"}}>
                                            <textarea
                                            value={elem.info}
                                            onChange={(e) => this.handleInputChange(index, 'info', e.target.value)}
                                            />
                                        </td>

                                    {/* IMAGES */}
                                        <td style={{borderTop: "1px solid black", display: "flex", flexDirection: "column"}}>
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
                                    {/* GUARDAR, BORRAR & VISTA_PREV */}
                                        <td style={{borderTop: "1px solid black", borderLeft: "1px solid black"}}>
                                            {/* {
                                                JSON.stringify(this.props.originalList[index]) !== JSON.stringify(this.state.displayedList[index]) ?
                                                    <button style={{margin: "-1rem 0 -0.5rem", borderRadius: "0.3rem", backgroundColor: "lightgreen", border: "none", height: "2rem"}} onClick={() => this.handleUpdateItem(elem._id, index)}>GUARDAR</button>
                                                    :
                                                    <Link to={`/producto/${elem._id}`} style={{margin: "0 0.3rem", borderRadius: "0.3rem", backgroundColor: "var(--azul)", color: "black", width: "15rem", padding: "0.3rem"}}>VISTA_PREV.</Link>
                                            } */}

                                            <button style={{margin: "0 0 0.8rem", borderRadius: "0.3rem", backgroundColor: "lightgreen", border: "none", height: "2rem"}} onClick={() => this.handleUpdateItem(elem._id, index)}>GUARDAR</button>
                                            <Link to={`/producto/${elem._id}`} style={{margin: "0 0.3rem", borderRadius: "0.3rem", backgroundColor: "var(--azul)", color: "black", width: "15rem", padding: "0.3rem"}}>VISTA_PREV.</Link>
                                            <button style={{borderRadius: "0.3rem", backgroundColor: "var(--rojo)", color: "white", border: "none", margin: "0.8rem 0 0", height: "2rem"}} onClick={() => this.handleRemoveItem(elem._id, index)}>ELIMINAR</button>

                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>

                </table>
                {/* {
                    !this.inputSearch ?
                        <button onClick={this.handleNewItem} style={{margin: "3rem auto"}}>AÑADIR PRODUCTO</button>
                        :
                        null
                } */}

            </div>
        )
    }
}

export default ItemsTable;