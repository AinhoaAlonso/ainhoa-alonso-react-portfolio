//Componente de BlogItem dedicado

import React, {Component} from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const BlogItem = props =>{
    //Hacemos una deconstruccion y asignamos variables a cada elemento de la extracción
    const {
        id, 
        blog_status,
        content,
        title,
        feature_image_url
     } = props.blogItem;

     return (
        <div>
            {/* Estamos creando un enlace en el titulo de cada elemento de nuestro blog y lo está redireccionando al blog-detail */}
            <Link to={`/b/${id}`}>
                <h1>{title}</h1>
            </Link>
            <div>
                {content}
            </div>
        </div>
     )
}

export default BlogItem;

