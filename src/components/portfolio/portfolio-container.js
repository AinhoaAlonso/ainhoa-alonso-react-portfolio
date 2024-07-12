import React, { Component } from 'react';
import PortfolioItem from './portfolio-item';

export default class PortfolioContanier extends Component {
    constructor() {
        super();
    
        //Sintaxis para crear el state en React y luego se define un objeto (par clave-valor), lo llamo dentro de la función render
        //Hemos declarado lo que se llama un estado Inicial en la función constructora

        // Lo bueno de esto, y es lo que veremos en la próxima guía, es que ahora que están ahí podemos hacer que otras partes del componente se comuniquen con ellos. Podemos realizar tareas en estos otros elementos, podemos hacer clic en un botón y eliminar uno, podemos editarlo, podemos hacer todo tipo de cosas porque ahora está en el estado del componente, tenemos acceso a él como queramos.
        
        this.state = {
            pageTitle : "Bienvenido a mi portfolio",
            //Vamos a crear un objeto anidado y luego lo llamaremos
            data : [
                { title: "Denbolan"}, 
                { title: "Grupo Aesi"},
                { title: "Proyecta"} 
            ] 
        };
    }

    // Vamos a crear una función personalizada donde vamos a recorrer un array como si fuese un bucle. Ahora creamos el array con los datos pero en una aplicación real los datos los traeremos de una API
    portfolioItems(){
        
        // Voy a hacer un bucle donde llamamos al objeto data del estado inicial
        return this.state.data.map(item => {
            return <PortfolioItem title ={item.title} />; // Desde aqui lo tenemos que llamar item.title para que asigne el título.
        })

    }
    // Si utilizamos un componente basado en clases, siempre vamos a tener una funcion render.
    render(){
        return (
            <div>
                {/* Desde aquí llamamos al estado inicial, hacemos referencia a la instancia de este componente*/}
                <h2>{this.state.pageTitle}</h2>
                {this.portfolioItems()}
            </div>
        )
    }

}