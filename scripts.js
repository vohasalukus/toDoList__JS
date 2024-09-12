const domain = 'https://test.ai-softdev.com'
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyODQiLCJleHAiOjE3MjYxOTkxMDV9.wFOzsnGoaftj98huO_foyN8y5mP6Q0Yh-bnU8eGrYkc"
// возможно на момент проверки, Токен неактуален

const GetBooks = async () => {
    try{
        const response = await axios.get(`${domain}/tasks/`, {
            headers:{
                Authorization: token
            }
        })
        // console.log(response, 'res')
        RenderBooks(response.data.data)
        // console.log(response.data)
    } catch (err) {
        console.log(err, 'Ошибка!')
    }
}

const RenderBooks = (books) => {
    const container = document.getElementById('container');
    container.innerHTML = books.map(book => {
        return `
            <li id="task-${book.id}" class="${book.done ? 'completed' : 'not-completed'}">
                <div class="task-content">
                    <h3>Name: ${book.title}</h3>
                    <p>Desc: ${book.description}</p>
                    <p>Created at: ${book.created_at}</p>
                </div>
                
                <div class="task-buttons">
                    <button class="edit-btn" onclick="toggleEditForm(${book.id})"></button>
                    <button class="delete-btn" onclick="deleteTask(${book.id})"></button>
                    <button class="complete-btn" id="complete-btn-${book.id}" onclick="toggleTaskCompletion(${book.id})" ${book.done ? 'disabled' : ''}></button>
                </div>
                <div id="edit-form-${book.id}" class="edit-form">
                    <input type="text" id="edit-title-${book.id}" value="${book.title}" placeholder="Edit Title">
                    <input type="text" id="edit-desc-${book.id}" value="${book.description}" placeholder="Edit Description">
                    <button class="form-btn" onclick="editBook(${book.id})">Save</button>
                </div>
                <hr>
            </li>
        `;
    }).join('');
};



const toggleEditForm = (taskId) => {
    const form = document.getElementById(`edit-form-${taskId}`)
    if (form.classList.contains('open')) {
        form.classList.remove('open')
        form.style.maxHeight = null
    } else {
        form.classList.add('open')
        form.style.maxHeight = form.scrollHeight + 'px'
    }
}

const editBook = async (id) => {
    const newTitle = document.getElementById(`edit-title-${id}`).value
    const newDescription = document.getElementById(`edit-desc-${id}`).value

    const data = {
        title: newTitle,
        description: newDescription
    }

    try {
         await axios.put(`${domain}/tasks/${id}/`, data, {
            headers: {
                Authorization: token
            }
        })
        alert('Task updated')
        GetBooks()
    } catch (err) {
        console.log(err, 'err!')
        alert('ERR!!')
    }
}



const deleteTask = async (id) => {
    try{

        await axios.delete(`${domain}/tasks/${id}`, {
            headers: {
                Authorization: token
            }
        })
        GetBooks()

    } catch (err) {
        console.log(err, 'err!')
    }


}
const toggleTaskCompletion = async (id) => {
    const taskElement = document.getElementById(`task-${id}`)

    try {
        await axios.patch(`${domain}/tasks/done/${id}/`, {}, {
            headers: {
                Authorization: token
            }
        })

        taskElement.classList.remove('not-completed')
        taskElement.classList.add('completed')
        GetBooks()

    } catch (err) {
        console.log(err, 'Ошибка при пометке задачи!')
        alert('Ошибка при выполнении задачи')
    }
}



const createTask = async () => {
    const title = document.getElementById('title').value
    const description = document.getElementById('desc').value

    const data = {
        title,
        description
    }

    try{
        if (title.trim() && description.trim()){
            await axios.post(`${domain}/tasks/`, data, {
                headers: {
                    Authorization: token
                }
            })
            alert('Task created')
            GetBooks()
    } else{
            alert('eban')
        }

    } catch (err) {
        console.log(err, 'err!')
        alert('ERR!!')
    }

}


GetBooks()
