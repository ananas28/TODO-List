(function(){

  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  };

  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';
    button.setAttribute('disabled', false);

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    // делаем кнопку активной только после введения значения в инпут
    input.addEventListener('input', function(){
      button.removeAttribute('disabled');
      if(!input.value) {
        button.setAttribute('disabled', true);
      } 
    });

    return {
      form,
      input,
      button,
    };
  };

  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list; 
  };

  function createTodoItem (name, done, storageKey) {
    let item = document.createElement('li');
    // кнопки помещаем в элемент, который красиво покажет их в одной группе
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = name;

    if (done) {
      item.classList.add("list-group-item-success");
    }

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    // вкладываем кнопки в отдельный элемент
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    // обработчики на кнопки
    doneButton.addEventListener('click', function(){
      toggleDone(item, storageKey);
    });
  
    deleteButton.addEventListener('click', function(){
      toggleDelete(item, storageKey);
    });

    return {
      item,
      doneButton,
      deleteButton
    };

  };

  // кнопка Готово
  function toggleDone(item, storageKey) {
    item.classList.toggle("list-group-item-success");
    let isDone = item.classList.contains('list-group-item-success');
    let index = itemIndex(item);
    let dataFromStorage = JSON.parse(localStorage.getItem(storageKey));
    dataFromStorage[index].done = isDone;
    localStorage.setItem(storageKey, JSON.stringify(dataFromStorage));
  };

  // Кнопка удалить
  function toggleDelete(item, storageKey) {
    let dataFromStorage = JSON.parse(localStorage.getItem(storageKey));
    if (confirm('Вы уверены?')) {
      item.remove();
      dataFromStorage.splice(dataFromStorage.indexOf(item), 1);
      localStorage.setItem(storageKey, JSON.stringify(dataFromStorage));
    }
  };

  function itemIndex(item) {
    let list = item.parentElement;
    let elements = Array.from(list.children);
    let id = elements.indexOf(item);
    return id;
  };

  function createTodoApp(container, title = 'Список дел', defaultTodos, storageKey) {

    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    let actualData = defaultTodos;
    const storageDataString = localStorage.getItem(storageKey);
    if(storageDataString) {
      actualData = JSON.parse(storageDataString);
    }

    let defaultTodosArr;
    for (let key of actualData) {
      defaultTodosArr = createTodoItem(key['name'], key['done'], storageKey);
      todoList.append(defaultTodosArr.item);
    }

    todoItemForm.form.addEventListener('submit', function(e) {

      e.preventDefault();
   
      // если пользователь ничего не ввел
      if(!todoItemForm.input.value) {
        return;
      }

      let todoItem = createTodoItem(todoItemForm.input.value, false, storageKey);

      // создаем и добавляем в список новое дело с названием из поля для ввода
      todoList.append(todoItem.item);

      actualData.push({
        name: todoItemForm.input.value,
        done: false
      });
      
      todoItemForm.input.value = '';

      // делаем кнопку добавить снова неактивной после создания элемента списка
      todoItemForm.button.setAttribute('disabled', true);

      // добавляем массив объектов в LS
      localStorage.setItem(storageKey, JSON.stringify(actualData));

    });
  }

  window.createTodoApp = createTodoApp;

})();

