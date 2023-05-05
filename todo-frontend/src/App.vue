<template>
  <!-- Main container for the Todo List application -->
  <div id="app">
    <!-- Include the TodoList component -->
    <TodoList />
  </div>
</template>

<script>
// Import the TodoList component
import TodoList from './components/TodoList.vue';

export default {
  name: 'App',
  components: {
    TodoList,
  },
};
</script>
