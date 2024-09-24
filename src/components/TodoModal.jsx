import React, { useState } from "react";
import styles from "../styles/modules/modal.module.scss";
import { MdOutlineClose } from "react-icons/md";
import Button from "./Button";
import { useDispatch } from "react-redux";
import { addTodo, updateTodo } from "../slices/todoSlice";
import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const dropIn = {
  hidden: {
    opacity: 0,
    transform: "scale(0.9)",
  },
  visible: {
    transform: "scale(1)",
    opacity: 1,
    transition: {
      duration: 0.1,
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    transform: "scale(0.9)",
    opacity: 0,
  },
};

function TodoModal({ type, modalOpen, setModalOpen, todo }) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("Incomplete");
  const dispatch = useDispatch();

  useEffect(() => {
    if (type === "Update" && todo) {
      setTitle(todo.title);
      setStatus(todo.status);
    } else {
      setTitle("");
      setStatus("Incomplete");
    }
  }, [type, todo, modalOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title === "") {
      toast.error("Please enter a title!", {
        position: "top-center",
        style: {
          border: "1px solid red",
          padding: "12px",
          fontSize: "1.5rem",
          color: "red",
        },
        iconTheme: {
          fontSize: "1.5rem",
          primary: "red",
          secondary: "#FFFAEE",
        },
      });
      return;
    }
    if (title && status) {
      if (type === "add") {
        dispatch(
          addTodo({
            id: uuid(),
            title,
            status,
            time: new Date().toLocaleString(),
          })
        );
        toast.success("Task Added Successfully!", {
          position: "top-center",
          style: {
            border: "1px solid #646ff0",
            padding: "12px",
            fontSize: "1.5rem",
            color: "##646ff0",
          },
          iconTheme: {
            fontSize: "1.5rem",
            primary: "#646ff0",
            secondary: "#FFFAEE",
          },
        });
        setModalOpen(false);
      }
      if (type === "Update") {
        if (todo.title !== title || todo.status !== status) {
          dispatch(
            updateTodo({
              ...todo,
              title: title,
              status: status,
            })
          );
          toast.success("Task Updated Successfully!", {
            position: "top-center",
            style: {
              border: "1px solid #646ff0",
              padding: "12px",
              fontSize: "1.5rem",
              color: "##646ff0",
            },
            iconTheme: {
              fontSize: "1.5rem",
              primary: "#646ff0",
              secondary: "#FFFAEE",
            },
          });
          setModalOpen(false);
        } else {
          toast.error("No changes made, the same title!", {
            position: "top-center",
            style: {
              border: "1px solid red",
              padding: "12px",
              fontSize: "1.5rem",
              color: "red",
            },
            iconTheme: {
              fontSize: "1.5rem",
              primary: "red",
              secondary: "#FFFAEE",
            },
          });
          return;
        }
      }
    }
  };

  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          className={styles.wrapper}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={styles.container}
            variants={dropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className={styles.closeButton}
              onKeyDown={() => setModalOpen(false)}
              onClick={() => setModalOpen(false)}
              role="button"
              tabIndex={0}
              // animation
              initial={{ top: 40, opacity: 0 }}
              animate={{ top: -10, opacity: 1 }}
              exit={{ top: 40, opacity: 0 }}
            >
              <MdOutlineClose />
            </motion.div>
            <form className={styles.form} onSubmit={(e) => handleSubmit(e)}>
              <h1 className={styles.formTitle}>
                {type === "Update" ? "Update" : "Add"} Task
              </h1>
              <label htmlFor="title">
                Title
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </label>
              <label htmlFor="status">
                Status
                <select
                  name="status"
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="incomplete">Incomplete</option>
                  <option value="complete">Complete</option>
                </select>
              </label>
              <div className={styles.buttonContainer}>
                <Button type="submit" variant="primary">
                  {type === "Update" ? "Update" : "Add"} Task
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setModalOpen(false)}
                  onKeyDown={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default TodoModal;
