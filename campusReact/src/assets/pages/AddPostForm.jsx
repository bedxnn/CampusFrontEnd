import React, { useState, useEffect } from 'react';
import api from '../../Apis';

function AddPostForm({ showForm, setShowForm, onPostCreated }) {
  const [idNumber, setIdNumber] = useState("");
  const [studentName, setStudentName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Timer to clear success message
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setShowForm(false); // Close form after showing success
      }, 2000); // Show for 2 seconds
      return () => clearTimeout(timer);
    }
  }, [successMessage, setShowForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await api.post("/api/items/create", {
        idNumber: idNumber,
        studentName: studentName
      });

      // Show success message
      setSuccessMessage("Successfully added!");
      setIdNumber("");
      setStudentName("");
      
      // Refresh posts list
      if (onPostCreated) {
        onPostCreated();
      }
      
      console.log("Success:", res.data);

    } catch (error) {
      console.log("error creating", error);
      
      const backendError = error.response?.data?.message || 
                           error.response?.data?.error ||
                           error.response?.data ||
                           error.message ||
                           "Failed to create post";
      
      setErrorMessage(backendError);
    }
  }

  return (
    <>
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <form 
            onSubmit={handleSubmit} 
            className='home-form'
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Show SUCCESS message */}
            {successMessage && (
              <div className='success-message'>
                {successMessage}
              </div>
            )}

            {/* Show ERROR message */}
            {errorMessage && (
              <div className='error-message'>
                {errorMessage}
              </div>
            )}

            <div className='id-Number'>
              <input
                type='text'
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder='Student Id'
                className='student-id'
                required
              />
            </div>

            <div className='student-name'>
              <input 
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder='Student name'
                required
              />
            </div>
            
            <div className='form-buttons'>
              <button type="submit" className="signup-btn">Post</button>
              <button 
                type="button" 
                onClick={() => {
                  setShowForm(false);
                  setErrorMessage("");
                  setIdNumber("");
                  setStudentName("");
                }} 
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      )}
    </>
  )
}

export default AddPostForm;