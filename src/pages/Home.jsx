// import { useContext, useEffect, useState } from "react";
// import axios from "axios";
// import { Context, server } from "../main";
// import { toast } from "react-hot-toast";
// import { Navigate } from "react-router-dom";
// import TodoItem from "../components/TodoItem";
// const Home = () => {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [tasks, setTasks] = useState([]);
//   // const [refresh, setRefresh] = useState(false);

//   const { isAuthenticated } = useContext(Context);

//   const updateHandler = async (id) => {
//     try {
//       const { data } = await axios.put(
//         `${server}/task/${id}`,
//         {},
//         {
//           withCredentials: true,
//         }
//       );

//       toast.success(data.message);
//       // setRefresh((prev) => !prev);
//     } catch (error) {
//       toast.error(error.response.data.message);
//     }
//   };
//   const deleteHandler = async (id) => {
//     try {
//       const { data } = await axios.delete(`${server}/task/${id}`, {
//         withCredentials: true,
//       });

//       toast.success(data.message);
//       // setRefresh((prev) => !prev);
//     } catch (error) {
//       toast.error(error.response.data.message);
//     }
//   };

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       const { data } = await axios.post(
//         `${server}/task/new`,
//         {
//           title,
//           description,
//         },
//         {
//           withCredentials: true,
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       setTitle("");
//       setDescription("");
//       toast.success(data.message);
//       setLoading(false);
//       // setRefresh((prev) => !prev);
//     } catch (error) {
//       toast.error(error.response.data.message);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const fetching = async () => {
//       // await axios
//       //   .get(`${server}/task/myTask`, {
//       //     withCredentials: true,
//       //   })
//       //   .then((res) => {
//       //     setTasks(res.data.tasks);
//       //   })
//       try {
//         const response = await axios.get(`${server}/task/myTask`, {
//           withCredentials: true,
//         });
//         // console.log(response.json());
//         // const value = response.json();
//         // console.log(response.data + "herllo");
//         console.log(response.data.tasks);
//         // setTasks((prev) => [...prev, response.data.tasks]);

//         setTasks(response.data.tasks);
//       } catch {
//         (e) => {
//           toast.error(e.response.data.message);
//         };
//       }
//     };
//     fetching();
//   }, []);

//   if (!isAuthenticated) return <Navigate to={"/login"} />;

//   return (
//     <div className="container">
//       <div className="login">
//         <section>
//           <form onSubmit={submitHandler}>
//             <input
//               type="text"
//               placeholder="Title"
//               required
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//             />
//             <input
//               type="text"
//               placeholder="Description"
//               required
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             />

//             <button disabled={loading} type="submit">
//               Add Task
//             </button>
//           </form>
//         </section>
//       </div>

//       <section className="todosContainer">
//         {console.log(tasks)}
//         {tasks?.map((i) => (
//           <TodoItem
//             key={i._id}
//             title={i.title}
//             description={i.description}
//             isCompleted={i.isCompleted}
//             updateHandler={updateHandler}
//             deleteHandler={deleteHandler}
//             id={i._id}
//           />
//         ))}
//       </section>
//     </div>
//   );
// };

// export default Home;

import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Context, server } from "../main";
import { toast } from "react-hot-toast";
import { Navigate } from "react-router-dom";
import TodoItem from "../components/TodoItem";

const Home = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [isFetching, setIsFetching] = useState(false); // For fetching spinner
  const [refresh, setRefresh] = useState(false); // Used to trigger re-fetch

  const { isAuthenticated } = useContext(Context);

  // Update task status handler
  const updateHandler = async (id) => {
    try {
      const { data } = await axios.put(
        `${server}/task/${id}`,
        {},
        { withCredentials: true }
      );

      toast.success(data.message);

      // Update task in state
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? { ...task, isCompleted: !task.isCompleted } : task
        )
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // Delete task handler
  const deleteHandler = async (id) => {
    try {
      const { data } = await axios.delete(`${server}/task/${id}`, {
        withCredentials: true,
      });

      toast.success(data.message);

      // Remove task from state
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // Submit new task handler
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Title and Description are required!");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${server}/task/new`,
        { title, description },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      setTitle("");
      setDescription("");
      toast.success(data.message);

      // Refresh tasks list
      setRefresh((prev) => !prev);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks on mount and refresh
  useEffect(() => {
    const fetching = async () => {
      setIsFetching(true);
      try {
        const { data } = await axios.get(`${server}/task/myTask`, {
          withCredentials: true,
        });
        setTasks(data.tasks);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load tasks");
      } finally {
        setIsFetching(false);
      }
    };

    fetching();
  }, [refresh]);

  // Redirect to login if not authenticated
  if (!isAuthenticated) return <Navigate to={"/login"} />;

  return (
    <div className="container">
      {/* Task Submission Section */}
      <div className="login">
        <section>
          <form onSubmit={submitHandler}>
            <input
              type="text"
              placeholder="Title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button disabled={loading} type="submit">
              {loading ? "Adding..." : "Add Task"}
            </button>
          </form>
        </section>
      </div>

      {/* Task List Section */}
      <section className="todosContainer">
        {isFetching ? (
          <p>Loading tasks...</p>
        ) : tasks.length > 0 ? (
          tasks.map((task) => (
            <TodoItem
              key={task._id}
              id={task._id}
              title={task.title}
              description={task.description}
              isCompleted={task.isCompleted}
              updateHandler={updateHandler}
              deleteHandler={deleteHandler}
            />
          ))
        ) : (
          <p>No tasks found!</p>
        )}
      </section>
    </div>
  );
};

export default Home;
