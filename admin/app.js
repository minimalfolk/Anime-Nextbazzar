let token = localStorage.getItem("gh_token");

// TEMP login (we will upgrade to OAuth later)
if (!token) {
  token = prompt("Enter GitHub Token:");
  localStorage.setItem("gh_token", token);
}

async function loadFiles() {
  const url = `https://api.github.com/repos/${config.repo}/contents/${config.folder}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `token ${token}`
    }
  });

  const files = await res.json();

  let html = "";

  files.forEach(file => {
    html += `<div onclick="openFile('${file.path}')">${file.name}</div>`;
  });

  document.getElementById("fileList").innerHTML = html;
}

async function openFile(path) {
  const url = `https://api.github.com/repos/${config.repo}/contents/${path}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `token ${token}`
    }
  });

  const data = await res.json();
  const content = atob(data.content);

  document.getElementById("fileName").value = path;
  document.getElementById("content").value = content;
}

async function saveFile() {
  const path = document.getElementById("fileName").value;
  const content = document.getElementById("content").value;

  const url = `https://api.github.com/repos/${config.repo}/contents/${path}`;

  // Get current file sha first
  const getRes = await fetch(url, {
    headers: {
      Authorization: `token ${token}`
    }
  });

  const fileData = await getRes.json();

  const body = {
    message: "Update via PagesCMS",
    content: btoa(content),
    sha: fileData.sha
  };

  await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  alert("Saved successfully!");
  loadFiles();
}

loadFiles();
