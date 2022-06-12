import  React, {useEffect} from 'react';
import RemoveUser from './RemoveUser'
import './Table.css'
import {Table} from 'reactstrap';
import { Link } from "react-router-dom";


const UserTable = ({currentShift, userlist, setProxySelect, name, session_data, session}) => {

    const UsersToRender = () => {
        let i = 0;
        return userlist.map(user => (
            <tr key={i++}>
                <td className='userText'><Link to={"/personnel/user/" + user.user.userID}>
            {user.user.firstName+" "+user.user.lastName}
          </Link></td>
                {(session_data.username === user.user.username || session_data.user_type === "SYSTEM_ADMIN" || session_data.user_type === "HILL_ADMIN")?
                    <td><RemoveUser currentShift={currentShift}
                    setProxySelect={setProxySelect}
                    user={user}
                    username={session_data.username}
                    session={session}
                    session_data = {session.session_data()}/></td>
                    :
                    <></>
                }
            </tr>
        ))
    }
    //will update calendar if the Add Roster Modal changes
    useEffect(() => {

    }, [userlist, currentShift]);


    return (
        <>
            <div className='tableFixHeader'>
                <Table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {UsersToRender()}
                    </tbody>
                </Table>
            </div>
        </>
    )
}

export default UserTable
