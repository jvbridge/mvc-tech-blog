const postFormHandler = async (event) => {
  console.log("Hit the form handler!");
  event.preventDefault();

  const title = document.getElementById("post-title").value.trim();
  const body = document.getElementById("post-body").value.trim();

  if (title && body) {
    const response = await fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify({ title, body }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      document.location.reload();
    } else {
      alert("failed to post");
    }
  }
};

document
  .querySelector(".post-form")
  .addEventListener("submit", postFormHandler);

document.querySelector(".post-btn").addEventListener("click", postFormHandler);
