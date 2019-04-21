jQuery(function ($) {

  var ENTER_KEY = 13;

	var util = {
		uuid: function () {
			var i, random;
			var uuid = '';

			for (i = 0; i < 32; i++) {
				random = Math.random() * 16 | 0;
				if (i === 8 || i === 12 || i === 16 || i === 20) {
					uuid += '-';
				}
				uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
			}

			return uuid;
		},
		store: function (namespace, data) {
			if (arguments.length > 1) {
				return localStorage.setItem(namespace, JSON.stringify(data));
      } 
      else {
				var store = localStorage.getItem(namespace);
				return (store && JSON.parse(store)) || [];
			}
		}
  };
  
  var App = {
    init: function(){
      this.todos = util.store('todo-list');
      this.todoTemplate = Handlebars.compile($('#todo-template-beast7').html());
      this.bindEvents(); 
      this.render();
    },

    bindEvents: function(){
      $('.new-todo').on('keyup', this.create.bind(this));
      $('.todo-list')
        .on('change', '.toggle', this.toggle.bind(this))
        .on('click', '.destroy', this.destroy.bind(this))
        .on('click', '.add-nested', this.addNested.bind(this))
        .on('focusout', '.todo-title', this.edit.bind(this));
    }, 

    templateTodos: function(todos){
      $('.todo-list').html("");
      for(i=0;i<todos.length;i++){
        var todo = todos[i];
        if(todo.parent===null){
          $('.todo-list').append(this.todoTemplate(todo)); 
        }
        else{
          var targetUl = $("[data-id='ul-"+todo.parent+"']")
          targetUl.append(this.todoTemplate(todo));
        }
      }
    },

    render: function(){
      var todos = this.todos; 
      this.templateTodos.call(this,todos);  
      $('.main').toggle(todos.length > 0);
      $('.new-todo').focus();
      util.store('todo-list', this.todos);
    }, 

    getIndexFromEl:function(el){
      var id = $(el).closest('li').data('id'); 
      var todos = this.todos; 
      var i = todos.length; 

      while(i--){
        if(todos[i].id===id){
          return i; 
        }
      }
    }, 

    create: function(e){
      var $input = $(e.target); 
      var val = $input.val().trim();

      if (e.which !== ENTER_KEY || !val){
        return; 
      }

      this.todos.push({
        id: util.uuid(), 
        title: val,
        completed: false,
        parent: null
      }); 

      $input.val('');

      this.render(); 
    },

    addNested: function(e){
      var parentId = $(e.target).closest('li').data('id');
      var newNestedTodo = {
        id: util.uuid(), 
        title: "",
        completed: false,
        parent: parentId 
      }; 
      this.todos.push(newNestedTodo);
      this.render(); 
      $("[data-id='title-"+newNestedTodo.id+"']").focus(); 
    },

    edit: function(e){
      var el = e.target;
			var $el = $(el);
      var val = $el.val().trim();
      this.todos[this.getIndexFromEl(el)].title = val; 
      this.render(); // this is really just to get focus on new-todo again
    },

    toggle: function(e){
      var i = this.getIndexFromEl(e.target);
			this.todos[i].completed = !this.todos[i].completed;
			this.render();
    },

		destroy: function (e) {
			this.todos.splice(this.getIndexFromEl(e.target), 1);
			this.render();
		}

  }; 

  App.init(); 
}); 
