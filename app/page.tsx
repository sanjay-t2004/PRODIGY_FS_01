"use client";

import { SetStateAction, useState, useEffect } from "react";
import Typewriter from "@/components/Typewriter";
import Form from "@/components/Form";
import axios from "axios";
import Image from "next/image";

export default function Home() {
  const [formShowing, setFormShowing] = useState<string>("");
  const [user, setUser] = useState<null | { [key: string]: any }>(null);

  const formShowHandler = (formId: SetStateAction<string>) => {
    setFormShowing(formId);
  };

  const signout = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.get("/api/signout");
    localStorage.removeItem("user");
    setUser(null);
  };

  // Load user from localStorage on page load
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Save user to localStorage when user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  console.log({ user });

  return (
    <main className="flex flex-col h-full items-center justify-center gap-2 my-10">
      {user !== null && Object.keys(user) !== null ? (
        <div className="flexColContainer gap-5">
          <h1 className="text-xl">
            Hello <span className="font-bold">{user.username}</span>
          </h1>
          <p>
            You have been authorized successfully.
            <br />
            Congrats!
          </p>
          <Image src="/swing_cute.gif" alt="swinging" width={100} height={100} />
          <button type="submit" onClick={signout} className="signBtn">
            sign out
          </button>
        </div>
      ) : (
        <>
          <Typewriter text="Whhat Would You Like To Try?" styles="text-2xl" />
          <div className="flex items-center justify-between w-full">
            <button
              type="button"
              className="signBtn"
              onClick={() => formShowHandler("sign_in_form")}
            >
              <Typewriter text="Siign in" styles="text-xl" delay={3000} />
            </button>
            <button
              type="button"
              className="signBtn"
              onClick={() => formShowHandler("sign_up_form")}
            >
              <Typewriter text="Siign up" styles="text-xl" delay={4000} />
            </button>
          </div>
          {formShowing === "sign_in_form" && (
            <Form isSignIn setFormShowing={setFormShowing} setUser={setUser} />
          )}
          {formShowing === "sign_up_form" && (
            <Form
              isSignIn={false}
              setFormShowing={setFormShowing}
              setUser={setUser}
            />
          )}
        </>
      )}
    </main>
  );
}
