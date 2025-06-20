import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import './css/AdminPage.css';
import { FaSearch,FaPlus, FaUserCircle, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function AdminPage() {
    const { user, token ,logout} = useAuth();
    const navigate = useNavigate()
    const [users, setUsers] = useState([]);
    // const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 8;

    console.log("token in AdminPage: ",token)

    const toastConfig = {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark"
      };
      const successStyle = { backgroundColor: 'green', color: '#fff' };
    const errorStyle   = { backgroundColor: 'red',   color: '#fff' };

    const handleLogout = () => {
        logout();
        navigate('/admin-login');
      };
    useEffect(() => {
        console.log("hello")
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`/api/users?search=${searchTerm}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("response.data in AdminPage: ",response.data)
                setUsers(response.data);
                // setFilteredUsers(response.data);
                // if(searchTerm === ''){
                //     toast.success('Users fetched successfully!', {...toastConfig,style:successStyle});
                // }
            } catch (error) {
                console.error('Failed to fetch users:', error);
                toast.error(error.message || 'Failed to fetch users', {...toastConfig,style:errorStyle});
            }
        };
        const handler = setTimeout(() => {
            if (token) {
                fetchUsers();
            }
        }, 300);
        return ()=>{
            clearTimeout(handler)
        }
        // if (token) {
        //     console.log("hii")
        //     fetchUsers();
        // }
    }, [searchTerm,token]);

    // useEffect(() => {
    //     const results = users.filter(u =>
    //         u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         u.email.toLowerCase().includes(searchTerm.toLowerCase())
    //     );
    //     // setFilteredUsers(results);
    //     setCurrentPage(1); // Reset to first page on new search
    // }, [searchTerm, users]);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });
        if (result.isConfirmed) {
            try {
                await axios.delete(`/api/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                    setUsers(users.filter(u => u._id !== id));
                    toast.success('User deleted successfully!', { ...toastConfig, style: successStyle });
                } catch (error) {
                    console.error('Failed to delete user:', error);
                    toast.error(error.response?.data?.message || 'Failed to delete user', { ...toastConfig, style: errorStyle });
                }
            }
    
    };

    const handleCreate =async()=>{
      const {value:formValues} = await Swal.fire({
        title:'Create New User',
        html:
            '<input id="swal-input1" class="swal2-input" placeholder="Name">'
            + '<input id="swal-input2" class="swal2-input" placeholder="Email">'
            + '<input id="swal-input3" class="swal2-input" placeholder="Password" type="password">'
            + '<input id="swal-input4" class="swal2-input" placeholder="Confirm Password" type="password">',
            focusConfirm:false,
            showCancelButton: true,
            preConfirm:()=>{
                    const name = document.getElementById('swal-input1').value;
                    const email = document.getElementById('swal-input2').value;
                    const password = document.getElementById('swal-input3').value;
                    const confirmPassword = document.getElementById('swal-input4').value;

                    if(!name || !email || !password || !confirmPassword){
                        Swal.showValidationMessage('All fields are required.', 'error');
                        return false;
                    }
                    if(password !== confirmPassword){
                        Swal.showValidationMessage('Passwords do not match.', 'error');
                        return false;
                    }
                    return [name,email,password]
            }
      });

      if(formValues){
        const [name,email,password] = formValues;
        console.log("name in AdminPage: ",name)
        console.log("email in AdminPage: ",email)
        console.log("password in AdminPage: ",password)
        try {
            const {data:newUser} = await axios.post('/api/users',
                {name,email,password},
                {
                    headers:{Authorization:`Bearer ${token}`}
                }
            )
            setUsers([...users,newUser])
            toast.success('User created successfully!', {...toastConfig,style:successStyle})
        } catch (error) {
            console.log('Failed to create user:',error)
            toast.error(error.message || 'Failed to create user', {...toastConfig,style:errorStyle})
        }
      }
    }

    const handleEdit =async(user)=>{
        const { value: formValues } = await Swal.fire({
            title: 'Edit User',
            html:
                `<input id="swal-input1" class="swal2-input" placeholder="Name" value="${user.name}">` +
                `<input id="swal-input2" class="swal2-input" placeholder="Email" value="${user.email}">`,
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {
                return [
                    document.getElementById('swal-input1').value,
                    document.getElementById('swal-input2').value
                ]
            }
        });
    
        if (formValues) {
            const [name, email] = formValues;
            try {
                const { data: updatedUser } = await axios.put(
                    `/api/users/${user._id}`,
                    { name, email },
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                setUsers(users.map(u => (u._id === user._id ? updatedUser : u)));
                toast.success('User updated successfully!', { ...toastConfig, style: successStyle });
            } catch (error) {
                console.log('Failed to update user:', error);
                toast.error(error.response?.data?.message || 'Failed to update user', { ...toastConfig, style: errorStyle });
            }
        }
    }


    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(users.length / usersPerPage);
    // console.log("usersPerPage in AdminPage: ",usersPerPage)
    // console.log("currentPage in AdminPage: ",currentPage)
    // console.log("indexOfFirstUser in AdminPage: ",indexOfFirstUser)
    // console.log("indexOfLastUser in AdminPage: ",indexOfLastUser)
    console.log("currentUsers in AdminPage: ",currentUsers)
    // console.log("totalPages in AdminPage: ",totalPages)
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="admin-page">
            <header className="admin-header">
            {/* <div className="header-left"> */}
                <h1>Users</h1>
            {/* </div> */}
                <button onClick={handleCreate} className="create-user-btn">
                    <FaPlus /> Create User</button>
                <div className="search-container">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search Users"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <FaTimes 
                            className="clear-icon" 
                            onClick={() => setSearchTerm('')} 
                        />
                    )}
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
                <div className="admin-profile">
                    <div className="admin-info">
                        <span className="admin-name">{user?.name}</span>
                        <span className="admin-role">Admin</span>
                    </div>
                    {user?.profileImage ? (
                        <img src={user.profileImage} alt="Admin" className="admin-avatar" />
                    ) : (
                        <FaUserCircle size={40} className="admin-avatar-default" />
                    )}
                </div>
            </header>

            <main className="customer-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>SI No.</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map((user, index) => (
                            <tr key={user._id}>
                                <td>{indexOfFirstUser + index + 1}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                  <div className="action-buttons">
                                    <button onClick={() => handleEdit(user)} className="action-btn edit-btn">
                                        <FaEdit />
                                    </button>
                                    <button onClick={() => handleDelete(user._id)} className="action-btn delete-btn">
                                        <FaTrash />
                                    </button>
                                 </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>

            <footer className="pagination-footer">
                <span className="pagination-info">
                    Showing {Math.min(indexOfFirstUser + 1, users.length)} - {Math.min(indexOfLastUser, users.length)} of {users.length} customers
                </span>
                <div className="pagination-controls">
                    {currentPage > 1 && (
                        <button onClick={() => paginate(currentPage - 1)} className="page-btn prev-btn">
                            &laquo; Prev
                        </button>
                    )}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                        <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`page-btn ${currentPage === number ? 'active' : ''}`}
                        >
                            {number}
                        </button>
                    ))}
                     {currentPage < totalPages && (
                        <button onClick={() => paginate(currentPage + 1)} className="page-btn next-btn">
                            Next &raquo;
                        </button>
                    )}
                </div>
            </footer>
        </div>
    );
}

export default AdminPage;