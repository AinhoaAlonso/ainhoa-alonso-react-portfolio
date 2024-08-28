import React, {Component} from "react";
import axios from "axios";

import ReactHtmlParser from "react-html-parser";

import BlogForm from "../blog/blog-form";
import BlogFeaturedImage from "../blog/blog-featured-image";



export default class BlogDetail extends Component{
    constructor(props){
        super(props);

        this.state = {
            //Asi capturamos los parametros de la ruta
            currentId: this.props.match.params.slug,
            //Vamos a tener que completar el blog, creamos un objeto vacío para rellenarlo
            blogItem: {},
            //Este será nuestro estado para que el componente pueda monitorear si estamos en modo edición, false predeterminado
            editMode: false
        }
        //Vinculamos la función para utilizarla en otra parte
        this.handleEditClick = this.handleEditClick.bind(this);
        this.handleFeaturedImageDelete = this.handleFeaturedImageDelete.bind(this);
        this.handleUpdateFormSubmission = this.handleUpdateFormSubmission.bind(this);
    }
    //Función de actualización del blog cuando está en modo edicion, vamos a pasar esta funcion dentro del blog-form.js, toma como argumento el blog en que se encuentra
    handleUpdateFormSubmission (blog){
        //Actualiza el state de ese blog completo y tambien el editMode a false para que cuando le des al boton salga y estes en el detalle del blog
        this.setState({
            blogItem: blog,
            editMode: false
        })

    }

    //Función que cuando está en modo edicion del blog y damos a eliminar la imagen la va a quitar y va a aparecer el dropzone
    handleFeaturedImageDelete(){
        //Tenemos que cambiar el state para que la imagen este vacía
        this.setState({
            blogItem :{
                featured_image_url: ""
            }
        })
    }

    //Función que vamos a llamar cuando hacemos click en el titulo, primero comprobamos que estamos logeados para permitir abrir la ventana de edicion al hacer click.
    handleEditClick(){
        //console.log("Probando si hace click");
        if(this.props.loggedInStatus === "LOGGED_IN"){
            this.setState({
                editMode: true
            });
        }  
    }

    //Creamos la funcion que nos va a traer de la API los datos del elemento del blog que coincida con el id de la ruta.
    getBlogItem(){
        //El motivo por el que no tenemos que pasar las credenciales con el valor true aquí es porque hice que estos puntos finales de API estén abiertos al mundo. 
        axios.get(`https://ainhoaalonso.devcamp.space/portfolio/portfolio_blogs/${this.state.currentId}`)
        .then(response =>{
            console.log("Datos del elemento blog", response);
            this.setState({
                blogItem: response.data.portfolio_blog
            });
            
        })
        .catch(error=>{
            console.log("getBlogItem", error);
        });
    }
    //llamamos a la función desde el gancho de vida de montaje
    componentDidMount(){
        this.getBlogItem();
    }

    render(){
        console.log("currentID", this.state.currentId);
        
        /* Utilizamos la deconstruccion para traer los datos a las variables*/
        const {
            title,
            content,
            featured_image_url,
            blog_status
        } = this.state.blogItem;

        //Creo una función que me va a manejar la logica de todo el contenido si está en modo edición
        const contentManager = () =>{
            if(this.state.editMode){
                //Le pasamos los datos que vamos a necesitar, si está en modo edicion y el blog completo
                return (
                    <BlogForm 
                        handleUpdateFormSubmission = {this.handleUpdateFormSubmission}
                        handleFeaturedImageDelete = {this.handleFeaturedImageDelete}
                        editMode = {this.state.editMode} 
                        blog = {this.state.blogItem}
                    />
                );
            } else{
                return(
                    <div className="content-container">
                        <h1 onClick={this.handleEditClick}>{title}</h1>

                        {/*Para que no aparezca feo si no tiene una imagen vamos a hacer una condición para que solo lo muestre si hay imagen, vamos a mejorar este codigo y realmente vamos a hacer un nuevo componente funcional que haga este trabajo*/}
                        <BlogFeaturedImage img={featured_image_url} />
                        
                        {/*llamamos a la biblioteca y todo nuestro código se procesa como código HTML */}
                        <div className="content">{ReactHtmlParser(content)}</div>
                    </div>
                )
            }
        }
        //Llamamos a la función del contenido que tiene en cuenta la condicion si está en modo edicion o no.
        return(
            <div className="blog-container">
                {contentManager()}
            </div>
        );
    }
}