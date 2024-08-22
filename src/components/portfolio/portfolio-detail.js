import React from "react";

export default function(props){
    return(
        <div>
            {/* Al poner esas llaves y un argumento props lo que nos hace es darnos acceso a los datos y nos permite saber en que URL estamos, vamos que ahora nos coge directamente el nombre que ponemos en el slug que hemos codificado en app.js.
            Aquí es donde tenemos acceso mediante props al objeto match, al objeto params y al slug*/}
            <h2>Portfolio Detail para {props.match.params.slug}</h2>
        </div>
    )
}