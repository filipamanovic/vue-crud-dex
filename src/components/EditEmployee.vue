<template>
  <form class="mt-4 col-8" @submit.prevent="updateEmployee" enctype="multipart/form-data">
    <h4>{{(isEdit)? 'Edit' : 'Create'}} employee</h4>
    <div class="alert alert-warning" role="alert" v-if="userIdTaken">
      {{this.errorMessage}}
    </div>
    <div class="form-row">
      <div class="form-group col-md-3">
        <label>EmployeeID</label>
        <input type="text" class="form-control"
               id="employeeID" required
               v-model="employee.employee_id"
               :disabled="isEdit"
               @change="checkID">
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

    <div class="form-row">
      <div class="form-group col-md-8">
        <label >Department</label>
        <div class="form-group" v-for="(form, key) in departmentForm" :key="key">
          <select class="form-control" required @change="onDeptSelect($event, key)" v-model="employee.departments[key]">
            <option v-for="(dept, key) in form" :key="key" :value="dept">{{dept}}</option>
          </select>
        </div>
      </div>
      <div class="form-group col-md-4">
        <label>Image</label>
        <input type="file" class="form-control-file" @change="onFileSelected">
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
        <div class="row">
          <div class="col-md-10">
            <label v-if="index===0">Skill value</label>
            <select class="form-control" v-model="skill.skillValue" required>
              <option v-for="(mark, key) in marks" :key="key" :value="mark.markValue">{{mark.markValue}}</option>
            </select>
          </div>
          <div class="col-md-2">
            <label v-if="index===0">Remove</label>
            <i class="fa fa-trash" aria-hidden="true" @click="removeSkillNew(index)"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group col-md-10">
        <button type="submit" :disabled="userIdTaken" class="btn btn-outline-dark btn-block">{{isEdit? 'Edit' : 'Create'}} employee</button>
      </div>
      <div class="form-group col-md-2">
        <router-link :to="isEdit? '/' + employee.employee_id: '/'" class="btn btn-outline-dark btn-block">Back</router-link>
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
          employee_id: '',
          name: '',
          position: '',
          email: '',
          dateOfBirth: '',
          skills: [],
          departments: [],
          imagePath: ''
        },
        selectedFile: null,
        skills: [],
        marks: [],
        departments: [],
        tmpArray: [],
        departmentShow: [],
        departmentForm: [],
        currentDepartments: [],
        selectedKeys: [],
        editCheck: true,
        isEdit: false,
        userIdTaken: false,
        errorMessage: ''
      }
    },
    created() {
      if (this.$router.history.current.params.employee_id !== undefined){
        this.isEdit = true;
      }
      db.firestore().collection('skills').get().then(querySnapshot => querySnapshot.forEach(doc => {
        const data = {
          'skillName': doc.data().skillName,
          'skillAvailable': true
        };
        this.skills.push(data);
      }));
      db.firestore().collection('marks').get().then(querySnapshot => querySnapshot.forEach(doc => {
        const data = {
          'markValue': doc.data().markValue
        };
        this.marks.push(data)
      }));
      db.firestore().collection('departments').get().then(querySnapshot => querySnapshot.forEach(doc => {
        this.departments.push(doc.data());
        this.currentDepartments.push(doc.data());
        if (!this.isEdit) {
          this.departmentShow.push(doc.data().deptName);
        }
      }));
      if (!this.isEdit) {
        this.departmentForm.push(this.departmentShow);
      }
      if (this.isEdit) {
        db.firestore().collection('employees').where('employee_id', '==', this.$router.history.current.params.employee_id)
          .get().then(querySnapshot => querySnapshot.forEach(doc => {
          this.employee.employee_id = doc.data().employee_id;
          this.employee.name = doc.data().name;
          this.employee.position = doc.data().position;
          this.employee.email = doc.data().email;
          this.employee.dateOfBirth = doc.data().dateOfBirth;
          this.employee.skills = doc.data().skills;
          this.employee.departments = doc.data().departments;
          this.updateDepartments(doc.data().departments);
          this.employee.imagePath = doc.data().imagePath;
        }));
      }
    },
    watch: {
      $route (to) {
        if (to.name === 'new-employee') {
          this.employee.employee_id = '';
          this.employee.name = '';
          this.employee.email = '';
          this.employee.position = '';
          this.employee.dateOfBirth = '';
          this.employee.departments = [];
          this.employee.skills = [];
          this.isEdit = false;
          this.employee.imagePath = '';
          this.selectedFile = null;
          if (this.departmentForm.length > 1) {
            this.departmentForm.length = 1;
          }
        }
      }
    },
    methods: {
      updateEmployee() {
        if (this.isEdit) {
          if (this.employee.departments.length > this.departmentForm.length) {
            this.employee.departments.pop()
          }
          if (this.selectedFile != null) {
            if (this.employee.imagePath !== undefined) {
              db.storage().refFromURL(this.employee.imagePath).delete();
            }
            const storageRef = db.storage().ref(`image/${this.selectedFile.name + Date.now()}`).put(this.selectedFile);
            storageRef.on(`state_changed`, () => {
                // path = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
              }, error => {
                console.log(error.message)
              },
              () => {
                this.selectedFile = 100;
                storageRef.snapshot.ref.getDownloadURL().then((url) => {
                  this.employee.imagePath = url;
                  db.firestore().collection('employees').where('employee_id', '==', this.$route.params.employee_id)
                    .get().then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                      doc.ref.update({
                        name: this.employee.name,
                        position: this.employee.position,
                        email: this.employee.email,
                        dateOfBirth: this.employee.dateOfBirth,
                        skills: this.employee.skills,
                        departments: this.employee.departments,
                        imagePath: this.employee.imagePath
                      }).then(() => {
                        this.$router.push({
                          name: 'view-employee',
                          params: {employee_id: this.employee.employee_id}
                        })
                      })
                    })
                  })
                });
              }
            );
          } else {
            db.firestore().collection('employees').where('employee_id', '==', this.$route.params.employee_id)
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
                  this.$router.push({
                    name: 'view-employee',
                    params: {employee_id: this.employee.employee_id}
                  })
                })
              })
            })
          }
        } else {
          if (this.selectedFile !== null) {
            const storageRef = db.storage().ref(`image/${this.selectedFile.name + Date.now()}`).put(this.selectedFile);
            storageRef.on(`state_changed`, () => {
                // path = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
              }, error => {
                console.log(error.message)
              },
              () => {
                this.selectedFile = 100;
                storageRef.snapshot.ref.getDownloadURL().then((url) => {
                  this.employee.imagePath = url;
                  db.firestore().collection('employees').add({
                    employee_id: this.employee.employee_id,
                    name: this.employee.name,
                    position: this.employee.position,
                    email: this.employee.email,
                    dateOfBirth: this.employee.dateOfBirth,
                    skills: this.employee.skills,
                    departments: this.employee.departments,
                    imagePath: this.employee.imagePath
                  }).then(() => {
                    this.$router.push('/')
                  }).catch(error => console.log(error));
                  this.userIdTaken = false;
                  this.errorMessage = '';
                  this.selectedFile = null;
                });
              }
            );
          } else {
            db.firestore().collection('employees').add({
              employee_id: this.employee.employee_id,
              name: this.employee.name,
              position: this.employee.position,
              email: this.employee.email,
              dateOfBirth: this.employee.dateOfBirth,
              skills: this.employee.skills,
              departments: this.employee.departments,
            }).then(() => {
              this.$router.push('/')
            }).catch(error => console.log(error));
            this.userIdTaken = false;
            this.errorMessage = '';
          }
        }
      },
      checkID() {
        if (this.employee.employee_id !== '') {
          db.firestore().collection('employees').where("employee_id", "==", this.employee.employee_id).get().then(
            qs => {
              if (qs.empty) {
                this.userIdTaken = false;
                this.errorMessage = "";
              } else {
                this.userIdTaken = true;
                this.errorMessage = "EmployeeID already taken, please choose another!";
              }
            })
        } else {
          this.userIdTaken = true;
          this.errorMessage = "EmployeeID is required!";
        }
      },
      onFileSelected(event) {
        this.selectedFile = event.target.files[0];
        const availableTypes = ['image/jpeg', 'image/jpg', 'image/gif', 'image/png'];
        if (this.selectedFile && (this.selectedFile.size > 3000000 || !availableTypes.includes(this.selectedFile.type))) {
          this.userIdTaken = true;
          this.errorMessage = "Only allowed jpeg, jpg, gif and png, max size 3mb"
        } else {
          this.userIdTaken = false;
          this.errorMessage = "";
        }
      },
      addSkill() {
        this.employee.skills.push({skillName: 'Choose skill..', skillValue: 'Skill value..'});
      },
      removeSkillNew(index){
        let skillName = this.employee.skills[index].skillName;
        this.employee.skills.splice(index, 1);
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
          this.tmpArray.forEach((dep123, index) => {
            tmpArray.push(dep123.deptName);
            if (dep123.deptName === dep) {
              this.selectedKeys.push(index);
            }
          });
          if (this.tmpArray.find(d => d.deptName === dep) !== undefined && this.tmpArray.find(d => d.deptName === dep).subDept !== undefined) {
            this.tmpArray = this.tmpArray.find(d => d.deptName === dep).subDept
          }
          this.departmentForm.push(tmpArray);
        });
      },
      onDeptSelect(event, key) {
        this.currentDepartments = {...this.departments};
        if (this.departmentForm.length < key + 2) {
          if (this.selectedKeys.length === key + 1){
            this.selectedKeys.pop();
            this.selectedKeys.push(event.target.selectedIndex);
          } else {
            this.selectedKeys.push(event.target.selectedIndex);
          }
          this.selectedKeys.forEach(selKey => {
            this.currentDepartments = this.currentDepartments[selKey].subDept
          });
          if (this.currentDepartments.length > 0) {
            let subNames = this.currentDepartments.map(cd => cd.deptName);
            this.departmentForm.push(subNames);
          }
        } else if (this.departmentForm.length === key + 2) {
          this.selectedKeys.splice(key, this.selectedKeys.length, event.target.selectedIndex);
          this.selectedKeys.forEach(selKey => {
            this.currentDepartments = this.currentDepartments[selKey].subDept
          });
          if (this.currentDepartments.length > 0) {
            let subNames = this.currentDepartments.map(cd => cd.deptName);
            this.departmentForm.pop();
            this.departmentForm.push(subNames);
          } else {
            this.departmentForm.pop();
          }
        } else {
          this.selectedKeys.splice(key, this.selectedKeys.length, event.target.selectedIndex);
          let to = this.departmentForm.length + 1;
          for (let x = key + 2; x < to; x ++) {
            this.departmentForm.pop();
          }
          this.selectedKeys.forEach(selKey => {
            this.currentDepartments = this.currentDepartments[selKey].subDept
          });
          if (this.currentDepartments.length > 0) {
            let subNames = this.currentDepartments.map(cd => cd.deptName);
            this.departmentForm.push(subNames);
          }
        }
      }
    }
  }
</script>