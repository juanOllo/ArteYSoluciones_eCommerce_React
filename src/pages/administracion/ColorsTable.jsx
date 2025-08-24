import React, { useEffect } from 'react';
// import { Link } from 'react-router-dom';

class ColorsTable extends React.Component{
    constructor(props){
        super(props)

        this.state={
            displayedList: [],
            originalList: []
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        // this.handleUpdateColor = this.handleUpdateColor.bind(this);
        this.handleNewColor = this.handleNewColor.bind(this);
        // this.handleRemoveColor = this.handleRemoveColor.bind(this);
    }

    async componentDidMount() {
        try {
            // const response = await fetch("http://localhost:2000/colors/allColorsList", {
            const response = await fetch("https://ays-api.onrender.com/colors/allColorsList", {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
            const data = await response.json();
            // console.log("Colores obtenidos:", data);
            this.setState({
                // displayedList: data.slice().reverse(),
                // originalList: data.slice().reverse()
                displayedList: data.sort((a, b) => a.colorName < b.colorName ? -1 : 1),
                originalList: data.sort((a, b) => a.colorName < b.colorName ? -1 : 1)
            })
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    }

    handleInputChange(index, key, info){

        const updatedList = [...this.state.displayedList];

        switch (key) {
            case 'colorName':
            case 'isAvailable':
                updatedList[index][key] = info;
                break;
                
            default:
                break;
        }

        this.setState({
            displayedList: updatedList
        })
    }

    async handleUpdateColor(_id, index) {

        const updatedItem = this.state.displayedList.find(item => item._id === _id);
        // console.log("updatedItem: ", updatedItem);
        if (!updatedItem) {
            window.alert("No se encontró el item para actualizar.");
            return;
        }

        try {
            const response = await fetch(`https://ays-api.onrender.com/admin/updateColor`, {
            // const response = await fetch(`http://localhost:2000/admin/updateColor`, {
                method: "PATCH",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.props.token}`
                },
                body: JSON.stringify(updatedItem)
            });

            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            } else {
                window.alert(`Informacion del color [${updatedItem.colorName}] actualizada exitosamente!!`);
            }

            // const updatedItem = await response.json();
            // console.log("Respuesta del servidor:", updatedItem);

            const updatedList = this.state.originalList.map(color => {return color._id !== _id ? color : updatedItem});

            this.setState({
                originalList: updatedList
            })

        } catch (error) {
            console.error("Error fetching items:", error);
        }
    }

    async handleNewColor(){

        // Creo un item "vacio" con todos los campos para postearlo en la db
        //  Probablemente haya mejores maneras de tratar la creacion de un item.
        const newColorObj = {
            'colorName': '000Nuevo color',
            'isAvailable': false,
        }

        try {
            // const response = await fetch(`http://localhost:2000/admin/addNewColor`, {
            const response = await fetch(`https://ays-api.onrender.com/admin/addNewColor`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.props.token}`
                },
                body: JSON.stringify(newColorObj)
            });

            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            }

            // Cuando creo un item nuevo necesito recibir el _id creado en la api para darselo al item en el local
            //  Esto es necesario porq no puedo actualizar, ni borrar, el item si no tengo su _id
            const newItem_id = await response.json();
            newColorObj._id = newItem_id.insertedId;

            // const updatedList = [...this.state.displayedList, newItemObj];
            const updatedList = [...this.state.originalList];
        
            updatedList.unshift(newColorObj);

            this.setState({
                displayedList: updatedList,
                originalList: updatedList
            })

        } catch (error) {
            console.error("Error fetching items:", error);
        }

    }

    async handleRemoveColor(_id, index){
        // Dejo el index solo para mostrar el nombre del item en el window.confirm

        if(window.confirm(`Borrar color "${this.state.displayedList[index].colorName}" ?`)) {
            try {
                // const response = await fetch(`http://localhost:2000/admin/deleteColor/${_id}`, {
                const response = await fetch(`https://ays-api.onrender.com/admin/deleteColor/${_id}`, {

                    method: "DELETE",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${this.props.token}`
                    }
                });
    
                if (!response.ok) {
                    throw new Error(`Error del servidor: ${response.status}`);
                }

                const updatedDisplayedList = this.state.displayedList.filter(color => color._id !== _id);
                const updatedOriginalList = this.state.originalList.filter(color => color._id !== _id);
        
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
            <div className='colors-table' style={{marginTop: "2.5rem", width: "fit-content"}}>
                <div style={{backgroundColor: "" ,width: "100%", display: "flex"}}>
                    <button onClick={() => this.handleNewColor()} style={{margin: "0 0 0 auto", padding: "0.5rem"}}>AÑADIR COLOR</button>
                </div>

                <table style={{width: "fit-content"}}>
                    <thead style={{width: "fit-content"}}>
                        <tr style={{width: "fit-content"}}>
                            <th style={{width: "15rem"}}>ID</th>
                            <th style={{width: "10rem"}}>Color</th>
                            <th style={{width: "10rem"}}>Disponible?</th>
                            <th style={{width: "6rem"}}> </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.displayedList.map((color, index) => (
                            <tr key={index}>

                            {/* ID */}
                                <td style={{height: "3rem", backgroundColor: "rgba(0, 0, 0, 0.3"}}>{color._id}</td>

                            {/* ColorName */}
                                <td>
                                    <input onChange={(e) => this.handleInputChange(index, 'colorName', e.target.value)} type="text" value={color.colorName} style={{width: "90%"}}/>
                                </td>

                            {/* isAvailable */}
                                <td style={{display: "flex", justifyContent: "center"}}>
                                    <label>
                                        <input
                                            type="radio"
                                            name={`availible-${index}`}
                                            checked={color.isAvailable}
                                            onChange={() => this.handleInputChange(index, 'isAvailable', true)}
                                        />
                                        Sí
                                    </label>
                                    <label style={{marginLeft: "1rem"}}>
                                        <input
                                            type="radio"
                                            name={`availible-${index}`}
                                            checked={!color.isAvailable}
                                            onChange={() => this.handleInputChange(index, 'isAvailable', false)}
                                        />
                                        No
                                    </label>
                                </td>

                                <td>
                                    <button style={{margin: "0.5rem auto    ", borderRadius: "0.3rem", backgroundColor: "lightgreen", border: "none", height: "2rem"}} 
                                        onClick={() => this.handleUpdateColor(color._id, index)}
                                    >
                                        GUARDAR
                                    </button>
                                    <button style={{borderRadius: "0.3rem", backgroundColor: "var(--rojo)", color: "white", border: "none", margin: "0 auto 0.5rem", height: "2rem"}} 
                                        onClick={() => this.handleRemoveColor(color._id, index)}
                                    >
                                        ELIMINAR
                                    </button>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}
export default ColorsTable;