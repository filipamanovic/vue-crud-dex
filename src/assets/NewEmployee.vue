<template>
  <form class="mt-4 col-8" @submit.prevent="saveEmployee">
    <h4>Create employee</h4>
    <div class="form-row">
      <div class="form-group col-md-3">
        <label>EmployeeID</label>
        <input type="text" class="form-control"
               v-model="employee.employee_id"
               id="employeeID" required
               pattern="[\d]{1,4}"
               title="Only numbers allowed">
      </div>
      <div class="form-group col-md-5">
        <label>Name</label>
        <input type="text" class="form-control"
               v-model="employee.name"
               pattern="[A-z\dđšžćčĐŠŽĆČ\s]{2,20}"
               title="Only characters and numbers 2 - 20">
      </div>
      <div class="form-group col-md-4">
        <label>Position</label>
        <input type="text" class="form-control"
               v-model="employee.position"
               pattern="[A-z\dđšžćčĐŠŽĆČ\s]{2,30}"
               title="Only characters and numbers 2 - 20">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group col-md-8">
        <label>Email</label>
        <input type="email" class="form-control" v-model="employee.email" required>
      </div>
      <div class="form-group col-md-4">
        <label>Date of Birth</label>
        <input type="date" class="form-control" v-model="employee.dateOfBirth" required>
      </div>
    </div>
    <label >Department</label>
    <div class="form-group" v-for="(form, key) in departmentForm" :key="key + 10">
      <select class="form-control" required @change="onDeptSelect($event, key)" v-model="employee.departments[key]">
        <option v-for="(dept, key) in form" :key="key" :value="dept">{{dept}}</option>
      </select>
    </div>
    <div class="form-row">
      <div class="form-group col-md-6">
        <button
            class="btn btn-outline-info btn-block"
            @click.prevent="addSkill"
            :disabled="employee.skills.length > 4">
          Add Skill
        </button>
      </div>
      <div class="form-group col-md-6" v-if="employee.skills.length > 0">
        <button class="btn btn-outline-warning btn-block"
                @click.prevent="removeSkill">
          Remove skill
        </button>
      </div>
    </div>
    <div class="form-row" v-for="(skill, index) in employee.skills" :key="index">
      <div class="form-group col-md-6">
        <label v-if="index==0">Choose skill</label>
        <select class="form-control" v-model="skill.skillName"
                required
                @change="onSelected($event)"
                @click="onFocus($event)">
          <option v-for="(skillDemo, key) in skills"
                  :key="key"
                  :value="skillDemo.skillName"
                  :disabled="!skillDemo.skillAvailable">
            {{skillDemo.skillName}}</option>
        </select>
      </div>
      <div class="form-group col-md-6">
        <label v-if="index===0">Skill value</label>
        <select class="form-control" v-model="skill.skillValue" required>
          <option v-for="(mark, key) in marks" :key="key" :value="mark.markValue">{{mark.markValue}}</option>
        </select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group col-md-10">
        <button type="submit" class="btn btn-outline-dark btn-block">Create employee</button>
      </div>
      <div class="form-group col-md-2">
        <router-link to="/" class="btn btn-outline-dark btn-block">Back</router-link>
      </div>
    </div>
  </form>
</template>

<script>
  import db from '../firebase/firebaseInit'
  export default {
    name: 'new-employee',
    data() {
      return {
        employee: {
          employee_id: '',
          name: '',
          position: '',
          email: '',
          dateOfBirth: '',
          departments: [],
          skills: []
        },
        skills: [],
        marks: [],
        departments: [],
        tmpArray: [],
        departmentShow: [],
        departmentForm: [],
      }
    },
    created() {
      db.collection('skills').get().then(querysnapshot => querysnapshot.forEach(doc => {
        const data = {
          'skillName': doc.data().skillName,
          'skillAvailable': true
        };
        this.skills.push(data);
      }));
      db.collection('marks').get().then(querysnapshot => querysnapshot.forEach(doc => {
        const data = {
          'markValue': doc.data().markValue
        };
        this.marks.push(data);
      }));
      db.collection('departments').get().then(querysnapshot => querysnapshot.forEach(doc => {
        this.departments.push(doc.data());
        this.departmentShow.push(doc.data().deptName);
      }));
      this.departmentForm.push(this.departmentShow);
    },
    methods: {
      saveEmployee () {
        db.collection('employees').add({
          employee_id: this.employee.employee_id,
          name: this.employee.name,
          position: this.employee.position,
          email: this.employee.email,
          dateOfBirth: this.employee.dateOfBirth,
          skills: this.employee.skills,
          departments: this.employee.departments
        }).then(() => {
          this.$router.push('/')
        }).catch(error => console.log(error))
      },
      addSkill() {
        this.employee.skills.push({skillName: 'Choose skill..', skillValue: 'Skill value..'});
      },
      removeSkill() {
        let skillName = (this.employee.skills.pop().skillName);
        if (skillName !== 'Choose skill..') {
          this.skills.find(s => s.skillName === skillName).skillAvailable = true
        }
      },
      onSelected(event){
        if (this.focusedSkill !== '') {
          this.skills.find(s => s.skillName === this.focusedSkill).skillAvailable = true;
        }
        this.skills.find(s => s.skillName === event.target.value).skillAvailable = false;
      },
      onFocus(event){
        this.focusedSkill = event.target.value;
      },
      onDeptSelect(event, key) {
        if (key === 0) {
          this.tmpArray = this.departments;
          this.tmpArray = this.tmpArray.find(d => d.deptName === event.target.value).subDept;
          let array2 = [];
          if (this.tmpArray.length > 0) {
            array2.length = 0;
            this.tmpArray.forEach(el => {
              array2.push(el.deptName);
            });
            if (this.departmentForm.length > 1) {
              key++;
              this.departmentForm.splice(key, 1, array2);
            } else {
              this.departmentForm.push(array2);
            }
            if (this.departmentForm.length > 2) {
              this.departmentForm.pop();
            }
          }
        } else if (key === 1) {
          let arr3 = [];
          arr3 = this.tmpArray.find(d => d.deptName === event.target.value).subDept;
          if (arr3 !== undefined) {
            let array2 = [];
           arr3.forEach(el => {
             array2.push(el.deptName);
           });
           this.departmentForm.push(array2);
          } else {
            if (this.departmentForm.length > 2) {
              this.departmentForm.pop();
            }
          }
        }
      }
    }
  }
</script>