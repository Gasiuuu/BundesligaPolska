import React, {useState, useEffect} from 'react'
import UserService from "../../service/UserService.js";
import {Link} from "react-router-dom";
import {MdEdit} from "react-icons/md";
import {TiDelete} from "react-icons/ti";

function UserManagement() {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, [])

    const fetchUsers = async () => {
        try {
            const usersList = await UserService.getAllUsers();
            console.log(usersList);
            setUsers(usersList.userEntityList);

        } catch(error) {
            console.error("Error fetching users: ", error);
        }
    }

    const handleDelete = async (userId) => {
        try{
            await UserService.deleteUser(userId)
            alert("Pomyślnie usunięto użytkownika")
            window.reload()
        } catch (error) {
            console.error('Błąd usuwania użytkownika: ', error);
            alert("Nie udało sie usunąć użytkownika")
        }
    }

    return (
        <div className="panel-container">
            {users.map((user) => (
                <div className="news-panel-option" key={user.id}>
                    <div className="news-object">
                        <p><span>Id: </span>{user.id}</p>
                        <p><span>Imię: </span>{user.firstName}</p>
                        <p><span>Nazwisko: </span>{user.lastName}</p>
                        <p><span>Miasto: </span>{user.city}</p>
                        <p><span>Rola: </span>{user.role}</p>
                    </div>

                    <div className="news-options">
                        <Link to={`/edytuj-uzytkownika/${user.id}`}>
                            <button className="edit-btn">
                                <MdEdit/> Edytuj
                            </button>
                        </Link>
                        <button className="delete-btn" onClick={() => handleDelete(user.id)}>
                            <TiDelete/> Usuń
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default UserManagement;