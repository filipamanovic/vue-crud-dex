<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <router-link to="/" class="navbar-brand">Employee manager</router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse"
              data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link v-bind:to="{name: 'new-employee'}"
                         class="nav-link">
              Create employee
            </router-link>
          </li>
          <li class="nav-item active">
            <router-link v-bind:to="{name: 'manage-departments'}"
                         class="nav-link">
              Manage departments
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

