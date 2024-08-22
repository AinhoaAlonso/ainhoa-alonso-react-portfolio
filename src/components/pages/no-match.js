import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";

export default function(){
    return (
        <div>
            <h2>No pudimos encontrar la página</h2>
            <Link to = "/">Return to Home</Link>
        </div>
    );
}
