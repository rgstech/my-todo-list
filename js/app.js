document.addEventListener( "DOMContentLoaded", function () {

    /*  Script desenvolvido por (developed by): Rodrigo Guimaraes
        Github: github.com/rgstech
        Lista simples de tarefas / Simple TODO-List
        License: GPL V2 */
    

      function clog(vstr) { //shortcut for display info/ função atalho para exibir informações

        if (vstr) 
            console.log(vstr);
        else 
            return;

      }
      // ############ array just for test / array apenas para fins de testes ######################
      //  let ArTasks = [ {  _id: 28,
      //                      desc: 'fazer compras',
      //                      done: false },
      //                   {  _id: 30,
      //                      desc: 'Fechar projeto',
      //                      done: false } ];

      let ArTasks = []; //main local array of tasks/ array local principal (sera salvo o array com alterações no localStorage)
       
      loadTasksDb();

      function loadTasksDb(){

          const json = window.localStorage.getItem("tasks");
          ArTasks = JSON.parse(json) || [];

      }

      function saveTasksDb() {

        window.localStorage.setItem("tasks", JSON.stringify(ArTasks));
      }

      function loadTasks() {
        
        for (let tsk of ArTasks) {
          createCard(tsk);
        }
      
      }

      function clearList() {

        let list = document.querySelector(".list");

        while (list.firstChild) {
          list.firstChild.parentElement.removeChild(list.firstChild);
        }

      }

      function initApp() {

        //inicializa app / eventos
        clearList();
        loadTasks();
        initEvents();
        updateProgressBar();

      }
      

      function initEvents() {

        registerCardEvents();
        registerButtonEvents();

      }


      function genId() {
        
        return Math.round(Math.random() * 100000);

      }


      function addDoneIcon( _id = null ) { //so para adicionar ou nao o icone pronto
          
        if (!_id) { return; }

        let elCard = document.querySelector(`div[_id = '${_id}']`);

        if (!elCard) { return; }    

       let doneIcon     =  elCard.querySelector('img')
       let iconDisplay  =  doneIcon.getAttribute('style');
       let displayValue =  iconDisplay.substring(9, 13); // extract value of display ex: none or block 

            if(  displayValue &&  (displayValue == 'none' ) ) {

              doneIcon.style.display = 'block';
            } else {

              doneIcon.style.display = 'none';
             }
                

       }


      function markCardDone(_id = null) {

        // mark as done or undone
   
        if (!_id) {
          return;
        }

        let elCard = document.querySelector(`div[_id = '${_id}']`);

        if (!elCard) {
          return;
        }

        if (elCard.classList.contains("done")) {

          elCard.classList.remove("done");
          
       

        } else {

          elCard.classList.add("done");

        }

      } 


      function markTaskDone(_id = null) {

        // mark as done or undone
        if (!_id) { return; }

        for (let key of ArTasks.keys()) {

            if (_id == ArTasks[key]._id) {

                if (ArTasks[key].done) {

                    ArTasks[key].done = false;

                } else {

                    ArTasks[key].done = true;

            }
          }
        }

        saveTasksDb();
        updateProgressBar();

      }


      function deleteCard(ev) {
      
        if (ev.target != this){ return; }

        let _id = ev.target.parentNode.getAttribute("_id");
        deleteTask(_id);
        let del_el = document.querySelector(`div[_id='${_id}']`);

        del_el.parentNode.removeChild(del_el);

      }

      function deleteTask(_id) {

        if (!_id) { return; }

        ArTasksTemp = ArTasks.filter((task) => {
          return _id != task._id;
        });

        ArTasks = [];
        ArTasks = [...ArTasksTemp];

        saveTasksDb();
        updateProgressBar();
      }


      function doneTask(ev) {

        if (ev.target != this) { return; } // if its not the parent ignore click event / se nao for o parent node ignora o click

        let taskId = ev.target.getAttribute("_id");

        markTaskDone(taskId);
        markCardDone(taskId);
        addDoneIcon(taskId);

      
      }


      function registerCardEvents() {

        let cards = document.getElementsByClassName("card");

        if (cards.length >= 0) {
          for (let card of cards) {
            card.addEventListener("click", doneTask);
          }
        }

      }


      function registerButtonEvents() {

        
        let buttons_del = document.querySelectorAll(".list .card img");
        if (buttons_del.length > 0) {
          for (let bt_delete of buttons_del) {
            bt_delete.addEventListener("click", deleteCard);
          }

        }

        let bt_add = document.querySelector(".section-form button");

        bt_add.addEventListener("click", addTask);

      
      }


      function createCard(card = {}) {
        //checar se task ja ta completa ou nao para add a classe css
        //check if task is done or not to add the css class

        if (!card) { return; }

    
        let textTask = document.querySelector('.section-form input[type="text"]');

        let list     = document.querySelector(".list"); //adicionar o card criado aqui

        let ncard    = document.createElement("div");

        ncard.classList.add("card");

        ncard.setAttribute("_id", card._id);

        if (card.done) {

          ncard.classList.add("done");

        }

        let closeIcon = document.createElement("img"); 
        closeIcon.src = "img/close.png"; 
        closeIcon.classList.add('img-close');
      
        let nh5 = document.createElement("h5");

        nh5.innerHTML = card.desc;
        
        let doneIcon = document.createElement("img"); 
            doneIcon.src ="img/ok.png";  
            doneIcon.classList.add("img-done");
           
            if(card.done) {
             
             doneIcon.style.display = 'block';
            } else {
              doneIcon.style.display = 'none';
              
            }
            
           
        
        ncard.appendChild(doneIcon);
        
        ncard.appendChild(closeIcon)
        ncard.appendChild(nh5);

        list.appendChild(ncard);

      }


      function createTask(taskDesc = "") {

        let _id = genId();
        let task = { _id: _id, desc: taskDesc, done: false };

        ArTasks.push(task);

        saveTasksDb();
        updateProgressBar();
        return task;

      }

      // addTask() -> createTask() -> createCard() -> loadTasks()
      function addTask(ev) {

        ev.preventDefault();

        let textTask = document.querySelector('.section-form input[type="text"]');

        if (textTask.value == "") {
          alert("insira a descrição da tarefa");
          return;
        }
        let task = createTask(textTask.value);
        createCard(task);

        initApp();
      }


      function updateProgressBar(){

           let total = ArTasks.length;
           let done = ArTasks.filter(tsk => !tsk.done).length;

           let progress =  Math.round((done / total) * 100) || 0;

           let progressBar = document.querySelector('.tasks-progress .progress-bar');
           progressBar.style.width = `${progress}%`;

          let progressValue = document.querySelector('.tasks-progress .progress-value');
          progressValue.textContent =  `${progress}%`;
      }

    

      initApp(); //inicializa aplicação
    }, false ); //end addEventlistener on document
