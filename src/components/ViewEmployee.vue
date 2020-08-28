<template>
  <div class="row mt-4">
    <div class="col-md-6 img">
      <img src="http://www.terapanthbangalore.org/siteimages/employee_default.png"
           alt="" class="img-rounded" style="height: 270px; width: auto">
    </div>
    <div class="col-md-6 details">
      <blockquote>
        <h5>{{name}}</h5>
        <small><cite title="Source Title">{{position}}  <i class="icon-map-marker"></i></cite></small>
      </blockquote>
      <blockquote>
        <small class="font-weight-bold font-italic">Departments:</small>
        <small v-for="(dep, key) in dept" :key="key"><cite title="Source Title">{{dep}},<i class="icon-map-marker"></i></cite></small>
      </blockquote>
      <p>
        {{email}} <br>
        www.bootsnipp.com <br>
        {{dateOfBirth}}
      </p>
      <h5>Skills:</h5>
      <div class="progress mt-2" v-for="(skil, key) in skills" :key="key">
        <div class="progress-bar progress-bar-striped progress-bar-animated bg-info"
             role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"
             :style="'width:' + skil.skillValue * 20 +'%'">{{skil.skillName}}
        </div>
      </div>
      <div class="mt-4">
        <hr>
        <router-link v-bind:to="{name: 'edit-employee', params: {employee_id: employee_id}}"
                     class="btn btn-outline-dark btn-sm">
          Edit
        </router-link>
        <button class="btn btn-outline-dark btn-sm ml-2" @click="deleteEmployee">Delete</button>
        <router-link to="/" class="btn btn-outline-dark btn-sm ml-2">Back</router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import db from '../firebase/firebaseInit'
  export default {
    name: 'view-employee',
    data() {
      return {
        employee_id: "/",
        name: null,
        dept: null,
        position: null,
        skills: null,
        email: null,
        dateOfBirth: null
      }
    },
    beforeRouteEnter(to, from, next) {
      db.collection('employees').where('employee_id', '==', to.params.employee_id)
        .get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          next(vm => {
            vm.employee_id = doc.data().employee_id;
            vm.name = doc.data().name;
            vm.dept = doc.data().departments;
            vm.position = doc.data().position;
            vm.skills = doc.data().skills;
            vm.email = doc.data().email;
            vm.dateOfBirth = doc.data().dateOfBirth;
          })
        })
      })
    },
    watch: {
      '$router': 'fetchData'
    },
    methods: {
      fetchData () {
        db.collection('employees').where('employee_id', '==', this.$route.params.employee_id)
          .get().then(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.employee_id = doc.data().employee_id;
            this.name = doc.data().name;
            this.dept = doc.data().dept;
            this.position = doc.data().position;
          })
        })
      },
      deleteEmployee() {
        if (confirm('Are you sure?')) {
          db.collection('employees').where('employee_id', '==', this.$route.params.employee_id)
            .get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
              doc.ref.delete();
              this.$router.push('/');
            })
          })
        }
      }
    }
  }
</script>

<style>
  .container .img{
    text-align:center;
  }
  .container .details{
    border-left:3px solid #ded4da;
  }
  .container .details p{
    font-size:15px;
    font-weight:bold;
  }
</style>