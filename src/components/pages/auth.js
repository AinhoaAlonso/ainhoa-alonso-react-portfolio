import React, {Component} from "react";
import Login from "../auth/login";
import loginImg from "../../../static/assets/images/auth/login.jpg";

export default class Auth extends Component {
   constructor(props){
    super(props);

    //Vinculamos los métodos al this para poder llamarlos
    this.handleSuccessfulAuth = this.handleSuccessfulAuth.bind(this);
    this.handleUnSuccessfulAuth = this. handleUnSuccessfulAuth.bind(this);

   }

   // Varios métodos que van a actualizar las props(handleSuccessfulLogin y handleUnSuccessfulLogin) que recibimos desde el render props de app.js, la Route de Auth. y también las props que se pasarán al inicio de sesión (login.js).
   handleSuccessfulAuth(){

        this.props.handleSuccessfulLogin();
        //Aquí es donde realizaremos la redirección.
        this.props.history.push("/"); //Quiero redirigirlos a la página de inicio, y la forma de hacerlo con React Router es diciendo this.props.history, entonces lo que estamos haciendo es mirar el historial de nuestra navegación (de nuestra aplicación no el historial de navegación web).

   }

   handleUnSuccessfulAuth(){
        this.props.handleUnSuccessfulLogin();
   }

    render() {
        return (
            <div className="auth-page-wrapper">
                <div className="left-column" style={{backgroundImage:`url(${loginImg})`}}>
                    
                </div>
                <div className="right-column">
                
                {/* Ahora lo llamamos desde el componente de inicio de sesión  y se comunicará automáticamente con el componente de la aplicación.(app.js) */}
                <Login 
                    handleSuccessfulAuth = {this.handleSuccessfulAuth}
                    handleUnSuccessfulAuth = {this.handleUnSuccessfulAuth}
                /> 
                </div>
            </div>
        )

    }                      
}