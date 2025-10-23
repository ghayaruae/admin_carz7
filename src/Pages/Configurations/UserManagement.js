import React, { useContext, useEffect, useState } from 'react';
import PageTitle from "../../Components/PageTitle";
import { TextBox, SubmitBtn, SelectBox } from "../../Components/InputElements";
import { ConfigContext } from '../../Context/ConfigContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import withRouter from '../../Utils/withRouter';
import Select from 'react-select';

const UserManagement = () => {
    const { token, apiURL } = useContext(ConfigContext);

    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        user_name: '',
        user_role: '',
        login_id: '',
        login_password: '',
        confirm_password: '',
        privilege_id: '0',
        user_status: '1',
        created_by: '1' // Set this to logged-in user's ID
    });
    const [editMode, setEditMode] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [status, setStatus] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = () => {
        const headers = {
            'token': `${token}`,
            'Content-Type': 'application/json',
        };

        axios.get(`${apiURL}User/AllUsers`, { headers })
            .then((response) => {
                if (response.data.success) {
                    setUsers(response.data.data);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error loading users:', error);
                setLoading(false);
            });
    };

    const loadUserInfo = (userId) => {
        const headers = {
            'token': `${token}`,
            'Content-Type': 'application/json',
        };

        axios.get(`${apiURL}User/UserInfo`, { 
            headers,
            params: { user_id: userId }
        })
        .then((response) => {
            if (response.data.success && response.data.data.length > 0) {
                // Get the first user from the data array
                const userData = response.data.data[0];
                setFormData({
                    user_name: userData.user_name || '',
                    user_role: userData.user_role?.toLowerCase() || '', // Convert to lowercase to match options
                    login_id: userData.login_id || '',
                    privilege_id: userData.privilege_id?.toString() || '0',
                    user_status: userData.user_status?.toString() || '1',
                    created_by: userData.created_by?.toString() || '1'
                });
                setSelectedUserId(userData.user_id);
                setEditMode(true);
            } else {
                Swal.fire({
                    title: '<strong>Error</strong>',
                    html: 'User data not found',
                    icon: 'error'
                });
            }
        })
        .catch((error) => {
            console.error('Error loading user info:', error);
            Swal.fire({
                title: '<strong>Error</strong>',
                html: error.message,
                icon: 'error'
            });
        });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validatePasswords = () => {
        if (!editMode && formData.login_password !== formData.confirm_password) {
            Swal.fire({
                title: '<strong>Error</strong>',
                html: 'Passwords do not match!',
                icon: 'error'
            });
            return false;
        }
        return true;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Validate all required fields for new user
        if (!editMode) {
            if (!formData.user_name.trim()) {
                Swal.fire({
                    title: 'Validation Error',
                    html: 'User Name is required',
                    icon: 'error'
                });
                return;
            }
            if (!formData.login_id.trim()) {
                Swal.fire({
                    title: 'Validation Error',
                    html: 'Login ID is required',
                    icon: 'error'
                });
                return;
            }
            if (!formData.login_password) {
                Swal.fire({
                    title: 'Validation Error',
                    html: 'Password is required',
                    icon: 'error'
                });
                return;
            }
            if (!formData.confirm_password) {
                Swal.fire({
                    title: 'Validation Error',
                    html: 'Confirm Password is required',
                    icon: 'error'
                });
                return;
            }
            if (!formData.user_role) {
                Swal.fire({
                    title: 'Validation Error',
                    html: 'User Role is required',
                    icon: 'error'
                });
                return;
            }
            if (!formData.user_status) {
                Swal.fire({
                    title: 'Validation Error',
                    html: 'Status is required',
                    icon: 'error'
                });
                return;
            }
        }

        // Password validation
        if (!editMode && formData.login_password !== formData.confirm_password) {
            Swal.fire({
                title: 'Validation Error',
                html: 'Passwords do not match!',
                icon: 'error'
            });
            return;
        }

        // Rest of the submit logic
        const headers = { 
            'token': `${token}`, 
            'Content-Type': 'application/json' 
        };
        setStatus(true);

        const endpoint = editMode ? 
            `${apiURL}User/UpdateUser` : 
            `${apiURL}User/CreateUser`;

        const submitData = editMode ? 
            { ...formData, user_id: selectedUserId } : 
            formData;

        axios.post(endpoint, submitData, { headers })
            .then((response) => {
                setStatus(false);
                if (response.data.success) {
                    Swal.fire({
                        title: '<strong>Success</strong>',
                        html: response.data.message,
                        icon: 'success'
                    });
                    resetForm();
                    loadUsers();
                } else {
                    Swal.fire({
                        title: '<strong>Error</strong>',
                        html: response.data.message,
                        icon: 'error'
                    });
                }
            })
            .catch((error) => {
                setStatus(false);
                Swal.fire({
                    title: '<strong>Error</strong>',
                    html: error.message,
                    icon: 'error'
                });
            });
    };

    const handleStatusChange = (userId, currentStatus) => {
        // Convert the new status to the opposite of current status
        const newStatus = currentStatus === 1 ? 0 : 1;
        
        const headers = { 
            'token': `${token}`, 
            'Content-Type': 'application/json' 
        };

        // Show confirmation dialog before changing status
        Swal.fire({
            title: 'Are you sure?',
            html: `Do you want to ${currentStatus === 1 ? 'deactivate' : 'activate'} this user?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, proceed!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(`${apiURL}User/ActiveDeActive`, {
                    user_id: userId,
                    user_status: newStatus
                }, { headers })
                .then((response) => {
                    if (response.data.success) {
                        Swal.fire({
                            title: 'Success',
                            html: response.data.message,
                            icon: 'success'
                        }).then(() => {
                            // Update the users list immediately
                            setUsers(prevUsers => 
                                prevUsers.map(user => 
                                    user.user_id === userId 
                                        ? { ...user, user_status: newStatus }
                                        : user
                                )
                            );
                            // Also reload from server to ensure data consistency
                            loadUsers();
                        });
                    } else {
                        Swal.fire({
                            title: 'Error',
                            html: response.data.message,
                            icon: 'error'
                        });
                    }
                })
                .catch((error) => {
                    Swal.fire({
                        title: 'Error',
                        html: error.message,
                        icon: 'error'
                    });
                });
            }
        });
    };

    const handleEdit = (userId) => {
        loadUserInfo(userId);
    };

    const resetForm = () => {
        setFormData({
            user_name: '',
            user_role: '',
            login_id: '',
            login_password: '',
            confirm_password: '',
            privilege_id: '0',
            user_status: '1',
            created_by: '1'
        });
        setEditMode(false);
        setSelectedUserId(null);
        setStatus(false);
    };

    const roleOptions = [
        { value: 'admin', label: 'Admin' },
        { value: 'user', label: 'User' }
    ];

    const statusOptions = [
        { value: '1', label: 'Active' },
        { value: '0', label: 'Inactive' }
    ];

    const handleSelectChange = (selectedOption, { name }) => {
        setFormData(prev => ({
            ...prev,
            [name]: selectedOption.value
        }));
    };

    return (
        <div className="main-content">
            <div className="page-content">
                <div className="container-fluid">
                    <br />
                    <PageTitle title={`User Management`} primary={`Home`} />
                    <div className="row">
                        <div className="col-lg-5">
                            <div className="card">
                                <div className="card-header align-items-center d-flex">
                                    <h4 className="card-title mb-0 flex-grow-1">
                                        {editMode ? 'Edit User' : 'Create User'}
                                    </h4>
                                    <div className="flex-shrink-0">
                                        <button 
                                            type="button" 
                                            className="btn btn-sm btn-success"
                                            onClick={resetForm}
                                        >
                                            <i className="mdi mdi-plus me-1"></i>New
                                        </button>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        <fieldset disabled={loading ? "disabled" : ""}>
                                            <div className="row gy-4">
                                                <div className="col-md-12">
                                                    <TextBox 
                                                        type='text' 
                                                        id='user_name' 
                                                        name='user_name' 
                                                        label='User Name *' 
                                                        value={formData.user_name} 
                                                        change={handleInputChange} 
                                                        required={true}
                                                    />
                                                </div>
                                                <div className="col-md-12">
                                                    <TextBox 
                                                        type='text' 
                                                        id='login_id' 
                                                        name='login_id' 
                                                        label='Login ID *' 
                                                        value={formData.login_id} 
                                                        change={handleInputChange} 
                                                        required={true}
                                                    />
                                                </div>
                                                <div className="col-md-12">
                                                    <TextBox 
                                                        type='password' 
                                                        id='login_password' 
                                                        name='login_password' 
                                                        label={`Password ${editMode ? '(Leave blank to keep unchanged)' : '*'}`}
                                                        value={formData.login_password} 
                                                        change={handleInputChange} 
                                                        required={!editMode}
                                                    />
                                                </div>
                                                <div className="col-md-12">
                                                    <TextBox 
                                                        type='password' 
                                                        id='confirm_password' 
                                                        name='confirm_password' 
                                                        label={`Confirm Password ${editMode ? '(Leave blank to keep unchanged)' : '*'}`}
                                                        value={formData.confirm_password} 
                                                        change={handleInputChange} 
                                                        required={!editMode}
                                                    />
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <label className="form-label">User Role *</label>
                                                        <Select
                                                            name="user_role"
                                                            value={roleOptions.find(option => option.value === formData.user_role) || null}
                                                            onChange={(option) => handleSelectChange(option, { name: 'user_role' })}
                                                            options={roleOptions}
                                                            className="basic-select"
                                                            classNamePrefix="select"
                                                            isClearable={false}
                                                            isSearchable={true}
                                                            placeholder="Select Role"
                                                            required={true}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <label className="form-label">Status *</label>
                                                        <Select
                                                            name="user_status"
                                                            value={statusOptions.find(option => option.value === formData.user_status) || null}
                                                            onChange={(option) => handleSelectChange(option, { name: 'user_status' })}
                                                            options={statusOptions}
                                                            className="basic-select"
                                                            classNamePrefix="select"
                                                            isClearable={false}
                                                            isSearchable={true}
                                                            placeholder="Select Status"
                                                            required={true}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="d-flex gap-2">
                                                        <SubmitBtn 
                                                            icon={`mdi mdi-spin mdi-cog-outline fs-18`} 
                                                            text={editMode ? 'Update User' : 'Create User'} 
                                                            type={`primary`} 
                                                            status={status} 
                                                        />
                                                        {editMode && (
                                                            <button 
                                                                type="button" 
                                                                className="btn btn-secondary" 
                                                                onClick={resetForm}
                                                            >
                                                                Cancel
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-7">
                            <div className="card">
                                <div className="card-header align-items-center d-flex">
                                    <h4 className="card-title mb-0 flex-grow-1">Users List</h4>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-striped">
                                            <thead>
                                                <tr>
                                                    <th>User Name</th>
                                                    <th>Login ID</th>
                                                    <th>Role</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users.map((user) => (
                                                    <tr key={user.user_id}>
                                                        <td>{user.user_name}</td>
                                                        <td>{user.login_id}</td>
                                                        <td>{user.user_role}</td>
                                                        <td>
                                                            <span className={`badge ${Number(user.user_status) === 1 ? 'bg-success' : 'bg-danger'}`}>
                                                                {Number(user.user_status) === 1 ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex gap-2">
                                                                <button 
                                                                    className="btn btn-sm btn-primary"
                                                                    onClick={() => handleEdit(user.user_id)}
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button 
                                                                    className={`btn btn-sm ${Number(user.user_status) === 1 ? 'btn-danger' : 'btn-success'}`}
                                                                    onClick={() => handleStatusChange(user.user_id, Number(user.user_status))}
                                                                >
                                                                    {Number(user.user_status) === 1 ? 'Deactivate' : 'Activate'}
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withRouter(UserManagement);
