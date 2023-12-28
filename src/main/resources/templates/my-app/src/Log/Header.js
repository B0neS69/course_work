import React, {useState} from 'react';
import './Header.css';
import logo from "../Logo-v1.0.png";

const Header = ({ username, hasInsurance, handleToggleSidebar, handleLogout }) => {
    const [showDetails, setShowDetails] = useState(false);

    const toggleDetails = () => {
        setShowDetails(!showDetails);
    };
console.log(username)
    return (
        <div className="header-container">
            <div className="toggle-button">
                <button className="sidebar-toggle-button" onClick={handleToggleSidebar}>☰</button>
            </div>
            <div className="w">
            </div>
            <div className="user-info" onClick={toggleDetails}>
                <p>{`Вітаємо, ${username}!`}</p>
                {showDetails && (
                    <div className="user-info-add">
                        <p>{`Наявність страховки:`}
                        {`${hasInsurance ? 'Так' : 'Ні'}`}
                        </p>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                )}

            </div>
            <div className="header-container-logo">
                <img src={logo} alt="" />
            </div>
        </div>
    );
};

export default Header;


