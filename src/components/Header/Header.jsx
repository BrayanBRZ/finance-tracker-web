import React from "react";
import "./Header.css";

const Header = ({title}) =>{


return(
    <div className="header">
        <h1>{title ? title :'ToDoList'}</h1>
    </div>
);

}
export default Header;