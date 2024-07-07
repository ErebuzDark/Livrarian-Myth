import React, { useState } from "react";
import Home from './Home';

const Content = ( {activeTab, isLoggedin} ) => {

    return (
        <div style={{display: "flex", width: "100vw"}}>
            {activeTab === "Home" && isLoggedin === true && <Home />}
            {activeTab === "About" && <h2>ABOUT</h2>}
            {activeTab === "Contact" && <h2>CONTACTS</h2>}
        </div>
    )   
}

export default Content;