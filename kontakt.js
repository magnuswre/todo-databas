const form = document.querySelector('#form')
const todoLista = document.querySelector('#anvandarlista') 
let tabortModal = document.querySelector('.osynlig_modal')
let textStyle = document.querySelector('.textStyle')
let okBtn = document.querySelector('.okBtn')

const BASE_URL = 'http://localhost:3000/posts/' 

const todos = [] 

// GET //
const getTodos = () => { 
fetch(BASE_URL) 
.then(res => res.json()) 
.then(data => { 
    data.forEach(toDo => { 
    todos.push(toDo)
    });
   listaTodos() 
})
}
getTodos()  



const listaTodos = () => {  
   reverseLista = todos.reverse()
  // sliceLista = todos.slice(0, 7) // visar endast de sju senaste "posterna"
  todoLista.innerHTML = '' 
  reverseLista.forEach(todoCase => { 
  const todoElement = skapaAnvandareElement(todoCase) 
   todoLista.appendChild(todoElement) 
   })
  
}

const skapaAnvandareElement = (todo) => { 
  let todoItem = document.createElement('div') 
  todoItem.classList.add('todoItem')

  let title = document.createElement('p')
  title.classList.add('todo_title')
  title.innerText = todo.title  

  let status = document.createElement('p')
  status.classList.add('todo_status')
  status.innerText =  todo.completed
  if(status.textContent === "true"){
    status.innerText = "KLAR"
    todoItem.classList.add('todoItemKlar')
  } else if(status.textContent === "false"){
    status.innerText = "EJ KLAR"

    todoItem.classList.add('todoItem')
  }

  
// DELETE

 let deleteknapp = document.createElement('button')
  deleteknapp.classList.add('deleteKnapp')
  deleteknapp.innerText = "ta bort"

  deleteknapp.addEventListener('click', () =>{
    const errorMessage = document.querySelector('.errorMessage')
        errorMessage.innerText = ""
    
   if(!todo.completed){

    tabortModal.classList.remove('osynlig_modal')
    textStyle.classList.add('textStyle')
    
    okBtn.addEventListener('click', () =>{
      tabortModal.classList.add('osynlig_modal')
    })
     
      
    } else if(todo.completed) {

     
     fetch(BASE_URL + todo.id, {
      method: 'DELETE'
    })
    .then(res => {
      if(res.ok){
        todoLista.removeChild(todoItem)
      } else {
        console.log('nåt e fel')
      }
    })
  }
})  
// PATCH
   
  let andraknapp = document.createElement('button')
  andraknapp.classList.add('andraKnapp')
  andraknapp.innerText = "ändra status"


    
  andraknapp.addEventListener('click', (e) =>{
    e.preventDefault()
    const errorMessage = document.querySelector('.errorMessage')
        errorMessage.innerText = ""
    

    fetch(BASE_URL + todo.id, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({completed:!todo.completed})      

    })
    .then(res => {
      return res.json()
    
    })
    .then(data => {
      console.log(data)
      todo.completed = data.completed // ändrar på värdet 
      if(todo.completed){
          andraknapp.innerText = "Ändra till ej Klar"
          todoItem.classList.add('todoItemKlar')
          status.innerText = "KLAR"
        } else {
          andraknapp.innerText = "Ändra till Klar"
          todoItem.classList.remove('todoItemKlar')
          status.innerText = "EJ KLAR"
        }
    })
  }); 
  
  todoItem.appendChild(title)  
  todoItem.appendChild(status)
  todoItem.appendChild(deleteknapp)
  todoItem.appendChild(andraknapp)

  
  
  return todoItem 
  
}

// POST // 

form.addEventListener('submit', e => { 
  e.preventDefault()
  let nyttItem = document.querySelector('#user-item').value
  
   if(nyttItem.trim().length == " "){
        const errorMessage = document.querySelector('.errorMessage')
        errorMessage.innerText = "fel, du måste ange ett ärende"
    } else {
      const errorMessage = document.querySelector('.errorMessage')
      errorMessage.innerText = ""

       fetch(BASE_URL, {
        method: 'POST',
        body: JSON.stringify({
          title: nyttItem,
          completed: false,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          todos.unshift(data)
          listaTodos()
          } 
        );
      }
    
    form.reset()
  })


 
  
      
    