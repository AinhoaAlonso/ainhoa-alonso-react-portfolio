import React, {Component} from "react";
import axios from "axios";

export default class Login extends Component{
    constructor(props) {
        super(props);

        this.state = {
            email:"",
            password:"",
            errorText:""
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    // handleChange necesita hacer es tomar el valor a medida que el usuario lo escribe y actualizar el estado durante ese proceso
    handleChange(event) {
        // Necesitamos saber si es un correo electrónico o una contraseña, si hacemos antes un debugger podemos buscar en la consola el nombre de lo que estamos cambiando y elegir dinámicamente el nombre que vamos a obtener.
        this.setState({
            [event.target.name]: event.target.value,
            errorText:"" // Al poner esto si escribimos algo por error nos lo deja vacio el error para poder volver a escribirlo.
        });
       
    }
    
    handleSubmit(event) {

        // Tenemos acceso a este correo electrónico y contraseña, pero no los obtendremos del evento, simplemente accederemos al estado directamente.
        //console.log("Handle Submit", this.state.email, this.state.password);


        //El proceso que estamos haciendo ahora, estamos creando la capacidad de crear una sesión en el servidor para que el servidor envíe una cookie, la almacene directamente en el navegador y eso es lo que se podrá usar para asegurarnos de que tengamos la capacidad de iniciar sesión o si no tenemos esa capacidad.
        axios.post(
            "https://api.devcamp.space/sessions",
            { 
                client: {
                    email: this.state.email,
                    password: this.state.password
                }
            },
            { withCredentials: true }
        )
            // Siempre que realizas una solicitud de API, tú, como cliente, se envía más que solo el mensaje e incluso más que solo el mensaje y tu información personal, cuando envías ese tweet, el protocolo HTTP envía todo tipo de metadatos.
            // Envía cookies a tu sistema, envía otros metadatos sobre cómo estás creando el tweet, todo tipo de cosas así, para que el servidor pueda interpretar eso y luego tomar una decisión sobre cómo reaccionar. Entonces, cuando digo withCredentials: true, lo que estoy diciendo es que quiero que envíes las cookies autorizadas al sistema para ver si este usuario esta autorizado en el sistema y luego enviará una respuesta.
        
            // Debido a que una API no es inmediata, no puedes esperar enviar la solicitud y obtener los datos de inmediato, podría tomar algunos milisegundos, podría tomar algunos segundos, por lo que Axios funciona con promesas.
            
        .then(response => {
            // response.data.status es lo que se devuelve, si es created es que estas dentro
            if(response.data.status === "created"){
                console.log("Estas accediendo", response);
                this.props.handleSuccessfulAuth();

            } else {  
                this.setState({
                    errorText: "Email o contraseña incorrectos"
                });
                this.props.handleUnSuccessfulAuth();
            }
            //console.log("Datos respuesta", response);
        }).catch(error =>{
            console.log("Ha ocurrido un error", error); // Capturamos el error
            this.setState ({
                errorText:"Ha ocurrido un error"
            });
            this.props.handleUnSuccessfulAuth();
        });

        // Imprime nuestro registro de consola, pero no se redireccionó. Lo que estamos haciendo es decir que quiero que encuentres este evento y luego NO quiero que actualices la página, no quiero que sigas tu comportamiento predeterminado, no quiero que pongas este correo electrónico y esta contraseña en la barra de URL, ese tipo de cosas.

        //Siempre que trabajes con formularios en React, normalmente también tendrás que evitar ese comportamiento predeterminado, por lo que ese es el primer paso.
        event.preventDefault();
    }
    
    render() {
        return (
            <div>
                <h1>LOGIN TO ACCESS YOUR DASHBOARD</h1>

                <div>{this.state.errorText}</div>

                <form onSubmit={this.handleSubmit}> 
                    <input 
                        type="email" // Esto es específico del HTML
                        name="email" // Aqui podemos poner el nombre que queramos pero tiene que ser el mismo que el objeto del state.
                        placeholder="Your email"
                        value={this.state.email}
                        onChange={this.handleChange}
                    />
                    
                    <input 
                        type="password"
                        name="password" // Aqui podemos poner el nombre que queramos pero tiene que ser el mismo que el objeto del state.
                        placeholder="Your password"
                        value={this.state.password}
                        onChange={this.handleChange}
                    />
                    <div>
                        <button type="submit">Login</button>
                    </div>
                </form>
            </div>
        );
    }
}