document
  .getElementById("logoutButton")
  .addEventListener("click", async function () {
    try {
      // Make a call to your /logout endpoint if you want to invalidate the session on the server
      await fetch("http://localhost:8080/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Send the token if necessary
        },
      });

      // Remove token from localStorage
      localStorage.removeItem("token");

      // Redirect to login page
      window.location.href = "login.html";
    } catch (error) {
      console.error("Error during logout:", error);
    }
  });
