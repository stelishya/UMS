import React, { useState,useEffect,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import { updateProfile } from '../features/auth/authSlice';
import { uploadProfileImage } from '../features/auth/authAPI';

// import { useAuth } from '../context/AuthContext';
import {IoArrowBack} from 'react-icons/io5';
import './css/ProfilePage.css';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import defaultProfile from '../assets/images/default_profile.webp';


function ProfilePage() {
  // const { user,updateProfile } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { user, loading } = useSelector((state) => state.auth);

//   const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState('./default_profile.webp');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    profileImage:profileImage
  });
  const fileInputRef = useRef(null);

  useEffect(()=>{
    if (user?.profileImage) {
      if(user.profileImage.startsWith('/uploads')){
        setProfileImage('http://localhost:4006'+user.profileImage);
      }else{
        setProfileImage(user.profileImage);
      }
    }
  },[user?.profileImage])

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

        const userData = {
            name: formData.name,
            email: formData.email,
            profileImage: profileImage
          };

          console.log("userData in ProfilePage: ",userData)
        if (fileInputRef.current && fileInputRef.current.files[0]) {
            const imageFormData = new FormData();
            imageFormData.append('profileImage', fileInputRef.current.files[0]);
            console.log("imageFormData in ProfilePage: ",imageFormData)
            
            const imageResult = await uploadProfileImage(imageFormData);
            console.log("imageResult in ProfilePage: ",imageResult)
            userData.profileImage = imageResult.profileImage; 
        }
          //   const imageResponse = await fetch('http://localhost:4006/api/users/upload', {
          //     method: 'POST',
          //     headers: {
          //       'Authorization': `Bearer ${localStorage.getItem('token')}`
          //     },
          //     body: formData
          //   });
          //   console.log("imageResponse in ProfilePage: ",imageResponse)
          //   if (!imageResponse.ok) {
          //     throw new Error('Failed to upload image');
          //   }
      
          //   const imageResult = await imageResponse.json();
          //   console.log("imageResult in ProfilePage: ",imageResult)
          //   // setProfileImage(imageResult.profileImage);
          //   setProfileImage('http://localhost:4006'+imageResult.profileImage);
          //   userData.profileImage = imageResult.profileImage;

          // }else{
          //   userData.profileImage=profileImage;
          // }

      dispatch(updateProfile(userData))
      .unwrap() 
      .then(()=>{
        setIsModalOpen(false);
        toast.success('Profile updated successfully!', {...toastConfig,style:successStyle});
            })
      .catch((error)=>{
        console.log("error in ProfilePage.jsx : ",error)
        toast.error(error || 'Failed to update profile - dispatch', {...toastConfig,style:errorStyle});
        setFormData(curr=>({
          ...curr,
          email:user.email,
        }))
      })
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile', {...toastConfig,style:errorStyle});
    }
  };

  const openModal = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    });
    setIsModalOpen(true);
  };
//   const handleImageClick = () => {
//     if (isEditing) {
//       fileInputRef.current.click();
//     }
//   };

//   const toggleEdit = () => {
//     setIsEditing(!isEditing);
//   };

  return(
    <div className='profile-container'>
      <button onClick={() => navigate('/')} className="back-button">
          <IoArrowBack size={24} />
      </button>
        <div className="profile-card">
            <div className="profile-header">
            <div className='profile-image-container'>
            <img 
              src={profileImage} 
              alt="Profile" 
              className="profile-image"
            />
            {/* {isEditing && (
              <div className="image-upload-overlay">
                <span>Change Photo</span>
              </div>
            )} */}
            {/* <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              style={{ display: 'none' }}
            /> */}
            </div>
                <h2>Profile</h2>
                <p>Name: {user?.name}</p>
                <p>Email: {user?.email}</p>
                <button 
                    className="edit-button"
                    onClick={openModal}
                >
                  Edit Profile
                </button>
            </div>
        </div>

        {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Edit Profile</h3>
              <button 
                className="close-button"
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label>Profile Image</label>
                <div 
                  className="image-upload-container"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="profile-image-preview"
                  />
                  <div className="image-upload-overlay">
                    <span>Change Photo</span>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              {/* <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div> */}
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="save-button"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
export default ProfilePage