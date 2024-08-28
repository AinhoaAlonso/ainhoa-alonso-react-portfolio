import React, {Component} from "react";
import axios from "axios";
import { DropzoneComponent} from "react-dropzone-component";

import RichTextEditor from '../forms/rich-text-editor';


// Para que funcione dropzone necesitamos importar otra biblioteca
//import "../../../node_modules/react-dropzone-component/styles/filepicker.css";
//import "../../../node_modules/dropzone/dist/min/dropzone.min.css";

export default class BlogForm extends Component{
    constructor(props){
        super(props);

        this.state = {
            id: "",
            title: "",
            blog_status: "",
            //Nuestro formulario necesita la habilidad de tener contenido
            content: "",
            featured_image:"",
            //Vamos a pasarle en el state la ruta de la API y tambien el verbo de API porque lo va a modificar dependiendo de si está creando un nuevo blog(post) o si está actualizando (patch). Asi lo hacemos más dinamico cómo lo hicimos en el portfolio-form.js
            apiUrl:"https://ainhoaalonso.devcamp.space/portfolio/portfolio_blogs",
            apiAction:"post"
        };

        //Vinculamos la función
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRichTextEditorChange = this.handleRichTextEditorChange.bind(this);

        //Para vincular el dropzone
        this.componentConfig = this.componentConfig.bind(this);
        this.djsConfig = this.djsConfig.bind(this);
        this.handleFeaturedImageDrop = this.handleFeaturedImageDrop.bind(this);
        this.deleteImage = this.deleteImage.bind(this);

        //Creamos un objeto de referencia y lo almacenará dentro de featurefImageRef y luego tendremos acceso a el
        //Cuando creamos una referencia, nos da la posibilidad de acceder y trabajar con ese componente como si fuera nuestro
        this.featuredImageRef = React.createRef();

    }
    //Funcion que elimina la imagen de cuando está el blog en modo edicion 
    deleteImage(imageType){
        axios.delete(`https://api.devcamp.space/portfolio/delete-portfolio-blog-image/${this.props.blog.id}?image_type=${imageType}`,
        {withCredentials:true}
        )
        .then(response => {
            this.props.handleFeaturedImageDelete();
            console.log("Respuesta eliminar imagen de la edicion de los blogs", response);
            
        })
        .catch(error => {
            console.log("Error del delete Image de la edicion de BLogs", error);
        });
    }

    //Entonces, no vamos a usar id para nuevas publicaciones de blog, pero en el caso de una publicación de edición, queremos un lugar donde podamos almacenar esa ID.
    //Creamos un gancho de vida donde mira si la condicion es verdadera y rellena los datos que le pedimos para poder actualizar el detalle del blog (blog-detail.js)
    componentDidMount() {
        if(this.props.editMode){
            this.setState({
                id: this.props.blog.id,
                title: this.props.blog.title,
                blog_status: this.props.blog.blog_status,
                content: this.props.blog.content,
                apiAction:"patch",
                //La url para actualizar tiene que tener el id de lo que va a actualizar, por eso lo ponemos como una interpolación de cadenas
                apiUrl: `https://ainhoaalonso.devcamp.space/portfolio/portfolio_blogs/${this.props.blog.id}`
            });
        }
    }

    //Dropzone
    //1º metodo de configuración, devuelve un objeto
    componentConfig(){
        return{
            //Limitamos el tipo de archivos que va a utilizar
            iconFiletypes: [".jpg" , ".png"],
            showFiletypeIcon: true, //Valor bolleano que muestra las imagenes
            // Esto es un pequeño truco, DropzoneComponent diseñado para personas que desean incorporar una función en la que se carga la imagen y luego la imagen va automáticamente y llega a una API y comienza a cargarse.

            //No queremos eso, queremos poder cargar el archivo, seguir trabajando en el formulario y solo cuando presionemos Enviar que el archivo se pase a la API. 
            //Entonces, lo que estamos haciendo aquí es pasar una URL simulada, será simulada, lo que significa que casi simulará acceder a esta URL. Esta URL siempre devolverá verdadero,  te permite llamar con diferentes tipos de verbos HTTP
            postUrl:"https://httpbin.org/post"
        };
    }
    // 2º método de configuracion
    djsConfig(){
        return{
            //Que permite agregar/borrar links
            addRemoveLinks: true,
            maxFiles: 1 //Archivos máximo permitidos para subir
        };
    }
    //Desarrollamos un método para manejar el proceso cuando se coloca una imagen en ese componente dropzone, para la imagen en miniatura.
    handleFeaturedImageDrop(){
        //nos devuelve un objeto que añade un archivo actualizando el atributo de la imagen en el state
        return{
            addedfile: file => this.setState({featured_image: file})
        };
    }


