import React, {Component} from "react";
import axios from "axios";
import DropzoneComponent from "react-dropzone-component";

// Para que funcione dropzone necesitamos importar otra biblioteca
import "../../../node_modules/react-dropzone-component/styles/filepicker.css";
import "../../../node_modules/dropzone/dist/min/dropzone.min.css";


// Creamos el componente de clase para poder acceder a el desde el componente padre (portfolio-manager.js)
export default class PortfolioForm extends Component {
    constructor(props){
        super(props);

        this.state = {
            name: "",
            description: "",
            category: "eCommerce",
            position: "",
            url: "",
            thumb_image: "",
            banner_image: "",
            logo: "",
            editMode: false,
            apiUrl: "https://ainhoaalonso.devcamp.space/portfolio/portfolio_items",
            apiAction: "post" //esta propiedad post, porque de manera predeterminada vamos a hacer que nuestro formulario use la funcionalidad de creación y luego solo si estamos en modo de edición va a ir y va a cambiar a esta actualización o este modo de edición.
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        //Añadimos los metodos de dropzone para poder llamarlos como propiedades dentro del componente
        this.componentConfig = this.componentConfig.bind(this);
        this.djsConfig = this.djsConfig.bind(this);
        this.handleThumbDrop = this.handleThumbDrop.bind(this);
        this.handleBannerDrop = this.handleBannerDrop.bind(this);
        this.handleLogoDrop = this.handleLogoDrop.bind(this);
        this.deleteImage = this.deleteImage.bind(this);

        // Crea objetos de referencia y los almacenará dentro de thumbRef, bannerRef y logoRef y luego tendremos acceso a ellos
        this.thumbRef = React.createRef();
        this.bannerRef = React.createRef();
        this.logoRef = React.createRef();
    
    }

    //Función para eliminar la imagen miniatura, le pasamos un argumento para que sepa cuál de las imágenes tiene que borrar
    deleteImage(imageType) {
        //probamos si accede a la funcion
        //console.log("Delete miniatura", imageType);


        //En la url de la API pasamos el ID del registro y luego pasamos como argumento opcional el tipo de imagen, esto es lo que nos va a decir si es thumb, banner o logo
        axios.delete(`https://api.devcamp.space/portfolio/delete-portfolio-image/${this.state.id}?image_type=${imageType}`, {withCredentials:true}

        ).then(response => {
            //console.log(" Respuesta del delete imagen", response);
            //Actualizamos el state y decimos que cualquiera que sea la imagen con url, queremos borrarla y que pongas una cadena vacía
            this.setState({
                [`${imageType}_url`]:""
            })
        })
        .catch(error =>{
            console.log("Error al eliminiar imagen", error);
        })

    }

    //Gancho para el cicho de vida 
    //Vamos a estar atentos a cuándo se actualizó el componente, porque lo que necesitamos escuchar es si estamos recibiendo esas propiedades, por lo que si el registro portfolioToEdit se actualiza, necesitamos saberlo y este es un buen gancho de ciclo de vida para eso.

    componentDidUpdate(){
        //Esto lo que nos dice que si la longitud de Object.keys de nuestro objeto es mayor que 0 significa que hay algo dentro(0 o 1) y tendremos que hacer.....
        //Si fuese "0" el objeto está vacío
        if (Object.keys(this.props.portfolioToEdit).length > 0) { 
            //Vamos a hacer deconstruccion para extraer todos lo datos y no ir uno por uno
            const {
                id,
                name,
                description,
                category,
                position,
                url,
                thumb_image_url, 
                banner_image_url,
                logo_url
            } = this.props.portfolioToEdit;

            //Tenemos nuestros datos almacenados dentro de variables. Lo que hace componentDidUpdate, cada vez que un usuario realiza un cambio, como escribir en el formulario, esto se activará y eso no es bueno porque lo que hará es borrar nuestro formulario cada vez y lo restablecerá.
            //Lo que vamos a hacer es llamar a nuestra función de limpieza para que actualice a portfolioToEdit a su estado inicial y así no se vuelve a activar la condición.
            this.props.clearPortfolioToEdit();

            this.setState({
                id:id, //Siempre tenemos un valor id
                name: name || "", //Esto dice que si hay actualización de "name" lo pongas y si no lo hay dejes vacío
                description: description || "",
                category: category || "eCommerce",
                position: position || "",
                url: url || "",
                editMode: true, //Aquí lo cambiamos porque estamos actualizando
                apiUrl: `https://ainhoaalonso.devcamp.space/portfolio/portfolio_items/${id}`, //Iterpolación de cadenas donde tenemos que posicionarnos en el registro que estamos modificando, seleccionamos la variable donde nos guarda esos datos en la desestructuración.
                apiAction: "patch",
                thumb_image_url: thumb_image_url || "",
                banner_image_url: banner_image_url || "",
                logo_url: logo_url || ""
            });
        }
    }


    //Dropzone

    //Desarrollamos un método para manejar el proceso cuando se coloca una imagen en ese componente de zona de colocación, para la imagen en miniatura.
    handleThumbDrop(){
        return {
            addedfile: file => this.setState({thumb_image: file})
        };
    }

    handleBannerDrop(){
        return {
            addedfile: file => this.setState({banner_image: file})
        };
    }

    handleLogoDrop(){
        return {
            addedfile: file => this.setState({logo: file})
        };
    }

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
            //Que permite borrar links
            addRemoveLinks: true,
            maxFiles: 1 //Archivos máximo permitidos para subir
        };
    }

    // Método con la única tarea de crear el formulario
    buildForm(){
        // Lo que vamos a hacer aquí es decirle a JavaScript que quiero crear un nuevo objeto FormData y una vez que lo tengamos, podemos agregarle todos los demás puntos de datos.
        let formData = new FormData();
        // la API va a esperar un objeto y una forma de representar un objeto y luego llamar a esos valores es mediante el uso de la sintaxis de corchetes.
        // agregamos estas llamadas de append al FormData
        formData.append("portfolio_item[name]", this.state.name);
        formData.append("portfolio_item[description]", this.state.description);
        formData.append("portfolio_item[url]", this.state.url);
        formData.append("portfolio_item[category]", this.state.category);
        formData.append("portfolio_item[position]", this.state.position);
        
        // Solo queremos agregar este elemento formData si existe la imagen, por eso creamos un condicional
        if(this.state.thumb_image){
            formData.append("portfolio_item[thumb_image]", this.state.thumb_image);
        }
        if(this.state.banner_image){
            formData.append("portfolio_item[banner_image]", this.state.banner_image);
        } 
        if(this.state.logo){
            formData.append("portfolio_item[logo]", this.state.logo);
        }
        

        //debugger;

        //devolvemos el formulario completo
        return formData;

    }

    handleChange(event){
        //console.log("handle Change", event);

        // Vamos a actualizar el estado del componente en función de nuevos valores.
        // event.target.name: Accede al atributo name del elemento que ha disparado el evento.
        // Al ponerlo entre [] permite que el valor de name se utilice como la clave en el objeto que estamos pasando a setState.
        // event.target.value: Representa el valor actual del campo de entrada
        // cuando el usuario escribe o cambia algo, ese valor se asigna al estado del componente bajo la clave que coincide con el nombre del campo.
        this.setState({
            [event.target.name] : event.target.value
        });
    }

    //Vamos a modificar esto para que sea más dinámico y permita tanto crear como modificar en la API
    
    handleSubmit(event){
        //console.log("event", event);

         // Todo lo que tendremos que hacer es, dentro de nuestra llamada Axios en handleSubmit, solo tenemos que decir this.buildForm, y hará el resto por nosotros, reunirá todos los datos, formateará las imágenes de una manera que la API las entenderá.Simplemente pasamos buildForm y la API se encarga del resto
         // 3 argumentos: la ruta de la api donde lo vamos a subir, los datos que nos los va a dar el buildForm () y credenciales true.

        /*axios.post(
            "https://ainhoaalonso.devcamp.space/portfolio/portfolio_items", 
            this.buildForm(),
            { withCredentials: true }
        )*/

        //Más dinámico
        axios({
            method:this.state.apiAction,
            url: this.state.apiUrl,
            data: this.buildForm(),
            withCredentials:true
        })
        .then(response => {
            //Vamos a crear una condición para que sepa si tiene que actualizar un registro ya creado o crear uno nuevo
            //Si el editMode es true
            if (this.state.editMode){
                this.props.handleEditFormSubmission();
            } else {
                // Pasamos response.data.portfolio_item como argumento porque hemos visto que eso es lo que se devuelve cuando tenemos un registro creado exitosamente.
                this.props.handleNewFormSubmission(response.data.portfolio_item);
            }

            //También tenemos que borrar todo nuestro formulario, actualizamos el state.
            //Porque no hemos hecho solo actualizar el state?? porque no funcionaría, aquí thumb_image, banner_image y logo son atributos y no te los quitaria del formulario, necesitas seleccionarlos del dropzone, por esto utilizamos las referencias, para que nos den acceso al DOM.
            this.setState({
                name: "",
                description: "",
                category: "eCommerce",
                position: "",
                url: "",
                thumb_image: "",
                banner_image: "",
                logo: "",
                editMode: false,
                apiUrl: "https://ainhoaalonso.devcamp.space/portfolio/portfolio_items",
                apiAction: "post"
            });

            //Creamos un array con las 3 referencias al DOM y va ir iterando en orden por cada una de ellas, accedemos a los datos de la ref (ref.current) que esta en el dropzone y los elimina. dropzone.removeAllFiles(), está dentro de la documentación de dropzone.
            [this.thumbRef, this.bannerRef, this.logoRef].forEach(ref =>{
                ref.current.dropzone.removeAllFiles();
            });

            //console.log("Response", response);
        })
        .catch(error => {
            console.log("Portfolio Form Error", error);

        });

        // Imprime nuestro registro de consola, pero no se redireccionó. Lo que estamos haciendo es decir que quiero que encuentres este evento y luego NO quiero que actualices la página, no quiero que sigas tu comportamiento predeterminado, no quiero que pongas este correo electrónico y esta contraseña en la barra de URL, ese tipo de cosas.

        //Siempre que trabajes con formularios en React, normalmente también tendrás que evitar ese comportamiento predeterminado, por lo que ese es el primer paso.
        
        event.preventDefault();
    }

    render(){
        return(
            <form onSubmit={this.handleSubmit} className="portfolio-form-wrapper">
                <div className="two-column">
                    <input 
                        type ="text" 
                        name="name" 
                        placeholder="Portfolio Item Name" 
                        value={this.state.name} 
                        onChange={this.handleChange}>
                    </input>
                    <input 
                        type ="text" 
                        name="url" 
                        placeholder="URL" 
                        value={this.state.url} 
                        onChange={this.handleChange}>
                    </input>
                </div>
                <div className="two-column">
                    <input 
                        type ="text" 
                        name="position" 
                        placeholder="Position" 
                        value={this.state.position} 
                        onChange={this.handleChange}>
                    </input>

                    {/* Cambiamos category para que sea un menú desplegable */}
                    <select name="category" value={this.state.category} onChange={this.handleChange} className="select-element">
                        <option value = "eCommerce">eCommerce</option>
                        <option value = "Scheduling">Scheduling</option>
                        <option value = "Enterprise">Enterprise</option>
                    </select>
                </div>
                <div className="one-column">
                    <textarea type ="text" name="description" placeholder="Description" value={this.state.description} onChange={this.handleChange}/>
                </div>
                {/* Llamamos a los métodos de dropzone */}
                <div className="image-uploaders three-column">
                    {/* Operador ternario */}
                    {this.state.thumb_image_url && this.state.editMode ? 
                       <div className="portfolio-manager-image-wrapper">
                            <img src={this.state.thumb_image_url}></img>
                            <div className="image-removal-link">
                                <a onClick={() => this.deleteImage("thumb_image")}>Remove file</a>
                            </div>
                        </div>
                        : (<DropzoneComponent 
                        //Agregamos nuestras referencias (refs) a JSX
                        ref = {this.thumbRef}
                            config={this.componentConfig()}
                            djsConfig={this.djsConfig()}
                            // Lo llamamos dentro del componente dropzone
                            eventHandlers={this.handleThumbDrop()}
                        >
                            {/* Hemos creado el div con la misma className que genera automáticamente y lo hemos personalizado */}
                            <div className="dz-message">Thumbnail</div>
                        </DropzoneComponent>)
                    }
                    {this.state.banner_image_url && this.state.editMode ?
                        <div className="portfolio-manager-image-wrapper">
                            <img src={this.state.banner_image_url}></img>
                            <div className="image-removal-link">
                                <a onClick={() => this.deleteImage("banner_image")}>Remove file</a>
                            </div>
                        </div>
                        : (<DropzoneComponent 
                            ref = {this.bannerRef}
                            config={this.componentConfig()}
                            djsConfig={this.djsConfig()}
                            // Lo llamamos dentro del componente dropzone
                            eventHandlers={this.handleBannerDrop()}
                        >
                            <div className="dz-message">Banner</div>
                        </DropzoneComponent>)
                     }
                     {this.state.logo_url && this.state.editMode ? 
                        <div className="portfolio-manager-image-wrapper">
                            <img src={this.state.logo_url}></img>
                            <div className="image-removal-link">
                                <a onClick={() => this.deleteImage("logo")}>Remove file</a>
                            </div>
                        </div>
                        : (<DropzoneComponent 
                            ref = {this.logoRef}
                            config={this.componentConfig()}
                            djsConfig={this.djsConfig()}
                            // Lo llamamos dentro del componente dropzone
                            eventHandlers={this.handleLogoDrop()}
                        >
                            <div className="dz-message">Logo</div>
                        </DropzoneComponent>)
                     }
                </div>
                <div>
                    <button className="btn" type="submit">Save</button>
                </div>
            </form>
        );
    }
}