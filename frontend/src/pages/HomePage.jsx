import { useEffect } from "react";
import Calendar from "../components/Calendar";
import Modal from "../components/Modal";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import {
  setEvents2,
  setEventToEdit,
  setIsEdit,
  setIsModelOpen,
} from "../store/eventSlice";
import { timeFormat } from "../utils/timeFormat";

export async function fetchEvents(token, dispatch) {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/events`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    dispatch(setEvents2(response.data.events));
  } catch (error) {
    console.error(error);
    toast.error(error.response.data.message);
  }
}

export async function handleDeleteEvent(token, id, dispatch) {
  try {
    const res = await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/events/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    toast.success(res.data.message);
    fetchEvents(token, dispatch);
  } catch (error) {
    console.error(error);
    toast.error(error.response.data.message);
  }
}

export async function handleIsCompleted(token, id, dispatch) {
  try {
    const res = await axios.patch(
      `${import.meta.env.VITE_BACKEND_URL}/events/${id}/completed`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    toast.success(res.data.message);
    fetchEvents(token, dispatch);
  } catch (error) {
    console.error(error);
    toast.error(error.response.data.message);
  }
}

function HomePage() {
  const { token } = useSelector((state) => state.user);
  const { selectedDate, modifiedEvent, isModalOpen, isEdit } = useSelector(
    (state) => state.event
  );
  const dispatch = useDispatch();

  useEffect(() => {
    fetchEvents(token, dispatch);
  }, [token]);

  return (
    <div className="flex bg-gray-200 max-w-screen max-h-[calc(100vh-50px)]  overflow-hidden ">
      <div className="w-[75%] ">
        <div className="p-4">
          <Calendar />
        </div>
      </div>

      <div className="w-[25%] flex overflow-y-scroll flex-col items-center pt-1 p-5 bg-white">
        <h1 className="text-lg font-bold my-2">
          {new Date(selectedDate).toLocaleDateString("en-GB")}
        </h1>
        {isModalOpen ? (
          <Modal type={"add"} />
        ) : (
          <button
            onClick={() => dispatch(setIsModelOpen(true))}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add Event
          </button>
        )}

        <div className="w-full my-5">
          {new Date(selectedDate).toDateString() in modifiedEvent ? (
            modifiedEvent[new Date(selectedDate).toDateString()].map(
              (event) => (
                <div
                  key={event._id}
                  className={`w-full p-5   my-2 rounded-lg flex justify-between items-center ${
                    event.isCompleted ? "bg-green-200" : "bg-gray-100"
                  }`}
                >
                  <div>
                    <h1 className="text-lg font-semibold">{event.title}</h1>
                    <p className="line-clamp-2">{event.description}</p>
                    <p>{timeFormat(event.time)}</p>
                  </div>
                  <div className="flex space-x-2">
                    <div class="flex items-center">
                      <input
                        checked={event.isCompleted}
                        id="checked-checkbox"
                        type="checkbox"
                        value=""
                        onChange={() =>
                          handleIsCompleted(token, event._id, dispatch)
                        }
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        for="checked-checkbox"
                        class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      ></label>
                    </div>
                    <i
                      onClick={() =>
                        dispatch(setEventToEdit(event)) &&
                        dispatch(setIsEdit(true))
                      }
                      className="fi fi-bs-pencil cursor-pointer mt-1"
                    ></i>
                    <i
                      onClick={() =>
                        handleDeleteEvent(token, event._id, dispatch)
                      }
                      className="fi fi-rr-trash cursor-pointer mt-1"
                    ></i>
                  </div>
                </div>
              )
            )
          ) : (
            <h1 className="text-xl text-center">No events</h1>
          )}
        </div>
      </div>

      {isEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Modal type="edit" />
        </div>
      )}
    </div>
  );
}

export default HomePage;
