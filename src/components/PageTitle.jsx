import React from "react";
import style from "../styles/modules/title.module.scss";

function PageTitle({ children, ...react }) {
  return (
    <p className={style.title} {...react}>
      {children}
    </p>
  );
}

export default PageTitle;
