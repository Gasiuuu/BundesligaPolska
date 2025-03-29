import React from 'react';
import "./AdminPanel.css"
import {Link} from "react-router-dom";

function AdminPanel() {
    return (
        <div className="panel-container">
            <Link to="/dodaj-artykul">
                <div className="panel-option">
                    Dodaj artykuł
                </div>
            </Link>
            <Link to="/zarzadzanie-artykulami">
                <div className="panel-option">
                    Zarządzaj artykułami
                </div>
            </Link>
            <Link to="/zarzadzanie-uzytkownikami">
                <div className="panel-option">
                    Zarządzaj użytkownikami
                </div>
            </Link>
        </div>
    )
}
export default AdminPanel;