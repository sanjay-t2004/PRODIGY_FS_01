"use client";

import { useState } from "react";
import axios from "axios";

import Typewriter from "./Typewriter";

const Form = ({
  isSignIn,
  setFormShowing,
  setUser,
}: {
  isSignIn: boolean;
  setFormShowing: (e: string) => void;
  setUser: (e: { [key: string]: any }) => void;
}) => {
  // Declaring States
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Declaring regex
  const upperCaseCheck = /(?=.*[A-Z])/;
  const minimumLengthCheck = /.{8,}/;
  const numberCheck = /(?=.*\d)/;
  const specialCharacterCheck = /(?=.*[@.#\-_])/;

  // regex validation
  const isUpperCaseValid = upperCaseCheck.test(formData.password);
  const isNumberValid = numberCheck.test(formData.password);
  const isSpecialCharacterValid = specialCharacterCheck.test(formData.password);
  const isMinimumLengthValid = minimumLengthCheck.test(formData.password);

  // Declaring handlers
  const setPasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const signin = async () => {
    try {
      const result = await axios
        .post("/api/signin", {
          username: formData.username,
          password: formData.password,
        })
        .then((result) => {
          if (result.status === 200) setUser(result.data.userToken.payload);
        })
        .catch((error) => {
          if (axios.isAxiosError(error) && error.response) {
            if (error.response.status === 400) {
              alert(error.response.data.message);
            } else if (error.response.status === 404) {
              alert("Username does not exist");
            } else if (error.response.status === 401) {
              alert("Wrong password, please try again");
            } else {
              console.log(error);
            }
          }
        });
    } catch (error: any) {
      console.log(error);
    }
  };

  const signup = async () => {
    if (
      !isUpperCaseValid ||
      !isNumberValid ||
      !isSpecialCharacterValid ||
      !isMinimumLengthValid
    )
      return alert("Password Has To Match All Criteria!");
    try {
      const result = await axios
        .post("/api/signup", {
          username: formData.username,
          password: formData.password,
        })
        .then((result) => setUser(result.data.userToken.payload))
        .catch((error) => console.log(error));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      isSignIn ? signin() : signup();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      method="POST"
      onSubmit={handleSubmit}
      className="flex flex-col justify-center align-center gap-10 text-xl border border-dashed border-green-500 py-10 px-8 mb-6"
    >
      <h1 className="text-center">
        <Typewriter text={isSignIn ? "Siign in Form" : "Siign up Form"} />
      </h1>
      <label className="flex flex-col justify-center align-center gap-5">
        username:
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="bg-transparent font-mono italic border-b-2 border-b-white focus:outline-none"
        />
      </label>

      <label className="relative flex flex-col justify-center align-center gap-5">
        password:
        <input
          type={isPasswordVisible ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="relative bg-transparent font-mono italic border-b-2 border-b-white focus:outline-none"
        />
        <p
          className="absolute bottom-2 right-2 text-sm cursor-pointer"
          onClick={setPasswordVisibility}
        >
          {isPasswordVisible ? "Hide" : "Show"}
        </p>
      </label>
      {!isSignIn && formData.password.length > 0 && (
        <div className="text-sm flex flex-col gap-4">
          <p
            className={`flex items-center ${
              isUpperCaseValid ? "text-green-400" : "text-red-400"
            }`}
          >
            <span
              className={`inline-block w-4 h-4 border-2 border-dashed mr-2 ${
                isUpperCaseValid
                  ? "border-green-400 text-green-400"
                  : "border-red-400 text-red-400"
              } flex items-center justify-center`}
            >
              {isUpperCaseValid ? "✓" : "✕"}
            </span>
            Password should contain at least one uppercase letter
          </p>
          <p
            className={`flex items-center ${
              isNumberValid ? "text-green-400" : "text-red-400"
            }`}
          >
            <span
              className={`inline-block w-4 h-4 border-2 border-dashed mr-2 ${
                isNumberValid
                  ? "border-green-400 text-green-400"
                  : "border-red-400 text-red-400"
              } flex items-center justify-center`}
            >
              {isNumberValid ? "✓" : "✕"}
            </span>
            Password should contain at least one number
          </p>
          <p
            className={`flex items-center ${
              isSpecialCharacterValid ? "text-green-400" : "text-red-400"
            }`}
          >
            <span
              className={`inline-block w-4 h-4 border-2 border-dashed mr-2 ${
                isSpecialCharacterValid
                  ? "border-green-400 text-green-400"
                  : "border-red-400 text-red-400"
              } flex items-center justify-center`}
            >
              {isSpecialCharacterValid ? "✓" : "✕"}
            </span>
            Password should contain at least one special character{" "}
            {`'@, ., #, -, or _'`}
          </p>
          <p
            className={`flex items-center ${
              isMinimumLengthValid ? "text-green-400" : "text-red-400"
            }`}
          >
            <span
              className={`inline-block w-4 h-4 border-2 border-dashed mr-2 ${
                isMinimumLengthValid
                  ? "border-green-400 text-green-400"
                  : "border-red-400 text-red-400"
              } flex items-center justify-center`}
            >
              {isMinimumLengthValid ? "✓" : "✕"}
            </span>
            Password should be at least 8 characters long
          </p>
        </div>
      )}
      {!isLoading ? (
        <div className="flex items-center justify-between">
          <button
            className="signBtn"
            type="button"
            onClick={() => setFormShowing("")}
          >
            Cancel
          </button>
          <button className="signBtn" type="submit" onClick={handleSubmit}>
            {isSignIn ? "Sign in" : "Sign up"}
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <button
            className="signBtn"
            type="button"
            onClick={() => setFormShowing("")}
          >
            Cancel
          </button>
          <button disabled className="signBtn">
            {isSignIn ? "Signing in" : "Signing up"}
          </button>
        </div>
      )}
    </form>
  );
};

export default Form;
