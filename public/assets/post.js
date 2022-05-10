const deleteHander = async (event) => {
  event.preventDefault();

  const URL = window.location.href;
  const postId = URL.split("/").at(-1);

  const response = await fetch(`/api/posts/${postId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    document.location.replace("/");
  } else {
    alert("Failed to delete post");
  }
};

document.querySelector("#delete-post").addEventListener("click", deleteHander);
