//Componente funcional para decir que si la imagen del blog no existe que directamente sea null y no muestras nada y si existe que traiga la imagen que la va a coger desde blog-details.js
import React from "react";

 const BlogFeaturedImage = props => {
    if(!props.img){
        return null;
    }
    return (
        <div className="featured-image-wrapper">
            <img src={props.img} />
        </div>
    )
}
export default BlogFeaturedImage;