import React, {
  useEffect,
  useState,
} from "react";

import "./AllUsers.css";


const API_URL =
  "http://localhost:5000/api/auth";


const AllUsers = () => {

  const [users, setUsers] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedUser, setSelectedUser] =
    useState(null);

  const [newPassword, setNewPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");


  // ==========================================
  // GET TOKEN
  // ==========================================

  const getToken = () => {

    const token =
      localStorage.getItem(
        "careerAI_token"
      );


    if (!token) {

      throw new Error(
        "Authentication token not found. Please login again."
      );

    }


    return token;
  };


  // ==========================================
  // GET ALL USERS
  // ==========================================

  const fetchUsers = async () => {

    try {

      setLoading(true);

      setError("");

      setMessage("");


      const token = getToken();


      const response =
        await fetch(
          `${API_URL}/admin/users`,
          {
            method: "GET",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        if (response.status === 401) {

          throw new Error(
            "Invalid or expired token. Please logout and login again."
          );

        }


        if (response.status === 403) {

          throw new Error(
            "Admin access only."
          );

        }


        throw new Error(
          data.message ||
          "Unable to fetch users"
        );

      }


      setUsers(
        data.users || []
      );


    } catch (err) {

      console.error(
        "FETCH USERS ERROR:",
        err
      );

      setError(
        err.message
      );


    } finally {

      setLoading(false);

    }
  };


  // ==========================================
  // LOAD USERS
  // ==========================================

  useEffect(() => {

    fetchUsers();

  }, []);


  // ==========================================
  // CHANGE USER ROLE
  // ==========================================

  const changeRole = async (
    userId,
    currentRole
  ) => {

    const newRole =
      currentRole === "admin"
        ? "user"
        : "admin";


    const confirmChange =
      window.confirm(
        `Are you sure you want to change this user role to ${newRole}?`
      );


    if (!confirmChange) {

      return;

    }


    try {

      setMessage("");

      setError("");


      const token =
        getToken();


      const response =
        await fetch(
          `${API_URL}/admin/users/${userId}/role`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              role: newRole,
            }),
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Unable to update role"
        );

      }


      setMessage(
        data.message
      );


      await fetchUsers();


    } catch (err) {

      console.error(
        "CHANGE ROLE ERROR:",
        err
      );

      setError(
        err.message
      );

    }
  };


  // ==========================================
  // CHANGE PASSWORD
  // ==========================================

  const changePassword =
    async () => {

      if (!selectedUser) {

        return;

      }


      if (!newPassword) {

        setError(
          "Please enter new password."
        );

        return;

      }


      if (
        newPassword.length < 6
      ) {

        setError(
          "Password must be at least 6 characters."
        );

        return;

      }


      try {

        setMessage("");

        setError("");


        const token =
          getToken();


        const response =
          await fetch(
            `${API_URL}/admin/users/${selectedUser._id}/password`,
            {
              method: "PATCH",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                newPassword,
              }),
            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Unable to change password"
          );

        }


        setMessage(
          data.message
        );


        setNewPassword("");

        setSelectedUser(null);


      } catch (err) {

        console.error(
          "CHANGE PASSWORD ERROR:",
          err
        );

        setError(
          err.message
        );

      }
    };


  // ==========================================
  // DELETE USER
  // ==========================================

  const deleteUser =
    async (
      userId,
      name
    ) => {

      const confirmDelete =
        window.confirm(
          `Are you sure you want to delete ${name}?`
        );


      if (!confirmDelete) {

        return;

      }


      try {

        setMessage("");

        setError("");


        const token =
          getToken();


        const response =
          await fetch(
            `${API_URL}/admin/users/${userId}`,
            {
              method: "DELETE",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Unable to delete user"
          );

        }


        setMessage(
          data.message
        );


        await fetchUsers();


      } catch (err) {

        console.error(
          "DELETE USER ERROR:",
          err
        );

        setError(
          err.message
        );

      }
    };


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="all-users-page">


      {/* ======================================
          HEADER
      ====================================== */}

      <div className="all-users-header">

        <div>

          <h1>
            All Users
          </h1>

          <p>
            Manage Career AI users and permissions
          </p>

        </div>


        <div className="user-count">

          Total Users:{" "}

          <strong>
            {users.length}
          </strong>

        </div>

      </div>


      {/* ======================================
          SUCCESS MESSAGE
      ====================================== */}

      {message && (

        <div className="success-message">

          {message}

        </div>

      )}


      {/* ======================================
          ERROR MESSAGE
      ====================================== */}

      {error && (

        <div className="error-message">

          {error}

        </div>

      )}


      {/* ======================================
          LOADING
      ====================================== */}

      {loading ? (

        <div className="loading">

          Loading users...

        </div>


      ) : users.length === 0 ? (

        <div className="empty">

          No users found.

        </div>


      ) : (

        <div className="users-table-wrapper">

          <table className="users-table">

            <thead>

              <tr>

                <th>
                  #
                </th>

                <th>
                  User
                </th>

                <th>
                  Email
                </th>

                <th>
                  Status
                </th>

                <th>
                  Role
                </th>

                <th>
                  Created
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {users.map(
                (item, index) => (

                  <tr
                    key={item._id}
                  >

                    {/* NUMBER */}

                    <td>

                      {index + 1}

                    </td>


                    {/* USER */}

                    <td>

                      <div className="user-info">

                        <div className="avatar">

                          {item.name
                            ?.charAt(0)
                            ?.toUpperCase()}

                        </div>


                        <div>

                          <strong>
                            {item.name}
                          </strong>

                        </div>

                      </div>

                    </td>


                    {/* EMAIL */}

                    <td>

                      {item.email}

                    </td>


                    {/* STATUS */}

                    <td>

                      {item.isVerified ? (

                        <span
                          className="status verified"
                        >

                          Verified

                        </span>

                      ) : (

                        <span
                          className="status pending"
                        >

                          Pending

                        </span>

                      )}

                    </td>


                    {/* ROLE */}

                    <td>

                      <span
                        className={`role ${item.role}`}
                      >

                        {item.role}

                      </span>

                    </td>


                    {/* CREATED */}

                    <td>

                      {item.createdAt
                        ? new Date(
                            item.createdAt
                          ).toLocaleDateString()
                        : "-"}

                    </td>


                    {/* ACTIONS */}

                    <td>

                      <div className="action-buttons">


                        {/* CHANGE ROLE */}

                        <button
                          className="role-button"
                          onClick={() =>
                            changeRole(
                              item._id,
                              item.role
                            )
                          }
                        >

                          {item.role ===
                          "admin"
                            ? "Make User"
                            : "Make Admin"}

                        </button>


                        {/* CHANGE PASSWORD */}

                        <button
                          className="password-button"
                          onClick={() => {

                            setSelectedUser(
                              item
                            );

                            setNewPassword("");

                            setError("");

                          }}
                        >

                          Password

                        </button>


                        {/* DELETE */}

                        <button
                          className="delete-button"
                          onClick={() =>
                            deleteUser(
                              item._id,
                              item.name
                            )
                          }
                        >

                          Delete

                        </button>


                      </div>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      )}


      {/* ======================================
          PASSWORD MODAL
      ====================================== */}

      {selectedUser && (

        <div className="modal-overlay">

          <div className="password-modal">


            {/* CLOSE */}

            <button
              className="close-modal"
              onClick={() =>
                setSelectedUser(null)
              }
            >

              ×

            </button>


            <h2>
              Change Password
            </h2>


            <p>
              Change password for:
            </p>


            <strong>
              {selectedUser.name}
            </strong>


            <p className="modal-email">

              {selectedUser.email}

            </p>


            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(
                  e.target.value
                )
              }
            />


            <button
              className="save-password"
              onClick={changePassword}
            >

              Update Password

            </button>


          </div>

        </div>

      )}

    </div>

  );
};


export default AllUsers;