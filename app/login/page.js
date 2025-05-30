// login/page.js
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "../../components/ui/label";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { signIn } from "next-auth/react";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);

    if (!email || !password) {
      setLoginError("Email and password are required");
      setLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setLoginError(result.error || "Login failed. Please try again.");
        setLoading(false);
      } else {
        // Redirect based on email
        const redirectUrl =
          email.toLowerCase() === "tpoppypie@gmail.com"
            ? "/admin"
            : "/careers";
        router.push(redirectUrl);
      }
    } catch (err) {
      setLoginError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterError("");
    setLoading(true);

    if (!firstName || !email || !password || !mobile) {
      setRegisterError("All fields are required");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setRegisterError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, mobile, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setActiveTab("login");
      } else {
        setRegisterError(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      setRegisterError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }

    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setMobile("");
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setForgotPasswordError("");
    setForgotPasswordSuccess("");
    setLoading(true);

    if (!email) {
      setForgotPasswordError("Email is required");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setForgotPasswordSuccess(
          "A password reset link has been sent to your email."
        );
      } else {
        setForgotPasswordError(
          data.message || "Failed to send reset link. Please try again."
        );
      }
    } catch (error) {
      setForgotPasswordError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    await signIn("google", { callbackUrl: "/careers" });
  };

  const handleGitHubSignIn = async () => {
    await signIn("github", { callbackUrl: "/careers" });
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const buttonVariants = {
    hover: {
      scale: 1.03,
      backgroundColor: "#333",
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
    tap: { scale: 0.97 },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delayChildren: 0.3, staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <motion.div
        className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h2 className="text-3xl font-extrabold text-gray-900">Welcome</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account or create a new one
          </p>
        </motion.div>

        <div className="flex border-b border-gray-200">
          <motion.button
            className={`px-4 py-2 font-medium text-sm flex-1 ${
              activeTab === "login"
                ? "text-gray-900 border-b-2 border-gray-800"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("login")}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            Login
          </motion.button>
          <motion.button
            className={`px-4 py-2 font-medium text-sm flex-1 ${
              activeTab === "register"
                ? "text-gray-900 border-b-2 border-gray-800"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("register")}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            Register
          </motion.button>
          <motion.button
            className={`px-4 py-2 font-medium text-sm flex-1 ${
              activeTab === "forgot-password"
                ? "text-gray-900 border-b-2 border-gray-800"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("forgot-password")}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            Forgot Password
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "login" ? (
            <motion.form
              key="login"
              className="mt-8 space-y-6"
              onSubmit={handleLoginSubmit}
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {loginError && (
                  <motion.div
                    className="p-3 text-sm text-red-700 bg-red-100 rounded-md"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {loginError}
                  </motion.div>
                )}

                <motion.div variants={itemVariants}>
                  <LabelInputContainer>
                    <Label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email:
                    </Label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </LabelInputContainer>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <LabelInputContainer>
                    <Label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password:
                    </Label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </LabelInputContainer>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-gray-900 focus:ring-gray-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <button
                      type="button"
                      onClick={() => setActiveTab("forgot-password")}
                      className="font-medium text-gray-600 hover:text-gray-800"
                    >
                      Forgot password?
                    </button>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <motion.button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </motion.button>
              </motion.div>
            </motion.form>
          ) : activeTab === "register" ? (
            <motion.form
              key="register"
              className="mt-8 space-y-6"
              onSubmit={handleRegisterSubmit}
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {registerError && (
                  <motion.div
                    className="p-3 text-sm text-red-700 bg-red-100 rounded-md"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {registerError}
                  </motion.div>
                )}

                <motion.div
                  variants={itemVariants}
                  className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2"
                >
                  <LabelInputContainer>
                    <Label
                      htmlFor="firstname"
                      className="block text-sm font-medium text-gray-700"
                    >
                      First name
                    </Label>
                    <input
                      id="firstname"
                      placeholder="Tyler"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                      required
                    />
                  </LabelInputContainer>
                  <LabelInputContainer>
                    <Label
                      htmlFor="lastname"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Last name
                    </Label>
                    <input
                      id="lastname"
                      placeholder="Durden"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                      required
                    />
                  </LabelInputContainer>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Label
                    htmlFor="register-email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </Label>
                  <input
                    id="register-email"
                    placeholder="projectmayhem@fc.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    required
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Label
                    htmlFor="register-mobile"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Mobile Number
                  </Label>
                  <input
                    id="register-mobile"
                    placeholder="XXXXX-XXXXX"
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    required
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Label
                    htmlFor="register-password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </Label>
                  <input
                    id="register-password"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    required
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </Label>
                  <input
                    id="confirm-password"
                    placeholder="••••••••"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    required
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-gray-900 focus:ring-gray-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="terms"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    I agree to the{" "}
                    <a href="#" className="text-gray-600 hover:text-gray-800">
                      Terms and Conditions
                    </a>
                  </label>
                </motion.div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <motion.button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 group/btn relative"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  disabled={loading}
                >
                  Sign up →
                  <BottomGradient />
                </motion.button>
              </motion.div>
            </motion.form>
          ) : activeTab === "forgot-password" ? (
            <motion.form
              key="forgot-password"
              className="mt-8 space-y-6"
              onSubmit={handleForgotPasswordSubmit}
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {forgotPasswordError && (
                  <motion.div
                    className="p-3 text-sm text-red-700 bg-red-100 rounded-md"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {forgotPasswordError}
                  </motion.div>
                )}
                {forgotPasswordSuccess && (
                  <motion.div
                    className="p-3 text-sm text-green-700 bg-green-100 rounded-md"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {forgotPasswordSuccess}
                  </motion.div>
                )}

                <motion.div variants={itemVariants}>
                  <LabelInputContainer>
                    <Label
                      htmlFor="forgot-email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email:
                    </Label>
                    <input
                      id="forgot-email"
                      name="email"
                      type="email"
                      required
                      className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </LabelInputContainer>
                </motion.div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <motion.button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 group/btn relative"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                  <BottomGradient />
                </motion.button>
              </motion.div>

              <motion.div variants={itemVariants} className="text-center">
                <button
                  type="button"
                  onClick={() => setActiveTab("login")}
                  className="text-sm font-medium text-gray-600 hover:text-gray-800"
                >
                  Back to Login
                </button>
              </motion.div>
            </motion.form>
          ) : null}
        </AnimatePresence>

        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <motion.button
              onClick={handleGitHubSignIn}
              className="group/btn shadow-input relative flex h-10 flex-1 items-center justify-center space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black hover:bg-gray-100"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="button"
            >
              <IconBrandGithub className="h-4 w-4 text-neutral-800" />
              <span className="text-sm text-neutral-700">GitHub</span>
              <BottomGradient />
            </motion.button>

            <motion.button
              onClick={handleGoogleSignIn}
              className="group/btn shadow-input relative flex h-10 flex-1 items-center justify-center space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black hover:bg-gray-100"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="button"
            >
              <IconBrandGoogle className="h-4 w-4 text-neutral-800" />
              <span className="text-sm text-neutral-700">Google</span>
              <BottomGradient />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-60" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-0 blur-sm transition duration-300 group-hover/btn:opacity-40" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

export default Auth;