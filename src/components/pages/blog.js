import React, {Component} from "react";

//Esto nos permite crear un link hacia otro componente
// Hay ventajas en usar Link, es más específico en el sentido de que, si quieres tener un enlace estándar que también tenga ese comportamiento de React, si te fijas, cuando haces clic en este enlace, no cambia, no recarga la aplicación, así que esto es diferente a usar solo una etiqueta a normal.
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import BlogItem from "../blog/blog-item";
import BlogModal from "../modals/blog-modal";

export default class Blog extends Component{
    constructor(){
        super();

        this.state = {
            //Vamos a crear una matriz vacía que es donde va a meter esos datos
            blogItems:[],
            //Tambien vamos a crear un contador y una pagina inicial a cero que se va a anular según lo vayamos actualizando, es para tener un valor predeterminado
            totalCount: 0,
            currentPage: 0,
            //añadimos esto para saber si estamos en estado de carga o no. Ponemos predeterminado true
            isLoading: true,
            //Debemos conocer el estado del BlogModal, agregamos un nuevo atributo que sea false para que si abrimos blog por defecto este cerrado hasta que hagamos clic en el enlace
            blogModalIsOpen: false
        }

        this.getBlogITems = this.getBlogITems.bind(this);

        //Sacamos el evento de la función y lo ponemos dentro del constructor
        this.onScroll = this.onScroll.bind(this);
        window.addEventListener("scroll", this.onScroll, false);

        this.handleNewBlogClick = this.handleNewBlogClick.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.handleSuccessfulNewBlogSubmission = this.handleSuccessfulNewBlogSubmission.bind(this);
    }
    //función para el blog, la idea es que cuando guardes un nuevo registro salga del modal y que ese nuevo registro lo actualice en nuestro listado de blogs de la página
    handleSuccessfulNewBlogSubmission(blog){
        this.setState({
            blogModalIsOpen:false,
            //Lo que hacemos que añadir el blog que le pasamos nuevo a los blogs que ya tenemos (concat)
            blogItems: [blog].concat(this.state.blogItems)
        })
        

    }

    //Función que va a actualizar el state para cerrar el react-modal
    handleModalClose(){
        this.setState({
            blogModalIsOpen:false
        });
    }

    //Función que va a actualizar el state cuando un usuario haga click en un enlace para crear un nuevo blog
    handleNewBlogClick(){
        this.setState({
            blogModalIsOpen:true
        });
    }

    //función para el control del desplazamiento en los blogs
    onScroll(){
        // Una validación, si la longitud de los elementos del array es igual al totalCount quiero que rompas la función, que ya no continues.
        //Añado tb que mire el isLoading quiero decir que no quiero que vayas a buscar más blogItems si estamos en un estado de carga. 
        if(this.state.isLoading || this.state.blogItems.length === this.state.totalCount){
            return;
        }

        //Añadimos un condicional donde le decimos que la suma de esas dos propiedades cuando sea igual a la medida del total del documento que nos llame a la funcion y nos muestre más post.
        if(window.innerHeight + Math.ceil(document.documentElement.scrollTop) === document.documentElement.offsetHeight){
            this.getBlogITems();
            //console.log("Muestra más post");
        }
    }

    getBlogITems(){
        //Antes vamos a actulizar el state para asegurarnos que según llamemos a la API nos ponga la pagina inicial a 1
        this.setState({
            currentPage: this.state.currentPage + 1
        })

        //Llamos a la API para traer nuestros blogs
        //Agregamos un parámetro opcional a una URL al final de la cadena, agregas un signo de interrogación y luego el nombre del parámetro, en este caso page.
        //Cuando se accede a esta URL, el sistema busca si se ha configurado un parámetro de página. Si es así, enviará un conjunto de registros diferente al que enviaría si simplemente llamara a los blogs sin ninguno de ellos.
        axios.get(`https://ainhoaalonso.devcamp.space/portfolio/portfolio_blogs?page=${this.state.currentPage}`, {withCredentials: true})
        .then(response =>{
            //console.log("Respuesta API Blogs", response);

            console.log("Muestra posts", response.data);

            this.setState({
                blogItems: this.state.blogItems.concat(response.data.portfolio_blogs),
                totalCount: response.data.meta.total_records,
                //Aquí lo actualizaremos según de la respuesta
                isLoading:false,
            })
        })
        .catch(error =>{
            console.log("Error API Blogs", error)
        });
    }

    //Gancho de vidad para llamar a la función de traer de la API los blogs
    componentDidMount(){
        this.getBlogITems();
    }

    //Gancho de vida para desmontar el componente, cuando este componente desaparezca todo lo que ponga aquí se desactivara
    componentWillUnmount(){
        window.removeEventListener("scroll", this.onScroll, false);
    }

    render(){
        //Creamos una variable que va a almacenar cada blog porque el vamos a iterar y va a devolver su titulo monstrado en pantalla
        const blogRecords = this.state.blogItems.map(blogItem => {
            return <BlogItem key = {blogItem.id} blogItem = {blogItem} />
        })
        return (
            <div className="blog-container">
                {/*Le pasamos la funcion para que actualice el state cuando pulsamos para crear un nuevo blog, por defecto es false.
                Para que estas funciones se puedan llamar como props en otro componente hay que ponerlas aqui, sino no las va a encontrar, es una forma de conectar componentes*/}
                <BlogModal
                handleSuccessfulNewBlogSubmission= {this.handleSuccessfulNewBlogSubmission}
                handleModalClose= {this.handleModalClose}
                modalIsOpen={this.state.blogModalIsOpen}/>
                {/*Creamos el link para abrir el react-modal, este enlace no aparecerá si no esta identificado */}
                {this.props.loggedInStatus === "LOGGED_IN" ? 
                    (<div className="new-blog-link">
                        <a onClick={this.handleNewBlogClick}>
                        <FontAwesomeIcon icon="fa-solid fa-circle-plus" />
                        </a>
                    </div>) : null
                }
                <div className="content-container">
                    {blogRecords}   
                </div>

                {/* Creamos una condicion donde le decimos que el icono solo se cargue cuando isLoading sea true y si es false que no devuelva nada*/}
                {this.state.isLoading ? (
                    <div className="content-loader">
                    {/* Propiedad spin hace que el icono gire todo el tiempo */}
                    <FontAwesomeIcon icon="fa-solid fa-spinner" spin />
                </div>
                ): null}
                
            </div>
        );
    }
    
}
