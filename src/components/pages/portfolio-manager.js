import React, {Component} from "react";
import axios from "axios";

import PortfolioSidebarList from "../portfolio/portfolio-sidebar-list";
import PortfolioForm from "../portfolio/portfolio-form";

export default class PortfolioManager extends Component{
    constructor() {
        super();

        this.state ={
            portfolioItems:[],
            portfolioToEdit:{} //Será un objeto vacío en el state y cada vez que queramos editarlo, actualizaremos el state y reemplazaremos este objeto vacío con el registro del portfolio que queremos actualizar.
        }

        //Vinculamos esto al componente
        this.handleNewFormSubmission = this.handleNewFormSubmission.bind(this);
        this.handleEditFormSubmission = this.handleEditFormSubmission.bind(this);
        this.handleFormSubmissionError = this.handleFormSubmissionError.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleEditClick = this.handleEditClick.bind(this);
        this.clearPortfolioToEdit = this.clearPortfolioToEdit.bind(this);
    }

    // Vamos a crear funciones handles que van a actualizar el estado
    // Cosas que necesitamos hacer
    // actualizar el estado de portfolioItems
    // cuando agregamos un nuevo elemento (portfolioItem) al portfolio queremos que añada los datos de ese elemento a nuestra lista lateral, para esto tenemos que añadirlo a ese array del state(portfolioItems)
    
    handleNewFormSubmission(portfolioItem){
        console.log("handleSuccessfulFormSubmission", portfolioItem);

        // Implementamos el comportamiento en el que cada vez que agrego un registro nuevo se pone encima, el primero
        // Creamos una matriz con un elemento y, a partir de allí, la conectamos con otra matriz que es nuestra lista actual de elementos de la cartera (la concatenamos)
        this.setState ({
            portfolioItems : [portfolioItem].concat(this.state.portfolioItems)
        });
    }
    //Función para editar el formulario e invocamos a getPortfolioItems, porque lo que queremos es que una vez que se actualice el registro queremos que haga una pasada por nuestro servidor y traiga los datos.
    handleEditFormSubmission(){
        this.getPortfolioItems();
    }

    // También nos ocupamos por si ocurre un error
    handleFormSubmissionError(error){
        console.log("Handle Form Submission Error", error);

    }
    
    // Creamos la función, sabemos que estamos obteniendo un elemento de cartera como argumento, así que imprimamos esto y luego en render llamamos a la función completa.
    handleDeleteClick(portfolioItem){
        //console.log("Delete click", portfolioItem);
        //Creamos la llamada a axios como una interpolación de cadena porque queremos llamar al elemento de portfolio que queremos borrar
        axios.delete(` https://api.devcamp.space/portfolio/portfolio_items/${portfolioItem.id}`,
            {withCredentials: true}
        )
        .then(response =>{
            console.log("Respuesta del delete", response);
            //Si la respuesta es correcta tenemos que borrar los datos del registro, actualizar el state
            //Vamos a iterar y construir una nueva colección sobre la marcha y vamos a usar la función de filtro para hacer eso.La idea es crear un nuevo array sin el elemento que voy a eliminar
            this.setState ({
                //Va a llamar a nuestro state de portfolioItems y va a iterar por cada elemento y va a guardar cada elemento que sea diferente al portfolioItem.id que me hemos clickado para eliminar. Esto va a actualizar nuestro registro con los valores que quedan.
                portfolioItems: this.state.portfolioItems.filter (item => {
                    return item.id !== portfolioItem.id;
                })
            })
            //Esto hay que ponerlo por buenas prácticas, tiene que devolver una respuesta
            return response.data;
        })
        .catch(error => {
            console.log("Error en el delete", error);
        });
    }

    handleEditClick(portfolioItem){
        //Actualizamos el state y le pasamos que portfolioToEdit tome los valores del registro de portfolio en el estamos.
        this.setState({
            portfolioToEdit: portfolioItem
        });

    }

    //Creamos una función que nos permita limpiar nuestro portfolio para editar el registo, no tiene argumentos y actualiza es state dejando el objeto en su estado inicial.
    clearPortfolioToEdit(){
        this.setState({
            portfolioToEdit: {}
        });
    }


    // Nueva función para comunicarnos con una API con axios y dentro pego lo que necesito de Get desde la documentación de axios.
    getPortfolioItems (){
        // Ponemos la URL get de nuestra API
        axios.get('https://ainhoaalonso.devcamp.space/portfolio/portfolio_items?order_by=created_at&direction=desc', {withCredentials: true})
        .then(response => {
            // handle success
            console.log("Datos de respuesta", response);

            // Va a cambiar el estado de la data y a traer los datos de nuestra API
            this.setState({
                portfolioItems: [...response.data.portfolio_items]
            });
        })
        .catch(error => {
            // handle error
            console.log(error);
        });
    }

    // Gancho de vida de montaje
    componentDidMount(){
        this.getPortfolioItems();
    }

    render(){
        return(
            <div className="portfolio-manager-wrapper">
                <div className="left-column">
                    {/* Llamamos al componente de clase creado para hacer el formulario(portfolio-form.js) y pasamos las funciones como props */}
                    {/* Aquí es dónde también pasamos la función de limpiar el formulario */}
                    {/* Pasamos la función de edición para poder utilizarla en otro componente */}
                    <PortfolioForm 
                        handleEditFormSubmission = {this.handleEditFormSubmission}
                        handleNewFormSubmission = {this.handleNewFormSubmission}
                        handleFormSubmissionError = {this.handleFormSubmissionError}
                        clearPortfolioToEdit = {this.clearPortfolioToEdit}
                        //También le pasamos el objeto, vamos a comprobar si portfolioToEdit se completa o no
                        portfolioToEdit = {this.state.portfolioToEdit}
                    /> 
                </div>
                <div className="right-column">
                    
                    {/* Hemos creado el componente funcional que lo llamamos aqui y le pasamos una propiedad, los datos del state de portfolioItems */}
                    {/* Gracias a que le pasamos esta propiedad desde portfolio-sidebar-list vamos a tener acceso a los 12 elementos de nuestra data. */}
                    {/* Tambien llamamos a la función delete, para que borre el portfolioItem en el que se encuentre*/}
                    {/* Tambien llamamos a la función edit, para que actualice el portfolioItem en el que se encuentre*/}
                    <PortfolioSidebarList 
                        handleEditClick = {this.handleEditClick}
                        handleDeleteClick = {this.handleDeleteClick}
                        data={this.state.portfolioItems} 
                    />
                </div>
            </div>
        );
    }
}