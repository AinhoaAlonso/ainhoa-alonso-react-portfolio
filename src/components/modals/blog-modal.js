import React, {Component} from "react";
import ReactModal from "react-modal";
import BlogForm from "../blog/blog-form";

//Como elemento le pasamos el nombre de la class de toda la aplicación que está en index.html
ReactModal.setAppElement(".app-wrapper");

export default class BlogModal extends Component{
    constructor(props){
        super(props);

        //Vamos a aplicar los estilos en línea para que prevalezcan a los que tiene por defecto el react-modal
        this.customStyles = {
            content : {
                top: "50%",
                left: "50%",
                right: "auto",
                marginRight: "-50%",
                transform: "translate(-50%, -50%)",
                width: "800px"
            },
            //Efecto de superposición,oscurece lo de abajo cuando se abre, color negro pero un poco transparente(0.75)
            overlay:{
                backgroundColor: "rgba(1, 1, 1, 0.75)"
            }
        };

        //Vinculamos la función para poder utilizarla en otros componentes
        this.handleSuccesfullFormSubmission = this.handleSuccesfullFormSubmission.bind(this);
    }

    //Creamos una función para pasar los datos que obtenemos correctamente y le pasamos un registro de blog cuando pulsas save
    handleSuccesfullFormSubmission(blog){
        //de momento hacemos un console para verlo en pantalla más adelante pasaremos la respuesta a una API
        console.log("Blog Form Successfull", blog);

        //Le pasa como propiedad el metodo para cerrar el modal
        this.props.handleSuccessfulNewBlogSubmission(blog);
    }

    render(){
        return(
            //Con isOpen el modal deberia abrirse cuando lo llamamos desde cualquier otro componente, toma un valor dinámico segun el state
            //Añadimos onRequestClose con valor una funcion que cuando pulse fuera del modal o de escape me lo cierre
            //LLamamos a los estilos personalizados
            <ReactModal 
                style={this.customStyles}
                onRequestClose={() => {
                this.props.handleModalClose();
            }} isOpen={this.props.modalIsOpen}>
                    {/*Pasamos la función como propiedad a nuestro blogForm */}
                    <BlogForm 
                        handleSuccesfullFormSubmission ={this.handleSuccesfullFormSubmission}
                    />
            </ReactModal>
        )
    }
}