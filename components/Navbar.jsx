"use client"
import React from "react";

import "./Navbar.css";
import { useRouter } from "next/navigation";

const Navbar = () => {

  const router = useRouter();
  return (
    <div className="nav">
      <div onClick={()=>router.push("/")}>Groww</div>
    </div>
  );
};

export default Navbar;
