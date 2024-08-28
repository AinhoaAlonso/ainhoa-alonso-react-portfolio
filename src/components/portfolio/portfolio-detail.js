import React, {Component} from "react";
import axios from "axios";
export default class PortfolioDetail extends Component{
    constructor(props){
        super(props);

        this.state = {
            //Asi capturamos los parametros de la ruta que nos dice el portfolio en el que estamos, y luego lo pasamos para recuperar de la API porque solo queremos el que pulsemos
            currentId : this.props.match.params.slug,
            portfolioItem:{}
        }
    }
    getPortfolioItem(){
        axios.get(`https://ainhoaalonso.devcamp.space/portfolio/portfolio_items/${this.state.currentId}`,
            {withCredentials:true}
        )
        .then(response => {
            console.log("Portfolio details respuesta", response);
            //Cambiamos el state con la respuesta del portfolio en el que nos encontramos
            this.setState({
                portfolioItem: response.data.portfolio_item
            })
        })
        .catch (error =>{
            console.log("Error en el portfolio details", error);
        })
    }
    //Gancho de vida para llamar a la funcion que recupera el portfolio de la API
    componentDidMount(){
        this.getPortfolioItem();
    }
    //Vamos a realizar la desestructuracion para tomar cada uno de los valores que queremos mostrar en el portfolio detail
    render(){
        const {
            name,
            category,
            description,
            url,
            banner_image_url,
            thumb_image_url,
            logo_url
        } = this.state.portfolioItem;

        //Vamos a crear un estilo en línea porque cuando ponemos el logo es transparente y queremos que debajo tenga la imagen de banner
        const bannerStyles ={
            backgroundImage: "url(" + banner_image_url + ")",
            backgroundSize: "cover",
            backgroundRepeat: "non-repeat",
            backgroundPosition: "center center"
        };

        //Voy a crear otro estilo en línea para reducir un poco el tamaño del logo
        const logoStyles = {
            width: "200px",

        }
        return(
            <div className="portfolio-detail-wrapper">
                <div className="banner" style={bannerStyles}>
                    <img src={logo_url} style={logoStyles}></img>
                </div>
                <div className="portfolio-detail-description-wrapper">
                    <div className="description">{description}</div>
                </div>
                <div className="bottom-content-wrapper">
                    {/*Cuando abre el link va a una pestaña nueva*/}
                    <a href={url} className="site_link" target="_blank"> Visit {name}</a>
                </div>
            </div>
        )
    }
    
}