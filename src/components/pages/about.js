import React from "react";
import aboutImage from "../../../static/assets/images/about/about.jpg"

export default function(){
    return (
        <div className="content-page-wrapper">
            {/*Damos algunos estilos en linea */}
            <div 
                className = "left-column"
                style={{
                    background: "url(" + aboutImage + ") no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}
            >
            </div>
            <div className= "right-column">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil, asperiores modi. Eum ullam rem incidunt fugiat esse. Mollitia, at repudiandae. Hic cumque reprehenderit nulla iusto pariatur eveniet voluptatibus, voluptatem quisquam voluptatum minima, doloremque repellat omnis esse eligendi culpa sequi harum repellendus! Harum ab, id at, laboriosam consectetur saepe nobis quo debitis veritatis magnam, ad sunt possimus cum. Quod in natus vero neque molestiae aliquid? Officiis blanditiis doloremque unde, deserunt sed temporibus deleniti provident quis id qui accusamus eligendi, ab soluta ex sunt ut possimus laudantium assumenda nisi quidem reprehenderit. Nihil culpa aliquam esse quas consequatur eos voluptatibus aut ab eligendi? Officia cum sed nesciunt quos temporibus. Molestias ipsam enim eligendi sequi commodi! Quos soluta aperiam, alias libero odit explicabo eveniet velit illo eius rerum nobis iure, non aut sapiente pariatur, repellendus facere fugit delectus.
            </div>
        </div>
    );
}
