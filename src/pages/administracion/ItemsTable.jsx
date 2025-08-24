import React from 'react';
// import { Link } from 'react-router-dom';

class ItemsTable extends React.Component{
    constructor(props){
        super(props)

        this.inputSearch = "";

        this.state={
            displayedList: [],
            originalList: [],
            allColorsList: [],
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

    async componentDidMount(){
        try {
            // const response = await fetch("http://localhost:2000/items/allItemsList", {
            const response = await fetch("https://ays-api.onrender.com/items/allItemsList", {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
            const data = await response.json();
            this.setState({
                displayedList: data.slice().reverse(),
                originalList: data.slice().reverse()
            });
            // console.log("Items obtenidos:", data);
        } catch (error) {
            console.error("Error fetching items:", error);
        }

        try {
            // const response = await fetch("http://localhost:2000/colors/allColorsList", {
            const response = await fetch("https://ays-api.onrender.com/colors/allColorsList", {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
            const data = await response.json();
            this.setState({
                allColorsList: data.sort((a, b) => a.colorName < b.colorName ? -1 : 1),
            })
        } catch (error) {
            console.error("Error fetching colors:", error);
        }

        console.log("setState fetch");
    }

    searchItems(){

        // console.log("this.inputSearch: ", this.inputSearch);

        // tengo que hacer esto porq no se si el usuario va a usar mayusculas y/o tildes
        const cleanInputSearch = this.inputSearch.toLowerCase().replaceAll("á", "a").replaceAll("é", "e").replaceAll("í", "i").replaceAll("ó", "o").replaceAll("ú", "u");

        if (cleanInputSearch) {
            const updatedList = this.state.originalList.filter(x => x.name.toLowerCase().replaceAll("á", "a").replaceAll("é", "e").replaceAll("í", "i").replaceAll("ó", "o").replaceAll("ú", "u").includes(cleanInputSearch) || x._id.includes(cleanInputSearch))
    
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
                displayedList: [...this.state.originalList]
            })
        }
    }

    handleInputChange(index, key, info, index2, key2){

        const updatedList = [...this.state.displayedList];

        switch (key) {
            
        // editar name o info
            case 'name':
            case 'info':
            case 'colors':
                updatedList[index][key] = info;
                break;

        // editar price o size
            case 'priceXSize':
                updatedList[index][key][index2][key2] = info;
                break;

        // editar images
            case 'images':
                updatedList[index][key][index2] = info;
                break;

        // editar off
        // si no ingresas nada o ingrersas mas de 90, entonces se ingresa 0
            case 'off':
                if (!info || parseInt(info) > 90) updatedList[index][key] = 0;
                else updatedList[index][key] = parseInt(info);
                break;
                
            default:
                break;
        }

        this.setState({
            displayedList: [...updatedList]
        })
    }

    handleNewInput(index, key, data){
        // uso "data" porq el nuevo input puede ser un obj o un string

        const updatedList = [...this.state.displayedList];

        updatedList[index][key][updatedList[index][key].length] = data;

        this.setState({
            displayedList: updatedList
        })
    }

    handleRemoveInput(index, key){

        const updatedList = [...this.state.displayedList]; 

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

    async handleUpdateItem(_id, index) {
        // console.log("_id to update: ", _id);
        // console.log("item updated: ", JSON.stringify(this.state.displayedList[index]));

        // handleChange() edita la informacion del item en tiempo real dentro de this.state.displayedList
        //  por eso aqui para actualizarlo solo subo el item sin tocarlo mas.

        const updatedItem = this.state.displayedList.find(item => item._id === _id);
        // console.log("updatedItem: ", updatedItem);
        if (!updatedItem) {
            window.alert("No se encontró el item para actualizar.");
            return;
        }

        // // Checkeo que ningun campo de updatedItem esté vaco
        // if (!updatedItem.name || !updatedItem.info) {
        //     window.alert("EL CAMPO NOMBRE O DESCRIPCION ESTA VACÍO")
        //     return;
        // }
        // if (updatedItem.images.some(img => !img)) {
        //     window.alert("UN CAMPO IMAGENES ESTÁ VACÍO");
        //     return;
        // }
        // if (updatedItem.priceXSize.some(p => !p.price || !p.size)) {
        //     window.alert("UN CAMPO PRECIO O TAMAÑO ESTÁ VACÍO");
        //     return;
        // }

        try {
            const response = await fetch(`https://ays-api.onrender.com/admin/updateItem`, {
            // const response = await fetch(`http://localhost:2000/admin/updateItem`, {
                method: "PATCH",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.props.token}`
                },
                body: JSON.stringify(updatedItem),
                // body: JSON.stringify({...updatedItem,
                //     "colors": [
                //             {
                //             }
                //         ]
                // })
            });

            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            } else {
                window.alert(`Informacion del item [${updatedItem.name}] actualizada exitosamente!!`);
            }

            // const updatedItem = await response.json();
            // console.log("Respuesta del servidor:", updatedItem);

            const updatedList = this.state.originalList.map(item => {return item._id !== _id ? item : updatedItem});

            this.setState({
                originalList: updatedList
            })

        } catch (error) {
            console.error("Error fetching items:", error);
        }
    }

    async handleNewItem(){

        // Creo un item "vacio" con todos los campos para postearlo en la db
        //  Probablemente haya mejores maneras de tratar la creacion de un item.
        const newItemObj = {
            'name': 'Nombre del nuevo producto',
            'priceXSize': [
                {
                    'price': '1000',
                    'size' : '10x10'
                }
            ],
            'info': 'Info del nuevo producto',
            'images': [
                "Link de imagen"
            ],
            'colors': [],
            'stock': false,
            'off': 0,
        }

        try {
            // const response = await fetch(`http://localhost:2000/admin/addNewItem`, {
            const response = await fetch(`https://ays-api.onrender.com/admin/addNewItem`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.props.token}`
                 },
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
            const updatedList = [...this.state.originalList];
        
            updatedList.unshift(newItemObj);

            this.setState({
                displayedList: updatedList,
                originalList: updatedList
            })

        } catch (error) {
            console.error("Error fetching items:", error);
        }

    }
    
    async handleRemoveItem(_id, index){
        // Dejo el index solo para mostrar el nombre del item en el window.confirm

        if(window.confirm(`Borrar item "${this.state.displayedList[index].name}" ?`)) {
            try {
                // const response = await fetch(`http://localhost:2000/admin/deleteItem/${_id}`, {
                const response = await fetch(`https://ays-api.onrender.com/admin/deleteItem/${_id}`, {
                    method: "DELETE",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${this.props.token}`
                    }
                });
    
                if (!response.ok) {
                    throw new Error(`Error del servidor: ${response.status}`);
                }

                const updatedDisplayedList = this.state.displayedList.filter(item => item._id !== _id);
                const updatedOriginalList = this.state.originalList.filter(item => item._id !== _id);
        
                // updatedList.splice(index, 1);

                this.setState({
                    displayedList: updatedDisplayedList,
                    originalList: updatedOriginalList
                })
    
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

                <div style={{display: "flex", margin: "2.5rem 0 -1rem", width: "100%", backgroundColor: ""}}>
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
                            <th style={{width: "5rem"}}>Descripcion</th>
                            <th style={{width: "11rem"}}>Tamaño/Precio</th>
                            <th>Imagenes (max:6)</th>
                            <th style={{width: "6rem"}}>Colores</th>
                            <th style={{width: "5rem"}}>Descuento</th>
                            <th style={{width: "3rem"}}>CONTROL</th>
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
                                        <td style={{height: "10rem"}}>
                                            <p className='items-table-p-id'>{elem._id}</p>

                                            <textarea
                                                className='items-table-textarea-name'
                                                value={elem.name}
                                                onChange={(e) => this.handleInputChange(index, 'name', e.target.value)}
                                            />
                                        </td>

                                    {/* INFO */}
                                        <td>
                                            <textarea
                                            className='items-table-textarea-info'
                                            value={elem.info}
                                            onChange={(e) => this.handleInputChange(index, 'info', e.target.value)}
                                            />
                                        </td>

                                    {/* PRICES */}
                                        <td style={{position: "relative", overflowY: "scroll", scrollbarWidth: "none"}}>
                                            <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between", position: "absolute", top: "0"}}>

                                                {
                                                    elem.priceXSize.map((pElem, pIndex) => 

                                                        <div style={{width: "100%"}}>
                                                            <input onChange={(e) => this.handleInputChange(index, 'priceXSize', parseInt(e.target.value), pIndex, 'size')} style={{width: "4rem"}} value={pElem.size} type="text" placeholder={pElem.size}/>
                                                            $
                                                            <input onChange={(e) => this.handleInputChange(index, 'priceXSize', parseInt(e.target.value), pIndex, 'price')} style={{width: "4rem"}} value={pElem.price} type="text" placeholder={pElem.price}/>
                                                        </div>
                                                    )
                                                }

                                                <span style={{display: "flex"}}>
                                                    {
                                                        // elem.precios.length === 0 || (elem.precios[elem.precios.length-1][0] && elem.precios[elem.precios.length-1][1])? 
                                                        elem.priceXSize[elem.priceXSize.length-1].price && elem.priceXSize[elem.priceXSize.length-1].size? 
                                                            <button style={{backgroundColor: "rgba(0, 0, 0, 0.3)", color: "white", border : "none", padding: "0.3rem", borderRadius: "0.3rem", margin: "0.5rem auto"}} onClick={(e) => this.handleNewInput(index, 'priceXSize', {})}>AGREGAR</button>
                                                            : 
                                                            null
                                                    }

                                                    {
                                                        elem.priceXSize.length > 1 ?
                                                            <button style={{backgroundColor: "rgba(0, 0, 0, 0.3)", color: "white", border : "none", padding: "0.3rem", borderRadius: "0.3rem", margin: "0.5rem auto"}} onClick={(e) => this.handleRemoveInput(index, 'priceXSize')}>BORRAR</button>
                                                            : 
                                                            null
                                                    }

                                                </span>
                                            </div>
                                        </td>


                                    {/* IMAGES */}
                                        <td style={{position: "relative", overflowY: "scroll", scrollbarWidth: "none"}}>
                                            <div style={{display: "flex", flexDirection: "column", position: "absolute", top: "0",  width: "100%"}}>
                                                {
                                                    elem.images.map((iElem, iIndex) => <input 
                                                        onChange={(e) => this.handleInputChange(index, 'images', e.target.value, iIndex)}
                                                        value={iElem} type="text" placeholder={iElem}
                                                        />)
                                                }

                                                <span style={{display: "flex", gap: "0.5rem", width: "fit-content", margin: "0 auto"}}>
                                                    {
                                                        elem.images.length < 6 && (elem.images[elem.images.length-1] || elem.images.length === 0)? 
                                                        // (elem.images[elem.images.length-1] || elem.images.length === 0)? 
                                                            <button style={{ color: "white", backgroundColor: "rgba(0, 0, 0, 0.3)", border : "none", padding: "0.3rem", borderRadius: "0.3rem"}} onClick={(e) => this.handleNewInput(index, 'images', "")}>
                                                                AGREGAR</button>
                                                            : 
                                                            null
                                                    }

                                                    {
                                                        elem.images.length > 1 ?
                                                            <button style={{ color: "white", backgroundColor: "rgba(0, 0, 0, 0.3)", border : "none", padding: "0.3rem", borderRadius: "0.3rem"}} onClick={(e) => this.handleRemoveInput(index, 'images')}>
                                                                BORRAR</button>
                                                            : 
                                                            null
                                                    }

                                                </span>
                                            </div>
                                        </td>
                                    {/* COLORS */}
                                        <td style={{position: "relative", overflowY: "scroll", scrollbarWidth: "none"}}>
                                            <div style={{display: "flex", flexDirection: "column", position: "absolute", top: "0",  width: "100%"}}>

                                                {
                                                    this.state.allColorsList.map((cElem, cIndex) =>
                                                        <label style={{display: "flex", height: "1.1rem"}} htmlFor={`color-checkbox-${elem._id}-${cElem._id}`}>
                                                            <input id={`color-checkbox-${elem._id}-${cElem._id}`} value={cElem._id} type="checkbox" 
                                                                style={{margin: "0", width: "1.1rem", height: "1.1rem"}}
                                                                // checked={elem.colors.includes(cElem._id)}
                                                                checked={elem.colors.some(colorObj => colorObj.colorId === cElem._id)}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        this.handleInputChange(index, 'colors', [...elem.colors, {"colorId": cElem._id, "colorName": cElem.colorName}]);
                                                                    } else {
                                                                        this.handleInputChange(index, 'colors', elem.colors.filter(color => color.colorId !== cElem._id));
                                                                    }
                                                                }}
                                                            />
                                                            <p style={{transform: "translateY(-1.1rem)", textDecoration: cElem.isAvailable ? "" : "line-through"}}>
                                                                {cElem.colorName}
                                                            </p>
                                                        </label>
                                                    )
                                                }
                                            </div>

                                        </td>
                                    {/* OFF */}
                                        <td>
                                            - <input onChange={(e) => this.handleInputChange(index, 'off', e.target.value)} value={elem.off} style={{width: "1rem"}}></input> %
                                        </td>
                                    {/* GUARDAR, BORRAR & VISTA_PREV */}
                                        <td>
                                            <button style={{margin: "0 0 0.8rem", borderRadius: "0.3rem", backgroundColor: "lightgreen", border: "none", height: "2rem"}} onClick={() => this.handleUpdateItem(elem._id, index)}>GUARDAR</button>
                                            {/* <Link to={`/producto/${elem._id}`} style={{margin: "0 0.3rem", borderRadius: "0.3rem", backgroundColor: "var(--azul)", color: "black", width: "15rem", padding: "0.3rem"}}>VISTA_PREV.</Link> */}
                                            {/* <a href={`http://192.168.1.16:3000/producto/${elem._id}`} target="_blank" style={{margin: "0 0.3rem", borderRadius: "0.3rem", backgroundColor: "var(--azul)", color: "black", width: "15rem", padding: "0.3rem"}}>VISTA_PREV.</a> */}
                                            <a href={`http://localhost:3000/producto/${elem._id}`} target="_blank" style={{margin: "0 0.3rem", borderRadius: "0.3rem", backgroundColor: "var(--azul)", color: "black", width: "15rem", padding: "0.3rem"}}>VISTA_PREV.</a>
                                            <button style={{borderRadius: "0.3rem", backgroundColor: "var(--rojo)", color: "white", border: "none", margin: "0.8rem 0 0", height: "2rem"}} onClick={() => this.handleRemoveItem(elem._id, index)}>ELIMINAR</button>
                                            <div>
                                                Stock? 

                                                {/* Hay que solucionar el problema del re-render con el select */}
                                                <select 
                                                    style={{backgroundColor: "rgba(0, 0, 0, 0.2)", color: "", padding: "0.3rem 0", margin: "0.3rem 0 0 0.3rem"}}
                                                    defaultValue={elem.stock} 
                                                    onChange={e => {
                                                        if(e.target.value === "true"){

                                                            // // Checkeo que ningun campo de elem esté vaco
                                                            // if (!elem.name || !elem.info) {
                                                            //     window.alert("EL CAMPO NOMBRE O DESCRIPCION ESTA VACÍO")
                                                            //     return;
                                                            // }
                                                            // if (elem.images.some(img => !img)) {
                                                            //     window.alert("UN CAMPO IMAGENES ESTÁ VACÍO");
                                                            //     return;
                                                            // }
                                                            // if (elem.priceXSize.some(p => !p.price || !p.size)) {
                                                            //     window.alert("UN CAMPO PRECIO O TAMAÑO ESTÁ VACÍO");
                                                            //     return;
                                                            // }

                                                            this.handleInputChange(index, 'stock', true)
                                                        } else {
                                                            this.handleInputChange(index, 'stock', false);
                                                        }
                                                        }
                                                    }
                                                >
                                                    <option value="true">Si</option>
                                                    <option value="false">NO</option>
                                                </select>
                                            </div>
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