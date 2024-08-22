import React, { Component } from 'react';

// Una de las propiedas es un enlace, importamos link
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

// Para poder manejar estilos y que cuando pases por encima de uno de los elementos del portfolio este se oscurezca, lo mejor es que esto sea un componente de clase con un estado y que tenga añada/quite una className cuando pasa por encima.

export default class PortfolioItem extends Component {
    constructor(props){
        super(props);

        // Vamos a poner en estado una clase que de inicio va a estar vacía y que luego cuando pasemos por encima va a cambiar el state.
        this.state = {
            portfolioItemClass: ""
        };
    }

    // Por convencion comun en la comunidad de React cuando trabajamos con controladores de eventos que empiecen por "handle". Lo que quiero hacer para handleMouseEnter es actualizar el estado y que añada esa class.
    handleMouseEnter(){
        this.setState ({portfolioItemClass: "image-blur"});

    }
    handleMouseLeave(){
        this.setState ({portfolioItemClass: ""});
    }


    
    render(){

        // Datos que vamos a necesitar de la API:
        // - Imagen de fondo
        // - Logo
        // - Descripcion
        // - ID

        // Vamos a hacer desestructuración de JavaScript, es una forma en la que puedes tener un objeto y luego extraer las claves y asignarlas automáticamente a las variables. Vas a ver esto en muchos proyectos de React, así que es bueno practicarlo en situaciones como esta.

        // Vamos a coger los datos que queremos extraer que los hemos visto antes con el debugger o con las herramientas de React
        const {id, description, thumb_image_url, logo_url} = this.props.item;
        return (
            // Clase en singular diferente a la que hemos creado en portfolio-container dentro de render envolviendo el portfolioItems().
            // Aquí agregamos nuestros detectores de eventos. Aquí, quiero que esto se envuelva y escuche todo el div, stos deben tener el nombre exacto que les estoy dando porque son los oyentes dedicados que nos da React.
            <div className='portfolio-item-wrapper' 

            // La razón por la que tenemos que tener los paréntesis aquí, y una función de flecha antes de llamar a la función aquí es porque, si no, entonces esta función se ejecutaría automáticamente, y eso causaría un problema porque, entonces, automáticamente, estaría actualizando su estado constantemente, y crearía este bucle infinito donde se actualiza a imagen borrosa, y luego se establece en una cadena vacía, y terminaría con un gran error.

            //Cuando se pasa este tipo de sintaxis donde se empieza con los paréntesis y luego la función de flecha, lo que esto le dice a JavaScript es que no quiero que ejecute este código hasta que ocurra este evento. No lo ejecute cuando se cargue la página o cuando se monte el componente, cárguelo y espere para ejecutarlo, y no lo ejecute hasta que el evento sea verdadero. Así es como funciona onMouseEnter.
            onMouseEnter={() => this.handleMouseEnter()} 
            onMouseLeave={() => this.handleMouseLeave()}
            > 

                {/* Crearé lo que se llama un div de cierre automático. */}
                <div className={
                    "portfolio-img-background " + this.state.portfolioItemClass
                }
                    /* Sintaxis de como pasar estilos en react con JSX, style en minúscula y con llaves porque pasamos código JS, y luego otras llaves porque es un objeto */
                    style={{
                        backgroundImage: "url(" + thumb_image_url + ")"
                    }}
                />

                <div className='img-text-wrapper'>
                    <div className='logo-wrapper'>
                        <img src={logo_url} />
                    </div>
                    <div className='subtitle'>{description}</div>
                </div>
            </div>
        )
    }   
}
