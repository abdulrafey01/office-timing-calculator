import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function App() {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    axios.get("http://localhost:4000/user/getall").then((response) => {
      console.log(response.data.users);
      setUsers(response.data.users);
    });
  };

  const doCheckIn = async () => {
    console.log(document.getElementById("usernames").value);
    axios
      .post("http://localhost:4000/attendance/checkin", {
        userId: document.getElementById("usernames").value,
      })
      .then((response) => {
        toast.success(response.data.msg);
      })
      .catch((error) => {
        toast.error(error.response.data.msg);
      });
  };

  const doCheckOut = async () => {
    console.log(document.getElementById("usernames").value);
    axios
      .post("http://localhost:4000/attendance/checkout", {
        userId: document.getElementById("usernames").value,
      })
      .then((response) => {
        toast.success(response.data.msg);
      })
      .catch((error) => {
        toast.error(error.response.data.msg);
      });
  };

  const getOfficeTime = async (id) => {
    console.log(id);
    console.log(document.getElementById("date").value);
    axios
      .post(`http://localhost:4000/attendance/gettotal/${id}`, {
        date: document.getElementById("date").value,
      })
      .then((response) => {
        console.log(response);
        toast.success(response.data.totalTimeInOffice);
      })
      .catch((error) => {
        toast.error(error.response.data.msg);
      });
  };

  useEffect(() => {
    getUsers();
  }, []);
  return (
    <div className=" h-screen flex justify-center items-center">
      <ToastContainer />
      <div className="flex justify-center items-center flex-row w-1/2">
        <div>
          <div className="m-4" onClick={doCheckIn}>
            <button className="bg-blue-500 w-28 p-2 text-white  rounded-md">
              CheckIn
            </button>
          </div>
          <div className="m-4" onClick={doCheckOut}>
            <button className="bg-blue-500 text-white w-28 p-2  rounded-md">
              CheckOut
            </button>
          </div>
        </div>
        <div className="m-4">
          <select
            className="p-2 rounded-md bg-red-600 text-white w-28 outline-none"
            name="names"
            id="usernames"
          >
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
        <div className="m-4 flex flex-col items-center justify-center">
          <div>
            <h3>Enter date to get office hours</h3>
          </div>
          <div className="m-4">
            <input
              id="date"
              className="p-2 rounded-md bg-yellow-300 outline-none"
              type="text"
              placeholder="MM/DD/YYYY"
            />
          </div>
          <div className="w-28">
            <button
              onClick={() =>
                getOfficeTime(document.getElementById("usernames").value)
              }
              className="bg-blue-500 text-white w-32 p-2  rounded-md"
            >
              Get Office Time
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
