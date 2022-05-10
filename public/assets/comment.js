const commentFormHandler = async (event) => {
  const body = document.getElementById("comment-post").value.trim();

  const URL = window.location.href;
  const postId = URL.split("/").at(-1);

  if (body) {
    const response = await fetch(`/api/posts/${postId}/comment`, {
      method: "POST",
      body: JSON.stringify({ body }),
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
  .querySelector(".comment-btn")
  .addEventListener("click", commentFormHandler);
