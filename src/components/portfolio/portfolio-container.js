import React, { Component } from 'react';
import PortfolioItem from './portfolio-item';
import axios from 'axios';

export default class PortfolioContainer extends Component {
    constructor() {
        super();
    
        //Sintaxis para crear el state en React y luego se define un objeto (par clave-valor), lo llamo dentro de la función render
        //Hemos declarado lo que se llama un estado Inicial en la función constructora

        // Lo bueno de esto, y es lo que veremos en la próxima guía, es que ahora que están ahí podemos hacer que otras partes del componente se comuniquen con ellos. Podemos realizar tareas en estos otros elementos, podemos hacer clic en un botón y eliminar uno, podemos editarlo, podemos hacer todo tipo de cosas porque ahora está en el estado del componente, tenemos acceso a él como queramos.
        
        this.state = {
            pageTitle : "Bienvenido a mi portfolio",
            
            // Creamos otro objeto que es el loading de carga del condicional que está en render().
            isLoading: false,
            //Vamos a crear un objeto anidado y luego lo llamaremos, añadimos slug para crear enlaces dinámicos
            data : [
                /*{ title: "Denbolan", category: "ETT", slug:"denbolan"}, 
                { title: "Grupo Aesi", category: "Empresa", slug:"grupoaesi"},
                { title: "Proyecta", category: "Asesoria", slug:"proyecta"},
                { title: "Ainair", category: "Empresa", slug:"ainair"},
                { title: "Hotel Igeretxe", category: "Hotel", slug:"hoteligeretxe"}*/

            ] 
        };
        
        // Aquí es donde le decimos al componente que tiene que tener acceso al this para poder actualizar el título desde un evento onClick en un botón.
        // bind (unir).
        // Lo que estamos haciendo aquí es decir que esta función debe estar vinculada y enlazada a esta instancia del componente. Entonces, este PortfolioContainer, siempre que se crea y se representa en la página, necesitamos vincular handlePageTitleUpdate para que tenga acceso a todos estos datos, como el título de la página, para que podamos conectarlo y llamar a this.handlePageTitleUpdate. Entonces, esta es una forma de vincular el estado y los datos del componente a esta función personalizada.
        // ¿por qué no necesitábamos hacer eso para portfolioItems? Porque, como puede observar, eso simplemente funciona. Podemos llamarlo e incluso podemos llamarlo directamente dentro de la vista y podemos usar la palabra clave "this". La razón de esto es que cada vez que estás creando elementos, como escuchas de clics, debes poder darle a ese escucha de clics o a esa función a la que lo estás pasando, debes conectarlo directamente al componente, y cada vez que tienes una función personalizada, entonces debes poder ser un poco más explícito con ella.
        //this.handlePageTitleUpdate = this.handlePageTitleUpdate.bind(this);

        //Vamos a enlazar la función handleFilter con this.
        this.handleFilter = this.handleFilter.bind(this);

        // Esto nos da la capacidad de llamar a este método y de referenciarlo como método dentro de esta class, función de nuestra API
        /* No lo necesito porque no lo voy a llamar desde render(), sino desde uno de los ganchos del ciclo de vida.
        this.getPortfolioItems = this.getPortfolioItems.bind(this);*/

    }

    // Función para crear un filtro de datos y le vamos a pasar un argumento
    handleFilter(filter){
        this.setState({

            // Aquí estamos actualizando los datos diciendole que me haga un filter (es parecido a un bucle) y que cuando la category del elemento sea igual a ese filter me aparezcan solo esos datos.
            // Esto lo vamos a lanzar desde unos botones donde tendremos que especificar el argumento filter.
            data: this.state.data.filter(item => {
                return item.category === filter;
            })
        });
    }

    // Nueva función para comunicarnos con una API con axios y dentro pego lo que necesito de Get desde la documentación de axios.
    getPortfolioItems (){
        // Ponemos la URL get de nuestra API
        axios.get('https://ainhoaalonso.devcamp.space/portfolio/portfolio_items')
        .then(response => {
            // handle success
            console.log("Datos de respuesta", response);

            // Va a cambiar el estado de la data y a traer los datos de nuestra API
            this.setState({
                data: response.data.portfolio_items
            });
        })
        .catch(error => {
            // handle error
            console.log(error);
        })
        .finally ( () => {
            // always executed
        });
    }

    // Vamos a crear una función personalizada donde vamos a recorrer un array como si fuese un bucle. Ahora creamos el array con los datos pero en una aplicación real los datos los traeremos de una API
    portfolioItems(){
        
        // Voy a hacer un bucle donde llamamos al objeto data del estado inicial
        return this.state.data.map(item => {
            //debugger;
            return <PortfolioItem key ={item.id} item ={item}/>; // item = {item} estoy pasando este objeto de elemento completo
            // La propiedad KEY nos da la capacidad de realizar un seguimiento y tiene que se unica.
        })

    }

    // Gancho de vida de montaje
    componentDidMount(){
        this.getPortfolioItems();
    }

    // El objetivo de esta función es que deberíamos poder hacer click en un botón de la página y debería actualizar el título de nuestra página.
    // Nos da un buen ejemplo de lo que tiene que pasar para establecer el estado de nuestro componente
    /*handlePageTitleUpdate(){
        this.setState({
            pageTitle: "Actualización título"
        });
    }*/

    // Si utilizamos un componente basado en clases, siempre vamos a tener una funcion render.
    render(){
        // Aquí vamos a agregar la condición que mientras carga los datos me muestre un loading...
        // Como no estamos conectados a una Api esto va a sacar por pantalla, el título, la fecha y loading..., no va a cargar los botones porque se queda en la condición, interrumpe la función render().
        // Esto en el mundo real no funcionaria porque habria que llamar a un servicio externo API, y tb hacer que actualizar el state para que cuando cargue los datos salte la condición y siga con el renderizado.
        if (this.state.isLoading){
            return (
                <div>Loading....</div>
            )
        }

        //Ahora cada vez que llame a render va a llamar a getPortfolioItems
        /*update: lo voy a llamar desde un gancho de ciclo de vida
        this.getPortfolioItems();*/

        return (
            <div className='portfolio-items-wrapper'>
                {/* Para que funcione el evento con argumentos hay que llamarlos creando una función anónima (un función flecha) y lo que va a hacer es que no se va a ejecutar automáticamente. Se van a cargar las funciones pero no se van a llamar*/}
                {/*<button className="btn" onClick={() => this.handleFilter("Technology")}>Technology</button>*/}
                <button className="btn" onClick={() => this.handleFilter("eCommerce")}>eCommerce</button>
                <button className="btn" onClick={() => this.handleFilter("Scheduling")}>Scheduling</button>
                <button className="btn" onClick={() => this.handleFilter("Enterprise")}>Enterprise</button>
                {/*<button className="btn" onClick={() => this.handleFilter("Social Media")}>Social Media</button>*/}
                {/*<button className="btn" onClick={() => this.handleFilter("Education")}>Education</button>*/}
                
                {this.portfolioItems()}
            </div>
                
                /*Aquí vamos a crear un generador de eventos onClick para llamar a la función que hemos creado para actualizara nuestro título.
                En principio parece que debería funcionar pero si hacemos click nos da un error.
                Este error ocurre porque aunque estamos definiendo correctamente la función tenemos que avisar al componente que debe tener acceso a la palabra clave this, necesita saber que puede tener acceso a todos los datos del componente. Esto lo vamos a hacer en el CONSTRUCTOR
                <button onClick={this.handlePageTitleUpdate}>Cambiar Título</button>*/     
        )
    }

}