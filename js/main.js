const API = "http://localhost:8000/input1";
const inp1 = document.querySelector("#inp1");
const inp2 = document.querySelector("#inp2");
const inp3 = document.querySelector("#inp3");
const btn = document.querySelector("#btn1");
const ul = document.querySelector(".task-list");
const btnSaveEdit = document.querySelector(".saveEdit");
const inpEdit = document.querySelector(".inpEdit");
const editModal = document.querySelector(".editModel");

btn.addEventListener("click", () => {
  if (!inp1.value.trim() || !inp2.value.trim() || !inp3.value.trim()) {
    alert("Заполните все поля!");
    return;
  }

  const newContact = {
    name: inp1.value,
    number: inp2.value,
    http: inp3.value,
  };

  createBook(newContact);
  inp1.value = "";
  inp2.value = "";
  inp3.value = "";
});

function createBook(todo) {
  fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(todo),
  }).then(() => readBook());
}

function readBook() {
  fetch(API)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      ul.innerHTML = "";
      data.forEach((elem) => {
        ul.innerHTML += `<li>${elem.name} - ${elem.number} - ${elem.http} <button id=${elem.id} class="btnDelete">Delete</button
        ><button ${elem.id} class="btnEdit">Edit</button></li>`;
      });
    });
}

readBook();

//! Этап удаления
document.addEventListener("click", (e) => {
  let del_class = [...e.target.classList];
  if (del_class.includes("btnDelete")) {
    let delId = e.target.id;
    fetch(`${API}/${delId}`, {
      method: "DELETE",
    }).then(() => readBook());
  }
});

//! Этап редактирования

document.addEventListener("click", (e) => {
  let edit_class = [...e.target.classList];
  if (edit_class.includes("btnEdit")) {
    editModal.style.display = "block";
    let id = e.target.id;
    fetch(`${API}/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        inpEdit.value = data.book;
        btnSaveEdit.setAttribute("id", data.id);
      });
  }
});
btnSaveEdit.addEventListener("click", () => {
  let editTodo = {
    name: inpEdit.value,
    number: inpEdit.value,
    http: inpEdit.value,
  };
  editedBook(editTodo, btnSaveEdit.id);
  editModal.style.display = "none";
});

function editedBook(newTodo, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(newTodo),
  }).then(() => readBook());
}
