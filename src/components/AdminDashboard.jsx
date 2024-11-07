import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "../Firebase";
import FetchAndGeneratePDF from "./FetchAndGeneratePDF";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [casteFilter, setCasteFilter] = useState("");
  const [contactRequests, setContactRequests] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState("");
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(userId);
      } else {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate, userId]);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setFormData(user);
    setEditMode(true);
  };

  const handleDeleteClick = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteDoc(doc(db, "Biodata", userId));
        setUsers(users.filter((user) => user.id !== userId));
        setSelectedUser(null);
        alert("User deleted successfully.");
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, "Biodata");
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map((u) => ({
        id: u.id,
        ...u.data(),
      }));
      setUsers(userList);
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };

  const fetchContactRequests = async () => {
    try {
      const contactCollection = collection(db, "contactRequests");
      const contactSnapshot = await getDocs(contactCollection);
      const contactList = contactSnapshot.docs.map((c) => ({
        id: c.id,
        ...c.data(),
      }));
      setContactRequests(contactList);
    } catch (error) {
      console.error("Error fetching contact requests: ", error);
    }
  };

  const fetchServiceRequests = async () => {
    try {
      const serviceCollection = collection(db, "serviceRequests");
      const serviceSnapshot = await getDocs(serviceCollection);
      const serviceList = serviceSnapshot.docs.map((s) => ({
        id: s.id,
        ...s.data(),
      }));
      setServiceRequests(serviceList);
    } catch (error) {
      console.error("Error fetching service requests: ", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchContactRequests();
    fetchServiceRequests();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const matchingUser = users.find((user) =>
      user.firstName?.toLowerCase().includes(value.toLowerCase())
    );

    if (matchingUser) {
      setSelectedUser(matchingUser);
      const userUid = matchingUser.id;
      console.log("User UID:", userUid);
    } else {
      setSelectedUser(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesName =
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCaste = casteFilter
      ? user.caste?.toLowerCase() === casteFilter.toLowerCase()
      : true;

    return matchesName && matchesCaste;
  });

  const handleCasteChange = (e) => {
    const selectedCaste = e.target.value;
    setCasteFilter(selectedCaste);

    const matchingUser = users.find(
      (user) => user.caste?.toLowerCase() === selectedCaste.toLowerCase()
    );

    if (matchingUser) {
      setSelectedUser(matchingUser);
      const userUid = matchingUser.id;
      console.log("User UID:", userUid);
    } else {
      setSelectedUser(null);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (selectedUser) {
      try {
        const userRef = doc(db, "Biodata", selectedUser.id);
        await updateDoc(userRef, formData);
        setUsers(
          users.map((user) =>
            user.id === selectedUser.id ? { ...user, ...formData } : user
          )
        );
        setEditMode(false);
        alert("User updated successfully.");
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }
  };

  return (
    <>
      <div className="p-6">
        <h1 className="lg:text-5xl text-2xl text-center font-bold my-4 mb-7">
          Admin Dashboard
        </h1>
        <div className="flex justify-center">
          <input
            type="text"
            placeholder="Enter first name to search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded lg:w-[30vw] mb-4"
          />
          <button
            onClick={handleSearchChange}
            className="bg-pink-700 h-[42px] font-medium text-white p-2 rounded ml-2"
          >
            Search
          </button>
        </div>

        {selectedUser ? (
          <FetchAndGeneratePDF userId={selectedUser.id} />
        ) : (
          <div className="text-center">
            <p className="text-red-500">No matching user found.</p>
          </div>
        )}
      </div>

      {/* CASTE Filter */}
      <div className="lg:p-6 p-1">
        <div className="w-full mb-4 flex justify-center">
          <select
            value={casteFilter}
            onChange={handleCasteChange} // Call caste filter change logic
            className="mt-1 block lg:w-[30vw] w-[150px] p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Caste</option>
            <option value="Abbasi">Abbasi</option>
            <option value="Afghan">Afghan</option>
            <option value="Alvi">Alvi</option>
            <option value="Ansari">Ansari</option>
            <option value="Arab">Arab</option>
            <option value="Asadi">Asadi</option>
            <option value="Baghdadi">Baghdadi</option>
            <option value="Baig">Baig</option>
            <option value="Barelvi">Barelvi</option>
            <option value="Bohra">Bohra</option>
            <option value="Bukhari">Bukhari</option>
            <option value="Chaudhary">Chaudhary</option>
            <option value="Chishti">Chishti</option>
            <option value="Dakhini">Dakhini</option>
            <option value="Dawoodi Bohra">Dawoodi Bohra</option>
            <option value="Deobandi">Deobandi</option>
            <option value="Faqir">Faqir</option>
            <option value="Farooqui">Farooqui</option>
            <option value="Gujjar">Gujjar</option>
            <option value="Halwai">Halwai</option>
            <option value="Hanafi">Hanafi</option>
            <option value="Hussaini">Hussaini</option>
            <option value="Jafari">Jafari</option>
            <option value="Jat">Jat</option>
            <option value="Jilani">Jilani</option>
            <option value="Kazmi">Kazmi</option>
            <option value="Khan">Khan</option>
            <option value="Khanani">Khanani</option>
            <option value="Khoja">Khoja</option>
            <option value="Lohar">Lohar</option>
            <option value="Madni">Madni</option>
            <option value="Mahdavi">Mahdavi</option>
            <option value="Malik">Malik</option>
            <option value="Mansoori">Mansoori</option>
            <option value="Meo">Meo</option>
            <option value="Mir">Mir</option>
            <option value="Mirza">Mirza</option>
            <option value="Memon">Memon</option>
            <option value="Mughal">Mughal</option>
            <option value="Naqvi">Naqvi</option>
            <option value="Nadvi">Nadvi</option>
            <option value="Naimi">Naimi</option>
            <option value="Pathan">Pathan</option>
            <option value="Pashmina">Pashmina</option>
            <option value="Pirzada">Pirzada</option>
            <option value="Qadri">Qadri</option>
            <option value="Qureshi">Qureshi</option>
            <option value="Rajput Muslim">Rajput Muslim</option>
            <option value="Razvi">Razvi</option>
            <option value="Rizvi">Rizvi</option>
            <option value="Rohilla">Rohilla</option>
            <option value="Saifi">Saifi</option>
            <option value="Salafi">Salafi</option>
            <option value="Shaikh">Shaikh</option>
            <option value="Shah">Shah</option>
            <option value="Shamsi">Shamsi</option>
            <option value="Sheikh">Sheikh</option>
            <option value="Siddiqi">Siddiqi</option>
            <option value="Siddiqui">Siddiqui</option>
            <option value="Sufi">Sufi</option>
            <option value="Syed">Syed</option>
            <option value="Teli">Teli</option>
            <option value="Turk">Turk</option>
            <option value="Usmani">Usmani</option>
            <option value="Zuberi">Zuberi</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="overflow-x-auto mt-6">
          <table className="border border-gray-300 w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2 text-lg lg:px-4 lg:py-2">#</th>{" "}
                {/* Added column for row numbers */}
                <th className="border px-4 py-2 text-lg lg:px-16 lg:py-2">
                  Name
                </th>
                <th className="border px-4 py-2 text-lg lg:px-4 lg:py-2">
                  Sect
                </th>
                <th className="border px-4 py-2 text-lg lg:px-4 lg:py-2">
                  Own Caste
                </th>
                <th className="border px-4 py-2 text-lg lg:px-4 lg:py-2">
                  Preferred Caste
                </th>
                <th className="border px-4 py-2 text-lg lg:px-4 lg:py-2">
                  Age
                </th>
                <th className="border px-4 py-2 text-lg lg:px-4 lg:py-2">
                  Marital Status
                </th>
                <th className="border px-4 py-2 text-lg lg:px-4 lg:py-2">
                  Phone Number
                </th>
                <th className="border px-4 py-2 text-lg lg:px-4 lg:py-2">
                  E-mail/UID
                </th>
                <th className="border px-4 py-2 text-lg lg:px-4 lg:py-2">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={() => setSelectedUser(user)}
                >
                  <td className="border px-2 py-2 text-lg lg:px-4 lg:py-2">
                    {index + 1}
                  </td>{" "}
                  {/* Display row number */}
                  <td className="border px-2 py-2 text-lg lg:px-4 lg:py-2">
                    {user.firstName || user.lastName
                      ? `${user.firstName || ""} ${
                          user.lastName || ""
                        } (${user.gender.charAt(0)})`
                      : "N/A"}
                  </td>
                  <td className="border px-2 py-2 text-lg lg:px-4 lg:py-2">
                    {user.sect || "N/A"}
                  </td>
                  <td className="border px-2 py-2 text-lg lg:px-4 lg:py-2">
                    {user.caste || "N/A"}
                  </td>
                  <td className="border px-2 py-2 text-lg lg:px-4 lg:py-2">
                    {user.prefCaste || "N/A"}
                  </td>
                  <td className="border px-2 py-2 text-lg lg:px-4 lg:py-2">
                    {new Date().getFullYear() - user.year || "N/A"} yrs
                  </td>
                  <td className="border px-2 py-2 text-lg lg:px-4 lg:py-2">
                    {user.maritalStatus || "N/A"}
                  </td>
                  <td className="border px-2 py-2 text-lg lg:px-4 lg:py-2">
                    {user.mobileNumber || "N/A"} <br />
                    {user.whatsappNo || "N/A"}
                  </td>
                  <td className="border px-2 py-2 text-lg lg:px-4 lg:py-2">
                    {user.email.substring(0, user.email.indexOf("@")) || "N/A"}{" "}
                    <br />
                    {user.id.substring(0, 5) || "N/A"}
                  </td>
                  <td className="border px-2 py-2 text-lg lg:px-4 lg:py-2">
                    <button
                      onClick={() => handleEditClick(user)}
                      className="bg-blue-500 text-white p-1 px-[15px] rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(user.id)}
                      className="bg-red-500 text-white mt-1 p-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Form */}
        {editMode && (
          <div className="mt-6">
            <h2 className="text-xl font-bold">Edit User Details</h2>
            <form
              onSubmit={handleFormSubmit}
              className="flex flex-col gap-4 mt-4"
            >
              {Object.keys(formData).map((field) => (
                <div key={field} className="flex flex-col gap-2">
                  <label className="text-gray-700 font-bold">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field] || ""}
                    onChange={handleFormChange}
                    className="border p-2 rounded"
                    placeholder={`Enter ${field}`}
                  />
                </div>
              ))}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-green-500 text-white p-2 rounded cursor-pointer"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="bg-gray-500 text-white p-2 rounded cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Contact Requests Table */}
      <div className="p-6">
        <h2 className="text-2xl text-center font-bold mb-4">
          Contact Requests
        </h2>
        <table className="border mx-auto border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border lg:px-4 lg:py-2">Name</th>
              <th className="border lg:px-4 lg:py-2">Phone</th>
            </tr>
          </thead>
          <tbody>
            {contactRequests.map((request) => (
              <tr key={request.id}>
                <td className="border lg:px-4 lg:py-2 px-1 py-1">
                  {request.name}
                </td>
                <td className="border lg:px-4 lg:py-2 px-1 py-1">
                  {request.phone}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Service Requests Table */}
      <div className="p-6">
        <h2 className="text-2xl text-center font-bold mb-4">
          Service Requests
        </h2>
        <table className="border mx-auto border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border lg:px-4 lg:py-2">Name</th>
              <th className="border lg:px-4 lg:py-2">Phone</th>
              <th className="border lg:px-4 lg:py-2">Service</th>
            </tr>
          </thead>
          <tbody>
            {serviceRequests.map((request) => (
              <tr key={request.id}>
                <td className="border lg:px-4 lg:py-2 px-1 py-1">
                  {request.name}
                </td>
                <td className="border lg:px-4 lg:py-2 px-1 py-1">
                  {request.phone}
                </td>
                <td className="border lg:px-4 lg:py-2 px-1 py-1">
                  {request.service}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminDashboard;
