import React from 'react';

class ImagesCol extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div>
                <div style={{display: "inline-flex", gap: "0.3rem"}}>
                    {/* Enlista las imagenes del producto q ya estan cargadas en la nube */}
                    {   this.props.elem.images.map((iElem, iIndex) => 
                            <div style={{width: "fit-content", backgroundColor: "", margin: "0", display: "flex", flexDirection: "column", alignItems: "center"}}>
                                <img style={{height: "5rem"}} src={`${iElem}`} />
                                <span>
                                    <button 
                                        onClick={() => {
                                            const updatedElem = {...this.props.elem}
                                            if (iIndex > 0) {
                                                // swap directo con destructuring
                                                [updatedElem.images[iIndex - 1], updatedElem.images[iIndex]] =
                                                    [updatedElem.images[iIndex], updatedElem.images[iIndex - 1]];

                                                this.props.updateDisplayedElem(updatedElem, this.props.index);
                                            }
                                        }}
                                    >{"<-"}</button>
                                    <button
                                        onClick={() => {
                                            const updatedElem = {...this.props.elem}
                                            if(window.confirm("Desea eliminar la imagen?")){
                                                updatedElem.images.splice(iIndex, 1);

                                                this.props.updateDisplayedElem(updatedElem, this.props.index);
                                            }
                                        }}
                                    >ELIMINAR</button>
                                    <button 
                                        onClick={() => {
                                            const updatedElem = {...this.props.elem}
                                            if (iIndex < this.props.elem.images.length - 1) {
                                                // swap directo con destructuring
                                                [updatedElem.images[iIndex + 1], updatedElem.images[iIndex]] =
                                                    [updatedElem.images[iIndex], updatedElem.images[iIndex + 1]];

                                                this.props.updateDisplayedElem(updatedElem, this.props.index);
                                            }
                                        }}
                                    >{"->"}</button>
                                </span>
                            </div>)
                    }
                    {/* Enlista las imagenes pendientes a subir a la nube,
                        mientras estan en pendiente no se pueden cambiar de lugar */}
                    {
                        this.props.files[this.props.index]?.map((file) => {
                            return(
                                <div>
                                    <img src={URL.createObjectURL(file)} alt="" style={{height: "5rem"}}/>
                                    <h5 style={{margin: "0"}}>pendiente.</h5>
                                </div>
                            )
                        })
                    }

                </div>
                    {   (this.props.elem.images.length + (this.props.files[this.props.index]?.length || 0)) < 6 ?
                            // <input style={{cursor: "pointer"}} accept="image/*" type="file" onChange={(e) => this.handleFileChange(e, this.props.index)}/>
                            <input style={{cursor: "pointer"}} accept="image/*" type="file" onChange={(e) => this.props.updateFilesList(e.target.files[0], this.props.index)}/>
                            :
                            null
                    }
            </div>
        )
    }
}

export default ImagesCol;