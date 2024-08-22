import React, {Component} from "react";
import axios from "axios";


export default class BlogDetail extends Component{
    constructor(props){
        super(props);

        this.state = {
            //Asi capturamos los parametros de la ruta
            currentId: this.props.match.params.slug,
            //Vamos a tener que completar el blog, creamos un objeto vacío para rellenarlo
            blogItem: {}
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

        return(
            <div className="blog-container">
                <div className="content-container">
                    <h1>{title}</h1>
                    <div className="featured-image-wrapper">
                        <img src={featured_image_url} />
                    </div>
                    <div className="content">{content}</div>
                </div>
            </div>
        );
    }
}