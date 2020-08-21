<template>
  <div id="dashboard" class="mt-4">
    <div class="row">
      <div class="md-form active-cyan active-cyan-2 mb-3 col-md-6">
        <input class="form-control" type="text" v-model="searchByName" placeholder="Search employees by name" aria-label="Search">
      </div>
      <div class="md-form active-cyan active-cyan-2 mb-3 col-md-6">
        <input class="form-control" type="text" v-model="searchByDepartment" placeholder="Search employees by department" aria-label="Search">
      </div>
    </div>
    <table class="table table-striped">
      <thead>
      <tr>
        <th scope="col" class="mouseCursor" @click="sortById">#</th>
        <th scope="col" class="mouseCursor" @click="sortByName">Name</th>
        <th scope="col">Department</th>
        <th scope="col">Position</th>
        <th scope="col">***</th>
      </tr>
      </thead>
      <tbody>
        <tr v-for="(employee, key) in filterEmployees" v-bind:key="key">
          <td class="font-weight-bold">{{employee.employee_id}}</td>
          <td>{{employee.name}}</td>
          <td>{{employee.dept}}</td>
          <td>{{employee.position}}</td>
          <td>
            <router-link v-bind:to="{name: 'view-employee',
                        params:{employee_id: employee.employee_id}}"
                         class="secondary-content btn btn-outline-dark btn-sm">
              Details
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import db from '../firebase/firebaseInit';
  export default {
    name: 'dashboard',
    data() {
      return {
        employees : [],
        searchByName: '',
        searchByDepartment: '',
        sortByIdOrder: true,
        sortByNameOrder: true
      }
    },
    created () {
      db.collection('employees').orderBy('employee_id').get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const data = {
              'id': doc.id,
              'employee_id': doc.data().employee_id,
              'name': doc.data().name,
              'dept': doc.data().departments[0],
              'position': doc.data().position
            };
            this.employees.push(data);
          })
        })
    },
    computed: {
      filterEmployees: function () {
        return this.employees.filter((employee) => {
          return (employee.name.toLowerCase().match(this.searchByName.toLowerCase())
            && employee.dept.toLowerCase().match(this.searchByDepartment.toLowerCase()));
        })
      }
    },
    methods: {
      sortById() {
        if (this.sortByIdOrder) {
          this.employees.sort((a, b) => a.employee_id > b.employee_id? -1 : 1);
          this.sortByIdOrder = false;
        } else {
          this.employees.sort((a, b) => a.employee_id > b.employee_id? 1 : -1);
          this.sortByIdOrder = true;
        }
      },
      sortByName() {
        if (this.sortByNameOrder) {
          this.employees.sort((a, b) => a.name > b.name? -1 : 1);
          this.sortByNameOrder = false;
        } else {
          this.employees.sort((a, b) => a.name > b.name? 1 : -1);
          this.sortByNameOrder = true;
        }
      }
    }
  }
</script>

<style>
  .active-cyan-2 input.form-control[type=text]:focus:not([readonly]) {
    border-bottom: 1px solid #4dd0e1;
    box-shadow: 0 1px 0 0 #4dd0e1;
  }
  .active-cyan input.form-control[type=text] {
    border-bottom: 1px solid #4dd0e1;
    box-shadow: 0 1px 0 0 #4dd0e1;
  }
  .mouseCursor {
    cursor: s-resize;
  }
</style>