import React from "react";

function Footer() {
    return (
        <div>
            <footer className="w-full bg-zinc-700	 text-white py-4">
                <span
                    className="text-center block">BundesligaPolska | Wszelkie prawa zastrzeżone &copy; {new Date().getFullYear()}</span>
            </footer>
        </div>
    )
}

export default Footer;