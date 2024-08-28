import React from "react";
import contactPicture from "../../../static/assets/images/contact/contact.jpg"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function(){
    return (
        <div className="content-page-wrapper">
            <div 
                className="left-column"
                style={{
                    background: "url(" + contactPicture + ") no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}
            >
            </div>
            <div className="right-column">
                <div className="contact-bullet-points">
                    <div className="bullet-point-group">
                        <div className="icon">
                            <FontAwesomeIcon icon="fa-solid fa-phone-flip"/>
                        </div>
                        <div className="text">
                            555-555-5555
                        </div>
                    </div>
                    <div className="bullet-point-group">
                        <div className="icon">
                            <FontAwesomeIcon icon="fa-solid fa-envelope" />
                        </div>
                        <div className="text">
                            ainhoa@ainhoa.com
                        </div>
                    </div>
                    <div className="bullet-point-group">
                        <div className="icon">
                            <FontAwesomeIcon icon="fa-solid fa-map-location-dot" />
                        </div>
                        <div className="text">
                            C/ Aqui se vive bien 5
                        </div>
                    </div>
                </div>
            </div> 
        </div>
    );
}
