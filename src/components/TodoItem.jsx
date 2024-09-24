import React, { useEffect } from "react";
import styles from "../styles/modules/todoItem.module.scss";
import { getClasses } from "../utils/getClasses";
import { format } from "date-fns";
import { MdDelete, MdEdit } from "react-icons/md";
import { useDispatch } from "react-redux";
import { deleteTodo, updateTodo } from "../slices/todoSlice";
import toast from "react-hot-toast";
import TodoModal from "./TodoModal";
import { useState } from "react";
import CheckButton from "./CheckButton";
import { motion } from 'framer-motion';

const child = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

function TodoItem({ todo }) {
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(false);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    if (todo.status === "complete") {
      setChecked(true);
    } else {
      setChecked(false);
    }
  }, [todo.status]);

  const handleDelete = () => {
    dispatch(deleteTodo(todo.id));
    toast.success("Task Successfully Deleted!", {
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
  };

  const handleUpdate = () => {
    setUpdate(true);
  };

  const handleChecked = () => {
    setChecked(!checked);
    dispatch(
      updateTodo({
        ...todo,
        status: todo.status === "incomplete" ? "complete" : "incomplete",
      })
    );
  };

  return (
    <React.Fragment>
      <motion.div className={styles.item} variants={child}>
        <div className={styles.todoDetails}>
          <CheckButton checked={checked} handleChecked={handleChecked} />
          <div className={styles.texts}>
            <p
              className={getClasses([
                styles.todoText,
                todo.status === "complete" && styles["todoText--completed"],
              ])}
            >
              {todo.title}
            </p>
            <p className={styles.time}>
              {format(new Date(todo.time), "p, MM/dd/yyyy")}
            </p>
          </div>
        </div>
        <div className={styles.todoActions}>
          <div
            className={styles.icon}
            onClick={handleDelete}
            onKeyDown={handleDelete}
            role="button"
            tabIndex={0}
          >
            <MdDelete />
          </div>
          <div
            className={styles.icon}
            onClick={handleUpdate}
            onKeyDown={handleUpdate}
            role="button"
            tabIndex={0}
          >
            <MdEdit />
          </div>
        </div>
      </motion.div>
      <TodoModal
        modalOpen={update}
        setModalOpen={setUpdate}
        type="Update"
        todo={todo}
      />
    </React.Fragment>
  );
}

export default TodoItem;
