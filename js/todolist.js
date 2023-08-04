const addTodoButtonOnClickHandle = () => {
    // spread 문법 (...)
    // const testObj= {
    //     name : "김준일",
    //     age : 10
    // }

    // console.log(testObj);

    // const testObj2 = {
    //     ...testObj,
    //     address : "부산",
    //     name : "김준이"
    // }

    // console.log(testObj2);

    // const testArray = [1,2,3,4,5];
    // console.log(testArray);
    // const testArray2 = [...testArray, 6,7,8]
    // console.log(testArray2)

    generateTodoObj();
    
}

const addTodoOnKeyUpHandle = (event) => {
    if(event.keyCode === 13) {
        generateTodoObj();
    }
}

const checkedOnChangeHandle = (target) => {
    TodoListService.getInstance().setCompleStatus(target.value, target.checked);
}

const modifyTodoOnClickHandle = (target) => {
    openModal();
    modifyModal(TodoListService.getInstance().getTodoById(target.value));
}

const deleteTodoOnClickHandle = (target) => {
    TodoListService.getInstance().removeTodo(target.value);
}

const generateTodoObj = () => {
    const todoContent = document.querySelector(".todolist-header-items .text-input").value;
    const todoObj = {
        id : 0,
        todoContent : todoContent,
        createDate : DateUtills.toStringByFormatting(new Date()),
        completStatus : false
    };
    TodoListService.getInstance().addTodo(todoObj);
}

class TodoListService {
    static #instance = null; 

    static getInstance() {
        if(this.#instance === null) {
            this.#instance = new TodoListService();
        }
        return this.#instance;
    }

    todoList = new Array();
    todoIndex = 1;

    constructor() {
        this.loadTodoList();
    }

    // JSON.parse(제이슨 문자열) : 제이슨 문자열 > 객체로 변환
    // JSON.stinrgify(객체) : 객체 > 제이슨 문자열로 변환

    loadTodoList() {
        this.todoList = !!localStorage.getItem("todoList") ? JSON.parse(localStorage.getItem("todoList")) : new Array() ;
        this.todoIndex = !!this.todoList[this.todoList.length - 1]?.id ? this.todoList[this.todoList.length - 1].id + 1 : 1;
    }

    saveLocalStorage() {
        localStorage.setItem("todoList", JSON.stringify(this.todoList));
    }

    getTodoById(id) {
        // console.log(this.todoList);
        // console.log(this.todoList.filter(todo => todo.id === parseInt(id)));
        // console.log(this.todoList.filter(todo => todo.id === parseInt(id))[0]);

        return this.todoList.filter(todo => todo.id === parseInt(id))[0];
    }

    addTodo(todoObj) {
        const todo = {
            ...todoObj,
            id: this.todoIndex
        }
        this.todoList.push(todo); 

        this.saveLocalStorage();

        this.updateTodoList();

        this.todoIndex++;
    }
    
    setCompleStatus(id, status) {
        this.todoList.forEach((todo, index) => {
            if(todo.id === parseInt(id)) {
                this.todoList[index].completStatus = status;
            }
        });

        this.saveLocalStorage();
    }

    setTodo(todoObj) {
        for(let i = 0; i < this.todoList.length; i++) {
            if(this.todoList[i].id === todoObj.id) {
                this.todoList[i] = todoObj;
                break;
            }
        }

        this.saveLocalStorage();
        this.updateTodoList();
    }

    removeTodo(id) {
        this.todoList = this.todoList.filter(todo => {
            return todo.id !== parseInt(id);
        });

        this.saveLocalStorage();
        this.updateTodoList();
    }


    updateTodoList() { 
        const todolistMainConteiner = document.querySelector(".todolist-main-container");

        todolistMainConteiner.innerHTML = this.todoList.map(todo => {
            return `
                <li class="todolist-items"> <!-- ToDoList 부분 -->
                    <div class="item-left">

                        <input type="checkbox" id="complet-chkbox1${todo.id}" 
                        class="complet-chkboxs" ${todo.completStatus ? "checked" : "" } 
                        value="${todo.id}" onchange="checkedOnChangeHandle(this);">

                        <label for="complet-chkbox1${todo.id}"></label>
                    </div>
                    <div class="item-center">
                        <pre class="todolist-contant">${todo.todoContent}</pre>
                    </div>
                    <div class="item-right">
                        <p class="todolist-dete">${todo.createDate}</p>
                        <div class="todolist-item-buttons">
                            <button class="btn btn-edit" value="${todo.id}" onclick="modifyTodoOnClickHandle(this);">수정</button>
                            <button class="btn btn-remove" value="${todo.id}" onclick="deleteTodoOnClickHandle(this);">삭제</button>
                        </div>
                    </div>
                </li>
            `;            
        }).join("");
    }
}