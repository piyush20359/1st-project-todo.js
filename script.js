const voice = document.getElementById('mic-Btn');
const input = document.getElementById('task-Input');
const addBtn = document.getElementById('add-Btn');
const taskList = document.getElementById('task-List');
const clearBtn = document.getElementById('clear-Btn');
const empytState = document.getElementById('empty-State');

let tasks = [];
let editingIndex = -1;


function saveTodos() { 
  //Store object in localStorage (convert to JSON string)
  localStorage.setItem('task', JSON.stringify(tasks));
}

function loadTodos() {
    // Retrieve JSON string from localStorage
  const storedTasks = localStorage.getItem('task');
  //
  try {
    if(storedTasks){
     // Convert JSON string back to JavaScript object
     tasks = JSON.parse(storedTasks);
  }
} catch(error) {
    console.error("Error accessing localStorage:", error);
}

  renderTasks();
}

  //displaying or updating items in the DOM
  function renderTasks() {
    //clear the task list before re-rendering
    taskList.innerHTML = '';
      tasks.forEach((value, index) => {
        const li = document.createElement("li");

        //create element = CHECKBOX
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkbox';
        checkbox.addEventListener('change', () => {
          li.classList.toggle('completed', checkbox.checked);
          if(checkbox.checked) {
          span.style.textDecoration = 'line-through';
          span.style.textDecorationThickness = '1.5px';
          span.style.textDecorationColor ='rgb(13, 40, 62)';
          } 
          else {
            span.style.textDecoration = 'none';
          }
          TasksCounter();
        });

        // Task text
        const span = document.createElement('span');
        span.className = 'span';
        span.textContent = value;
        
        
        const btnGroup = document.createElement('div');
        btnGroup.className = 'btnGroup';
        // create new DELETE button element.
        const delBtn = document.createElement('button');
        delBtn.className = 'delete';  // assign a class for identification 
        delBtn.textContent = 'Delete'; // set the button text

        delBtn.addEventListener('click', () => {
          tasks.splice(index, 1); //JS array method that lets you add or remove items from an array at a specific position.
          renderTasks(); // re-render the taskList
          saveTodos();
          TasksCounter();
        });

        const editBtn = editTasks(span, li, index)
        li.appendChild(checkbox);
        li.appendChild(span);
        btnGroup.appendChild(editBtn);
        btnGroup.appendChild(delBtn);
        li.appendChild(btnGroup);
        taskList.appendChild(li);    
      });
      
        if(!(tasks.length === 0)) {
          empytState.style.display = 'none';
        } else {
          empytState.style.display = 'block';
        }
        TasksCounter();
  } 

  //VOICE BUTTON
   
    const SpeechRecognition =  window.SpeechRecognition || window.webkitSpeechRecignition;
    const recognition = new SpeechRecognition();
    console.log(recognition);
      if(recognition){
        recognition.lang = 'en-US' //change language if needed.
        recognition.continuous = true;
        recognition.maxAlternatives = 1;
        recognition.interimResults = false;
      }

      voice.onclick = () => {
         console.log('Listening...');
         recognition.start();
        
          
         recognition.onresult = (event) => {
          const transcript = event.results[event.results.length - 1][0].transcript;
          input.value = transcript;
          console.log(transcript);
          addBtn.click();
        }
      }

  function editTasks(span, li, index) {
      //create new Edit Button element.
      const editBtn = document.createElement('button');
      let editInput = document.createElement('input');
      editInput.className = 'editInput';
      editBtn.className = 'edit';
      editBtn.textContent = 'Edit';
        
      editBtn.addEventListener('click', () => {         
        editInput.value = span.textContent;
        span.style.display = 'none';
        editingIndex = index;
        editInput.focus();
        // li.appendChild(editInput);
        li.insertBefore(editInput, span);
      });

      editInput.addEventListener('keypress', (event) => {
        if(event.key === 'Enter') {
          // tasks.text = input.value;  {tasks is an array, not an object so no .text}
           tasks[editingIndex] = editInput.value;
          saveTodos();
          editingIndex = -1;
          renderTasks();
        }
      });

      return editBtn;
  }

  // Enter keypress logic
  input.addEventListener('keypress', (event) => {
    if(event.key === 'Enter') {
    const newTask = input.value.trim();
    if(newTask) {
      tasks.push(newTask);
      input.value=''; //value to empty string
      input.focus(); //focus back on input
      saveTodos();
      renderTasks();
      TasksCounter();
    }
  }
  });
 
  // addBtn click logic
  addBtn.addEventListener('click', () => {
    const newTask = input.value.trim();
    if(newTask) {
      tasks.push(newTask);
      input.value=''; //value to empty string
      input.focus(); //focus back on input
      saveTodos();
      renderTasks();
      TasksCounter();
    }
  });

  function TasksCounter() {
    const total = document.querySelector('.Total-tasks');
    const complete = document.querySelector('.Complete-tasks');

    // Total Tasks
    total.textContent = `Total: ${tasks.length}`;
    //get checked count and display it.
    const checkedCount = document.querySelectorAll('input[type="checkbox"]:checked').length;
    complete.textContent = `Complete: ${checkedCount}`;
  }

  function clearAll() {
    tasks = [];
  }
    clearBtn.addEventListener('click', () => {
      localStorage.clear();
      clearAll();
      renderTasks();
      TasksCounter();
    })

  loadTodos();
