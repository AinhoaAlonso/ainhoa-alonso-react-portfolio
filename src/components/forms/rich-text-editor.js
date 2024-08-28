import React, {Component} from "react";
import { EditorState, convertToRaw, ContentState} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";

//Esta nos va a ayudar para mandar el contenido del texto enriquecido cuando hacemos click en el detalle del blog.
import htmlToDraft from "html-to-draftjs";


export default class RichTextEditor extends Component{
    constructor(props){
        super(props);

        this.state = {
            //En lugar de tener un string vacío o un valor tiene una función
            //No es un tipo de valor normal con el que podamos trabajar y, por eso, vamos a tener que realizar algunas otras tareas para llegar a nuestro estado de editor y obtener el valor.
            editorState: EditorState.createEmpty()
        }

        //vinculamos la función para poder utilizarla
        this.onEditorStateChange = this.onEditorStateChange.bind(this);
        this.getBase64 = this.getBase64.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
    }
    //Gancho de vida para comprobar si estamos en modo edicion o no, que viene desde el blog-detail.js
    //Lo que vamos a hacer desde aquí es si hay contenido HTML(que es nuestro blog), lo convierta para que lo pueda meter en editor de texto enriquecido
    //En la guía utiliza componentWillMount pero está obsoleto
    componentDidMount(){
        //Una condicion que nos verifique si estamos en editMode true y si tenemos contenido, esto lo hemos pasado a este componente desde el blog-form.js, si esto se verifica entramos en lo que tenemos que hacer
        if(this.props.editMode && this.props.contentToEdit){
            //1º analizamos nuestro HTML, devuelve un objeto, todo lo que escribimos aquí está en la documentacion de htmlToDraftjs
            const blocksFromHtml = htmlToDraft(this.props.contentToEdit);
            //hacemos una desestructuración el objeto para poder acceder a él y lo que extraigo lo guardo en 2 variables
            const { contentBlocks, entityMap } = blocksFromHtml;
            //nos dará acceso directo al contentState de draft-js,  createFromBlocksArray toma dos objetos, o toma dos variables y las pasamos y luego contentState podrá trabajar con draft-js y actualizar ese estado.
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
            //establecer el editorState, cuando está en editMode true, queremos establecer ese editorState, pero queremos pasar algo de contenido.
            const editorState = EditorState.createWithContent(contentState);
            //Establecemos el state
            this.setState({ editorState });
        }

    }

    //Función para poder modificar state y tomar el valor de la función
    onEditorStateChange(editorState){
        // //Ponerlo así es lo mismo que decir "editorState: editorState", el 1º es el atributo de state y el 2º es el argumento que le pasamos, algo muy común es poner el mismo nombre y si se hace se puede poner solo una vez.
        //Es un evento asíncrono, no estamos seguros cuando se llamará y esto puede producir un retraso, si luego tenemos una función que llame a ese estado y todavia no se ha actualizado podemos obtener una version desactualizada del state.
        // Para evitar esto podemos otro argumento al setState , que hace que espere hasta que se actualice el state para hacer otras cosas, en este caso llamar a la la funcion de blog-form con el argumento de lo que escribimos para que lo pase como contenido
        //Hay que tener en cuenta que handleRichTextEditorChange espera que se le pase un string si ponemos "editorState" en realidad estariamos pasando una funcion
        this.setState(
            { editorState }, 
            this.props.handleRichTextEditorChange(
                //Esto va a tomar el contenido de draft.js lo va a revisar y si está bien lo va a convetir en un string, lo explico mejor en la documentación.
                draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
            ));
    }
    //Funcion desde la que obtenemos los datos para poder subir la imagen
    getBase64(file, callback){
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => callback(reader.result);
        reader.onerror = error => {};
    }

    //Creamos la función que gestiona el proceso de lo que sucede cuando se selecciona una imagen para nuestro editor de texto enriquecido
    uploadFile(file){
        //Creamos una promesa
        return new Promise((resolve, reject) =>{
            this.getBase64(file, data =>resolve({data: {link: data} }));
        });

        //Vamos a crear una función que hará lo que se llama una conversión de imagen base64.
        //No podemos simplemente incrustar un archivo de imagen directamente en nuestra cadena de texto. Lo que tenemos que hacer es tomar la imagen y convertirla en algo que se pueda almacenar como texto y luego podemos incrustarla junto con nuestras etiquetas de párrafo
        
        //console.log("subida de la imagen", file);
    }

    render(){
        return(
            <div>
                <Editor 
                    editorState={this.state.editorState}
                    wrapperClassName="demo-wrapper"
                    editorClassName="demo-editor"
                    //La pasamos como una propiedad
                    onEditorStateChange={this.onEditorStateChange}
                    //Vamos a modificar la barra de herramientas
                    //Todo esto está en la documentacion de react-draft-wysiwyg
                    //Ponemos doble llaves {{}}, si ponemos solo una par de {} esperaría un solo elemento, o una función, o algo así. Pero lo que estamos haciendo es pasar un objeto completo
                    toolbar={{
                        //Va poniendo los iconos en desplegables
                        //Icono de negrita, cursiva,...
                        inline: {inDropdown: true},
                        //Icono de ordenar,desordenar
                        list: {inDropdown:true},
                        textAlign: {inDropdown:true},
                        link: {inDropdown: true},
                        //Este es el icono de deshacer
                        history: {inDropdown:true},
                        //Para poder extraer la imagen y permitir incrustarla dentro del editor de texto
                        image: {
                            //necesitamos tener una función cada vez que una imagen se suelta dentro de ella
                            uploadCallback: this.uploadFile,
                            //Capacidad de agregar un texto alternativo para la optimización del motor de búsqueda
                            alt: {present: true, mandatory: false},
                            //previsualiza la imagen antes de subirla
                            previewImage: true,
                            //Tipo de archivos que acepta, escribir tal cual
                            inputAccept: "image/gif,image/jpeg,image/jpg,image/png,image/svg"
                        }
                    }}

                />
            </div>
        )
    }
}