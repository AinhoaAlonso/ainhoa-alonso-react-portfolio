import React, {Component} from "react";
import axios from "axios";


export default class BlogForm extends Component{
    constructor(props){
        super(props);

        this.state = {
            title: "",
            blog_status: ""
        }

        //Vinculamos la función
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    //Función para crear el formulario y envolver todos nuestros datos en nuestra aplicación React, para que se puedan pasar fácilmente a la API.
    buildForm(){
        let formData = new FormData();

        formData.append("portfolio_blog[title]", this.state.title);
        formData.append("portfolio_blog[blog_status]", this.state.blog_status);

        return formData;
    }


    //Funcion para el envio del formulario
    //llamamos event.preventDefault y esa es una función pura de JavaScript Vanilla que hace posible que se envíe el formulario, pero la página no se actualizará.
    //necesitamos ahora llamar a handleSuccessfullFormSubmission y necesitamos pasar el blog.(mas adelante la respuesta de la API)
    handleSubmit(event){
        axios.post(
            "https://ainhoaalonso.devcamp.space/portfolio/portfolio_blogs",
            this.buildForm(),
            {withCredentials:true}
        )
        .then(response =>{
            //estamos enviando el registro del blog real, no los datos de respuesta
            this.props.handleSuccesfullFormSubmission(response.data.portfolio_blog);
            //Borramos todos los datos de nuestro formulario una vez que se mande
            this.setState({
                title: "",
                blog_status: ""
            });
        })
        .catch(error=>{
            console.log("Error al enviar Blog", error);
        });

        //this.props.handleSuccesfullFormSubmission(this.state);
        event.preventDefault();

    }

    //Función que vigila cuando cambian los valores de entrada
    handleChange(event){
        //console.log("handleChange", event);
        
        //Va a ser dinámico hay que ponerlo entre [], toma el atributo del nombre que tiene que cambiar, puede ser title como blog_status,..
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    render(){
        return(
            //Controlador de envio de formulario
            <form onSubmit={this.handleSubmit} className="blog-form-wrapper">
                <div className="two-column">
                    {/*Actualizamos nuestros controladores OnChange*/}
                    <input 
                        type="text"
                        onChange={this.handleChange} 
                        name="title"
                        placeholder="Blog title"
                        value={this.state.title}
                    />
                    <input 
                        type="text"
                        onChange={this.handleChange} 
                        name="blog_status"
                        placeholder="Blog Status"
                        value={this.state.blog_status}
                    />
                </div>
                
                <button className="btn">Save</button>
            </form>
        )
    }
}