    //Necesitamos tener una función que podamos pasar como una propiedad al editor de texto enriquecido, le damos un argumento content que será lo que nos devuelva el rich-text-editor.js
    handleRichTextEditorChange(content){
        //Ponerlo así es lo mismo que decir "content: content", el 1º es el atributo de state y el 2º es el argumento que le pasamos, algo muy común es poner el mismo nombre y si se hace se puede poner solo una vez.
        this.setState({ content });
    }

    //Función para crear el formulario y envolver todos nuestros datos en nuestra aplicación React, para que se puedan pasar fácilmente a la API.
    buildForm(){
        let formData = new FormData();

        formData.append("portfolio_blog[title]", this.state.title);
        formData.append("portfolio_blog[blog_status]", this.state.blog_status);

        //Nos aseguramos de que el formulario este capturando nueva información
        formData.append("portfolio_blog[content]", this.state.content);

        // Solo queremos agregar este elemento formData si existe la imagen, por eso creamos un condicional
        //Si agregamos la imagen sin esta comprobación puede haber errores en el lado de la API, siempre mejor hacer la comprobación
        if(this.state.featured_image){
            formData.append("portfolio_blog[featured_image]", this.state.featured_image);
        }

        return formData;
    }


    //Funcion para el envio del formulario
    //llamamos event.preventDefault y esa es una función pura de JavaScript Vanilla que hace posible que se envíe el formulario, pero la página no se actualizará.
    //necesitamos ahora llamar a handleSuccessfullFormSubmission y necesitamos pasar el blog.(mas adelante la respuesta de la API)
    handleSubmit(event){
        //Vamos a hacer esto más dinamico y que tome los valores del state, dependiendo si está creando un blog nuevo (post) o actualizando uno existente(patch)
        /*axios.post(
            "https://ainhoaalonso.devcamp.space/portfolio/portfolio_blogs",
            this.buildForm(),
            {withCredentials:true}
        )*/
        axios({
            method: this.state.apiAction,
            url: this.state.apiUrl,
            data: this.buildForm(),
            withCredentials: true
        })
        .then(response =>{
            //Mira si existe la imagen
            //Accedemos a los datos de la ref (ref.current) que esta en el dropzone y los elimina. dropzone.removeAllFiles(), para limpiar ese formulario
            if(this.state.featured_image){
                this.featuredImageRef.current.dropzone.removeAllFiles();
            }

            //Borramos todos los datos de nuestro formulario antes de cerrar el componente, porque sino no actualiza el state porque sale una advertencia que el componente no está montado
            this.setState({
                title: "",
                blog_status: "",
                content: "",
                featured_image: ""
            });
            //Vamos a poner una condición que si el editMode es true que nos actualice ese registro, maneja un metodo de actualizacion que viene del blog-detail.js y que sino es un nuevo registro y tiene que ir al blog-modal
            if(this.props.editMode){
                this.props.handleUpdateFormSubmission(response.data.portfolio_blog);
            } else {
                 //estamos enviando el registro del blog real, no los datos de respuesta, esto viene del blog-modal
                //Al poner esto le estamos diciendo que me traiga los datos pero tambien en blog-modal tiene la propiedad de cerrar el modal que viene de blog, cierra el componente
                this.props.handleSuccesfullFormSubmission(response.data.portfolio_blog);
            };
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
        });
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
                <div className="one-column">
                    <RichTextEditor 
                        //Pasamos nuestra función como un accesorio para poder tener acceso a ella desde rich-text-editor.js
                        handleRichTextEditorChange = {this.handleRichTextEditorChange}
                        //Pasamos unas propiedades, para saber como se encuentra el state
                        editMode ={this.props.editMode}
                        //operador ternario donde va a comprobar si estamos en modo edición true y si hay contenido y sino cumple las dos cosas lo estamos no quiero ningún contenido aquí.
                        contentToEdit = {
                            this.props.editMode && this.props.blog.content ? 
                                this.props.blog.content : null
                        }
                    />
                </div>
                <div className="image-uploaders">
                    {/* Operador ternario si hay imagen y hay editMode true, está en modo Edicion entonces quiero la imagen en miniatura y tambien un enlace de eliminar*/}
                    {this.props.editMode && this.props.blog.featured_image_url ?
                        (<div className="blog-manager-image-wrapper">
                            <img src={this.props.blog.featured_image_url}></img>
                            <div className="image-removal-link">
                                <a onClick={() => this.deleteImage("featured_image")}>Remove file</a>
                            </div>
                        </div>)
                        : (<DropzoneComponent
                            //Añadimos la referencia de la imagen
                            ref={this.featuredImageRef}
                            //Si añadimos los () es porque queremos que se invoque de inmediato
                            config={this.componentConfig()}
                            djsConfig={this.djsConfig()}
                            eventHandlers={this.handleFeaturedImageDrop()}
                        >
                            <div className="dz-message">Featured Image</div>
                        </DropzoneComponent>)
                    }
                </div>
                
                <button className="btn">Save</button>
            </form>
        );
    }
}