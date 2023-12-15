/*
  Implement a class `Todo` having below methods
    - add(todo): adds todo to list of todos
    - remove(indexOfTodo): remove todo from list of todos
    - update(index, updatedTodo): update todo at given index
    - getAll: returns all todos
    - get(indexOfTodo): returns todo at given index
    - clear: deletes all todos

  Once you've implemented the logic, test your code by running
*/

class Todo {
    constructor(){
        this.todoList = [];
    }
    add(todo){
        this.todoList.push(todo);
    }
    remove(indexOfTodo){
        if(this.checkInIndex(indexOfTodo)){
            this.todoList.splice(indexOfTodo, 1);
        }
    }
    update(index, updateTodo){
        if(this.checkInIndex(index)){
            this.todoList[index] = updateTodo;
        }
    }
    getAll(){
        return this.todoList;
    }
    get(indexOfTodo){
        if(this.checkInIndex(indexOfTodo)){
            return this.todoList[indexOfTodo];
        }
        return null;
    }
    clear(){
        this.todoList = [];
    }
    checkInIndex(index){
        return index >= 0 && index < this.todoList.length;
    }
}

module.exports = Todo;
