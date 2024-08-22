import React, { Component } from 'react';


// Vamos a importar para crear un enrutador
import { 
  BrowserRouter as Router, 
  Switch,
  Route 
} from 'react-router-dom'; 

import axios from 'axios';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import NavigationContainer from './navigation/navigation-container';
// Importo los componentes creados
import Home from './pages/home';
import About from './pages/about';
import Contact from './pages/contact';
import Blog from './pages/blog';
import BlogDetail from './pages/blog-detail';
import PortfolioManager from './pages/portfolio-manager';
import PortfolioDetail from './portfolio/portfolio-detail';
import Auth from './pages/auth';
import NoMatch from './pages/no-match';
import AddBlog from './pages/addblog';
import Icons from '../helpers/icons';

export default class App extends Component {
  constructor(props){
    super(props);

    Icons();

    this.state ={
      loggedInStatus : "NOT_LOGGED_IN" // Esto es una convención común que siempre que se desea establecer algún punto de datos que se va a utilizar como condicional en JavaScript, se hace en mayúsculas.
    }

    // Vinculamos estos controladores al constructor y vincularlos a this
    this.handleSuccessfulLogin = this.handleSuccessfulLogin.bind(this);
    this.handleUnSuccessfulLogin = this.handleUnSuccessfulLogin.bind(this);
    this.handleSuccessfulLogout = this.handleSuccessfulLogout.bind(this);
  }

  handleSuccessfulLogin(){
    this.setState ({
      loggedInStatus: "LOGGED_IN"
    });
  }

  handleUnSuccessfulLogin(){
    this.setState({
      loggedInStatus : "NOT_LOGGED_IN"
    });
  }

  // Nuestro controlador de cierre, que se activará cuando cerremos sesión y cambien el state
  handleSuccessfulLogout(){
    this.setState ({
      loggedInStatus: "NOT_LOGGED_IN"
    });
  }

  // Importamos axios al inicio y aquí llamamos a get, importante el segundo argumento withCredentials: true, porque si no se pone NO FUNCIONA
  
  checkLoginStatus(){
    return axios.get("https://api.devcamp.space/logged_in",
      {withCredentials: true}
    ).then (response => { // Como axios devuelve una promesa hay que poner el .then y la respuesta
        //console.log("logged_in_return", response)
        //creamos una varible más facil de manejar con el valor de logged_in y tb para el Status
        const loggedIn = response.data.logged_in;
        const loggedInStatus = this.state.loggedInStatus;

        // Con el if tenemos que verificar que si loggedIn y loggedInStatus (es nuestro estado no la data) estan como como LOGGED_IN NO TENEMOS QUE HACER NADA, solo devolver la data
        // Verificamos if loggedIn es true pero loggedInStatus aparece como NOT_LOGGED_IN, entonces tenemos que actualizar nuestro estado a LOGGED_IN
        // IF loggedIn es false, no está iniciada la sesión y el loggedInStatus aparece como LOGGED_IN, tenemos que actualizar el estado y cerrar sesión.
        if (loggedIn && loggedInStatus === "LOGGED_IN" ){
          return loggedIn;
        } else if (loggedIn && loggedInStatus === "NOT_LOGGED_IN"){
          this.setState({
            loggedInStatus: "LOGGED_IN"
          });
        } else if (!loggedIn && loggedInStatus === "LOGGED_IN"){ // !loggedIn es lo mismo que decir loggedIn === false
          this.setState({
            loggedInStatus: "NOT_LOGGED_IN"
          });
        }
    }) .catch(error => {
          console.log("Error" , error);
        })
  }

  // Para llamar a checkLoginStatus() utilizamos uno de los ganchos de ciclo de vida
  // Componente de montaje
  componentDidMount(){
    this.checkLoginStatus();
  }

  // Creamos una función de paginas autorizadas donde podemos ir poniendo las rutas de las que queremos que hagan algo diferente, retorna una lista de rutas, una guardia de rutas. ROUTE GUARD

  authorizedPages(){
    return [<Route key = "portfolio-manager" path = "/portfolio-manager" component={PortfolioManager} />]; // Ponemos la de portfolio manager y ahora tenemos que llamar a la función donde antes estaba la ruta de portfolio manager
  }

  
  render() {
    return (
      <div className='container'>
        <Router>
          <div>
            {/* Añadimos una propiedad al NavigationContainer, añadimos otra propiedad */}
            <NavigationContainer 
            loggedInStatus={this.state.loggedInStatus} 
            handleSuccessfulLogout={this.handleSuccessfulLogout}
            /> 
            
            {/* Nos pone un mensaje en pantalla como esta nuestro status, loggeado o no */}
            {/*<h2>{this.state.loggedInStatus}</h2>*/}

            <Switch>
              
              {/* Route como es un componente muy similar a nuestro componente de elemento de cartera o a cualquiera de esos, acepta propiedades como path(ruta). Lo que estamos haciendo es importar los componentes haciendo enrutamiento  */}
              <Route exact path = "/" component={Home} />

              {/* Vamos a decir, "oye, ruta", en realidad nos vamos a encargar de definir el proceso de renderizado para ti. */}
              {/* En lugar de simplemente definir un componente, voy a pasar la propiedad render y desde aquí pasar propiedades*/}
              <Route 
              path = "/auth" 
              render = {props => (
                <Auth // Componente Auth, está en auth.js
                  {...props} //Operador de propagación de JS, lo que vamos a hacer es difundir las propiedades que recibimos desde el render.Permitir que nuestro componente obtenga todas las propiedades
                  //Comenzamos a definir los valores
                  handleSuccessfulLogin = {this.handleSuccessfulLogin}
                  handleUnSuccessfulLogin = {this.handleUnSuccessfulLogin}
                />
              )}
              />
              <Route path = "/about-me" component={About} />
              <Route path = "/contact" component={Contact} />
              
              {/*Tenemos que pasarle la propiedad del loggedInStatus, le pasamos la propiedad render para pasar propiedades al componente */}
              <Route 
                path = "/blog"
                render = {props => (
                  <Blog //Componente Blog
                    {...props}
                    loggedInStatus = {this.state.loggedInStatus}
                  />
                )}
              />
              {/* Podemos personalizar la ruta */}
              <Route path = "/b/:slug" component={BlogDetail} />

              {/* Para el enlace Portfolio Manager */}
              {/* Creamos un condicional con operador ternario donde si el status aparece como LOGGED_IN entonces que me llame a la función y muestre la ruta y el menu portfolio manager, sino que no puedas acceder. */}
              {this.state.loggedInStatus === "LOGGED_IN" ? (this.authorizedPages()) : null}

              

              {/* Slug o permalink, es la convención de nombres común para cualquier tipo de punto final de URL personalizado. Entonces, si pongo https:localhost:3000/portfolio/denbolan ( cualquier nombre que escriba) me va al componente portfolio-detail */}
              <Route
                exact
                path="/portfolio/:slug"
                component={PortfolioDetail}
              />
              <Route path = "/addblog" component={AddBlog} />

               {/* Vamos a definir una ruta que en realidad no tiene un camino path, lo va a hacer es aprovechar la forma en que funciona switch, como si fuese un condicional.
               Es importante que esta ruta siempre esté al final porque es la que no va a coincidir, si se pone la primera siempre seria la que capturaría.*/}

              <Route component={NoMatch} />

            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}
