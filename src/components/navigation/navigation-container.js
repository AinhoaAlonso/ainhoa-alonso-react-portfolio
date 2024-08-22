import React from 'react';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min';



const NavigationContainer = props => {
    //Para crear un enlace que se oculte si no está la sesión iniciada vamos a crear una función de un link dinámico.
    const dynamicLink = (route, linkText) => {
        return (
            <div className='nav-link-wrapper'>
                <NavLink exact to="/portfolio-manager" activeClassName="nav-link-active">
                    {linkText} {/* Esto coge el segundo argumento que le hemos dado dentro de nuestro dynamicLink más abajo */}
                </NavLink>
            </div>
        );
    };

    // Vamos a crear un enlace de cierre se sesion y va a llamar al controlador que está en app.js
    const handleSignOut = () => {
        // Llamamos a axios con el verbo delete porque queremos eliminar algo, ahora tambien recibimos una promesa
        axios.delete("https://api.devcamp.space/logout", {withCredentials: true})
        // Como respuesta recibimos un estado, si es 200 signica que funcionó y quiero que regreses a la pagina de inicio y también que me llames al controlador de cierre.
        .then ( response => {
            if(response.status === 200) {
                //console.log("respuesta de cierre", response);
                props.history.push("/"); // Vuelve a la página de inicio
                props.handleSuccessfulLogout(); // Llama al controlador de cierre en app.js
            }
            return response.data; // Esto no importa pero se considera mala práctica no devolver algo cuando se llama a una promesa
        }).catch(error => { // Vamos a capturar esos errores
            console.log("Error", error);
        })

    }
    
    return (
        <div className='nav-wrapper'>
            <div className='left-side'>
                <div className='nav-link-wrapper'>
                    <NavLink exact to="/" activeClassName="nav-link-active">
                        Home
                    </NavLink>
                </div>
                <div className='nav-link-wrapper'>
                    <NavLink exact to="/about-me" activeClassName="nav-link-active">
                        About
                    </NavLink>
                </div>
                <div className='nav-link-wrapper'>
                    <NavLink exact to="/contact" activeClassName="nav-link-active">
                        Contact
                    </NavLink>
                </div>

                <div className='nav-link-wrapper'>
                    <NavLink exact to="/blog" activeClassName="nav-link-active">
                        Blog
                    </NavLink>
                </div>

                {/* Ahora podemos aqui nuestro enlace dinámico de portfolio manager, creamos una condición con operador ternario*/}
                {props.loggedInStatus === "LOGGED_IN"  ?  (dynamicLink("/portfolio-manager", "Portfolio Manager")) : null }
                

                <div className='nav-link-wrapper'>
                    <NavLink exact to="/addblog">
                        {/* Aquí lo que vamos a añadir es un operador ternario donde le decimos que si se cumple la condicion nos muestre el boton y si no lo es que no lo muestre. Como es una aplicacion de prueba solo cambiando true o false lo podemos ver, aunque en una aplicacion real lo tendremos que coger de otro sitio y tener en cuenta si el usuario que se conecta es administrador o no */}
                    
                        {false ? <button>Add Blog</button> : null} {/* Este va a ser uno de los botones que sólo va a poder ver el administrador, es una forma de poner un condicional directamente */}

                    </NavLink>
                </div>
            </div>
            <div className='right-side'>
                AINHOA ALONSO
                {/* Aquí creo una condicion donde le digo que me mire como está el status y si esta loggeado que cree un enlace Sign Out, ese enlace llama a la función de cierre si le das click, si no estás loggeado no se ve nada*/}
                {props.loggedInStatus === "LOGGED_IN" ? (
                    <a onClick={handleSignOut}>
                        {/* Para saber como se escribe he ido a la web de font awesome y he mirado el icono/react */}
                        <FontAwesomeIcon icon="fa-solid fa-right-from-bracket" />
                    </a>
                ): null}
            </div>
                
            {/* Si quiero crear un enlace pero que sea a una página externa de mi página única de react se puede hacer así: <a href='https://www.google.es'a target='blank'>Acceso a Google</a> */}
            
        </div>
    )
}

// Aquí lo llamamos
export default withRouter(NavigationContainer);

