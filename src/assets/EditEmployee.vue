<template>
  <form class="mt-4 col-8" @submit.prevent="updateEmployee">
    <h4>Edit employee</h4>
    <div class="form-row">
      <div class="form-group col-md-3">
        <label>EmployeeID</label>
        <input type="text" class="form-control"
               id="employeeID" required
               v-model="employee.employee_id"
                disabled>
      </div>
      <div class="form-group col-md-5">
        <label>Name</label>
        <input type="text" class="form-control"
               pattern="[A-z\dđšžćčĐŠŽĆČ\s]{2,20}"
               title="Only characters and numbers 2 - 20"
               v-model="employee.name">
      </div>
      <div class="form-group col-md-4">
        <label>Position</label>
        <input type="text" class="form-control"
               pattern="[A-z\dđšžćčĐŠŽĆČ\s]{2,30}"
               title="Only characters and numbers 2 - 20"
                v-model="employee.position">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group col-md-8">
        <label>Email</label>
        <input type="email" class="form-control" required v-model="employee.email">
      </div>
      <div class="form-group col-md-4">
        <label>Date of Birth</label>
        <input type="date" class="form-control" required v-model="employee.dateOfBirth">
      </div>
    </div>
    <label >Department</label>
    <div class="form-group">
      <div class="form-group" v-for="(form, key) in departmentForm" :key="key">
        <select class="form-control" required @change="onDeptSelect($event, key)" v-model="employee.departments[key]">
          <option v-for="(dept, key) in form" :key="key" :value="dept">{{dept}}</option>
        </select>
      </div>
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
        <button type="submit" class="btn btn-outline-dark btn-block">Edit employee</button>
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
    name: 'edit-employee',
    data() {
      return {
        employee: {
          employee_id: '/',
          name: '',
          position: '',
          email: '',
          dateOfBirth: '',
          skills: [],
          departments: []
        },
        skills: [],
        marks: [],
        departments: [],
        tmpArray: [],
        departmentShow: [],
        departmentForm: [],
        editCheck: true,
      }
    },
    beforeRouteEnter(to, from, next) {
      db.collection('employees').where('employee_id', '==', to.params.employee_id)
        .get().then(querySnapshot => querySnapshot.forEach(doc => { next (vm => {
        vm.employee.employee_id = doc.data().employee_id;
        vm.employee.name = doc.data().name;
        vm.employee.position = doc.data().position;
        vm.employee.email = doc.data().email;
        vm.employee.dateOfBirth = doc.data().dateOfBirth;
        vm.employee.skills = doc.data().skills;
        vm.employee.departments = doc.data().departments;
        })
      }));
    },
    created() {
      db.collection('skills').get().then(querySnapshot => querySnapshot.forEach(doc => {
        const data = {
          'skillName': doc.data().skillName,
          'skillAvailable': true
        };
        this.skills.push(data);
      }));
      db.collection('marks').get().then(querySnapshot => querySnapshot.forEach(doc => {
        const data = {
          'markValue': doc.data().markValue
        };
        this.marks.push(data)
      }));
      db.collection('departments').get().then(querySnapshot => querySnapshot.forEach(doc => {
        this.departments.push(doc.data())
      }));
      db.collection('employees').where('employee_id', '==', this.$router.history.current.params.employee_id)
        .get().then(querySnapshot => querySnapshot.forEach(doc => {
        this.employee.employee_id = doc.data().employee_id;
        this.employee.name = doc.data().name;
        this.employee.position = doc.data().position;
        this.employee.email = doc.data().email;
        this.employee.dateOfBirth = doc.data().dateOfBirth;
        this.employee.skills = doc.data().skills;
        this.employee.departments = doc.data().departments;
        this.updateDepartments(doc.data().departments);
      }));
    },
    methods: {
      updateEmployee() {
        if (this.employee.departments.length > this.departmentForm.length) { this.employee.departments.pop() }
        db.collection('employees').where('employee_id', '==', this.$route.params.employee_id)
          .get().then(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.update({
              name: this.employee.name,
              position: this.employee.position,
              email: this.employee.email,
              dateOfBirth: this.employee.dateOfBirth,
              skills: this.employee.skills,
              departments: this.employee.departments
            }).then(() => {
              this.$router.push({name: 'view-employee',
                params: {employee_id: this.employee.employee_id}})
            })
          })
        })
      },
      addSkill() {
        this.employee.skills.push({skillName: 'Choose skill..', skillValue: 'Skill value..'});
        // console.log(this.skills);
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
        for (let item of this.employee.skills) {
          if (item.skillName !== 'Choose skill..') {
            this.skills.find(s => s.skillName === item.skillName).skillAvailable = false;
          }
        }
      },
      updateDepartments(departments) {
        this.tmpArray = this.departments;
        departments.forEach(dep => {
          let tmpArray = [];
          this.tmpArray.forEach(dep123 => {
            tmpArray.push(dep123.deptName);
          });
          if (this.tmpArray.find(d => d.deptName === dep).subDept !== undefined) {
            this.tmpArray = this.tmpArray.find(d => d.deptName === dep).subDept
          }
          this.departmentForm.push(tmpArray);
        });
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
            this.editCheck = false;
          }
        } else if (key === 1) {
          let arr3 = [];
          if (this.editCheck) {
            this.tmpArray = this.departments;
            this.tmpArray = this.tmpArray.find(d => d.deptName === this.employee.departments[0]).subDept;
          }
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