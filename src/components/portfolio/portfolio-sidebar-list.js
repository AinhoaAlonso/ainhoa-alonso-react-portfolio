import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";


//Creamos un componente funcional para mostrar las imagenes en la barra lateral del portfolio-manager, y recoge las propiedades del componente padre portfolio-manager.js
const PortfolioSidebarList = (props) => {

    //Creamos una función de iteración por el array de datos que tenemos y de cada elemento devolvemos la imagen, el nombre y el id y los guarda en la variable portfolioList
    const portfolioList = props.data.map(portfolioItem => {
        return (
            <div key={portfolioItem.id} className="portfolio-item-thumb">
                <div className="portfolio-thumb-img">
                    <img src={portfolioItem.thumb_image_url}></img>
                </div>
                <div className="text-content">
                    <div className="title">{portfolioItem.name}</div>
                    <div className="actions">
                            {/* Creamos un enlace onClick y le pasamos la funcion edit para actualizar el registro del portfolio en el que se encuentre. Añadimos un icono */}
                        <a className= "action-icon" onClick={() => props.handleEditClick(portfolioItem)}> 
                            <FontAwesomeIcon icon="fa-solid fa-pen-to-square" />
                        </a>
                            {/* Hemos creado un enlace, que está vinculado a un controlador onClick,al que pasamos una función y, cada vez que un usuario haga clic en este enlace se activará esta función. Y además de activar la función, se pasará el registro del elemento de cartera actual. */}
                            {/* Quitamos el delete y añadimos un icono */}
                        <a className= "action-icon" onClick={() => props.handleDeleteClick(portfolioItem)}> 
                            <FontAwesomeIcon icon = "trash" />
                        </a>
                    </div>
                </div>
                
            </div>
        )

    });
    //Llamamos a esa variable
    return <div className="portfolio-sidebar-list-wrapper">{portfolioList}</div>

}

export default PortfolioSidebarList;