<template>
  <div>
    <div class="list-group list-group-root well col-md-10 mt-4">
      <div class="row mb-2">
        <div class="col-md-4">
          <button class="btn btn-outline-dark btn-block"
                  @click="function() {
                    newDepartment = !newDepartment;
                    newDepartmentObj.deptName = '';
                    editDepartmentCon = false;
                    addDepartmentCon = false;
                    addMsg = '/root';
                    addDepartmentCon = false;
                    editSubDepartmentCon = false;
                    addSubDepartmentCon = false;
                    editSubSubDepartmentCon = false;
                  }">
            {{newDepartment? "Cancel" : "Add new"}}
          </button>
        </div>
        <form class="col-md-8" @submit.prevent="addNewDepartment" v-if="newDepartment">
          <div class="row">
            <div class="col-md-9">
              <input type="text" class="form-control" v-model="newDepartmentObj.deptName"
                     pattern="[A-z\dđšžćčĐŠŽĆČ\s]{2,20}"
                     title="Only characters and numbers 2 - 20" required
                     :placeholder="addMsg"/>
            </div>
            <div class="col-2">
              <button type="submit" class="btn btn-outline-success">OK</button>
            </div>
          </div>
        </form>
      </div>
      <div v-for="(dept, key) in departments" :key="key" class="col-md-10">
        <div class="row">
          <div class="col-md-6">
            <a :href="'#item-1'+key" class="list-group-item" data-toggle="collapse">
              <i class="glyphicon glyphicon-chevron-right"></i>{{dept.departments.deptName}}
            </a>
          </div>
          <div class="com-md-6">
            <!--<button class="float-right btn btn-outline-danger btn-sm"-->
                    <!--@click="deleteDepartment(dept.departmentID, key)">Delete</button>-->
            <!--<button class="float-right btn btn-outline-warning btn-sm mr-2"-->
                    <!--@click="editDepartment(dept.departments.deptName, dept.departmentID)">Edit</button>-->
            <!--<button class="float-right btn btn-outline-success btn-sm mr-2"-->
                    <!--@click="addDepartment(dept.departmentID, dept.departments.deptName)">Add</button>-->
            <i class="fa fa-pencil mr-2" aria-hidden="true"
               @click="addDepartment(dept.departmentID, dept.departments.deptName)"></i>
            <i class="fa fa-edit mr-2" aria-hidden="true"
               @click="editDepartment(dept.departments.deptName, dept.departmentID)"></i>
            <i class="fa fa-trash" aria-hidden="true"
               @click="deleteDepartment(dept.departmentID, key)" ></i>
          </div>
        </div>
        <div class="list-group collapse ml-2" :id="'item-1'+key">
          <div v-for="(subDept, key1) in dept.departments.subDept" :key="key1">
            <div class="row">
              <div class="col-md-6">
                <a :href="'#item-1-1'+key1" class="list-group-item text-dark" data-toggle="collapse">
                  <i class="glyphicon glyphicon-chevron-right"></i>{{subDept.deptName}}
                </a>
              </div>
              <div class="col-md-6">
                <i class="fa fa-pencil mr-2" aria-hidden="true"
                   @click="addSubDepartment(dept.departmentID, dept.departments.deptName, subDept.deptName)"></i>
                <i class="fa fa-edit mr-2" aria-hidden="true"
                   @click="editSubDepartment(subDept.deptName, dept.departmentID, key1)"></i>
                <i class="fa fa-trash" aria-hidden="true"
                   @click="deleteSubDepartment(dept.departmentID, key1)" ></i>
              </div>
            </div>
            <div class="list-group collapse ml-4" :id="'item-1-1'+key1">
              <div v-for="(subsubDept, key2) in subDept.subDept" :key="key2">
                <div class="row">
                  <div class="col-md-6">
                    <a href="#" class="list-group-item text-muted">{{subsubDept.deptName}}</a>
                  </div>
                  <div class="col-md-6">
                    <i class="fa fa-edit mr-2" aria-hidden="true"
                       @click="editSubSubDepartment(subsubDept.deptName, dept.departmentID, key1, key2)"></i>
                    <i class="fa fa-trash" aria-hidden="true"
                       @click="deleteSubSubDepartment(dept.departmentID, key1, key2)" ></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
  import db from '../firebase/firebaseInit';
  export default {
    name: 'manage-employee',
    data() {
      return {
        addMsg: '/root',
        departments: [],
        newDepartment: false,
        editDepartmentCon: false,
        editDepartmentID: '',
        addDepartmentCon: false,
        addDepartmentID: '',
        editSubDepartmentCon: false,
        editSubDepartmentKey: '',
        addSubDepartmentCon: false,
        addSubDepartmentID: '',
        addSubDepartmentDeptName: '',
        editSubSubDepartmentCon: false,
        editSubSubDepartmentID: '',
        editSubSubDepartmentKey1: '',
        editSubSubDepartmentKey2: '',
        caseMsg: '',
        newDepartmentObj: {
          deptName: ''
        },
        testObj: {
          departmentID: '',
          departments: []
        },
        departments123: {
          deptName: '',
          subDept: []
        },

      }
    },
    created() {
      db.firestore().collection('departments').get().then(querySnapshot => querySnapshot.forEach(doc => {
        this.testObj.departmentID = doc.id;
        this.testObj.departments = doc.data();
        this.departments.push({...this.testObj});
      }));
    },
    methods: {
      addNewDepartment() {
        switch (this.caseMsg) {
          case "editDepartment": {
            let department = this.departments.find(d => d.departmentID === this.editDepartmentID);
            department.departments.deptName = this.newDepartmentObj.deptName;
            db.firestore().collection('departments').doc(this.editDepartmentID).update({deptName: this.newDepartmentObj.deptName});
            this.editDepartmentCon = false;
            this.newDepartment = false;
            this.caseMsg = '';
          } break;
          case "addDepartment": {
            if (this.departments.find(d => d.departmentID === this.addDepartmentID).departments.subDept !== undefined) {
              this.departments.find(d => d.departmentID === this.addDepartmentID).departments.subDept.push({...this.newDepartmentObj});
            } else {
              this.departments.find(d => d.departmentID === this.addDepartmentID).departments.subDept = [{...this.newDepartmentObj}];
            }
            db.firestore().collection('departments').doc(this.addDepartmentID).update({
              subDept: this.departments.find(d => d.departmentID === this.addDepartmentID).departments.subDept
            });
            this.newDepartmentObj.deptName = '';
            this.newDepartment = false;
            this.addDepartmentCon = false;
            this.caseMsg = '';
          } break;
          case "editSubDepartment": {
            this.departments.find(d => d.departmentID === this.editDepartmentID).departments
              .subDept[this.editSubDepartmentKey].deptName = this.newDepartmentObj.deptName;
            db.firestore().collection('departments').doc(this.editDepartmentID).update({
              subDept: this.departments.find(d => d.departmentID === this.editDepartmentID).departments.subDept
            });
            this.editSubDepartmentCon = false;
            this.newDepartment = false;
            this.caseMsg = '';
          } break;
          case "addSubDepartment": {
            if (this.departments.find(d => d.departmentID === this.addSubDepartmentID)
              .departments.subDept.find(d => d.deptName === this.addSubDepartmentDeptName).subDept !== undefined) {
              this.departments.find(d => d.departmentID === this.addSubDepartmentID)
                .departments.subDept.find(d => d.deptName === this.addSubDepartmentDeptName).subDept.push({...this.newDepartmentObj});
            } else {
              this.departments.find(d => d.departmentID === this.addSubDepartmentID)
                .departments.subDept.find(d => d.deptName === this.addSubDepartmentDeptName).subDept = [{...this.newDepartmentObj}]
            }
            db.firestore().collection('departments').doc(this.addSubDepartmentID).update({
              subDept: this.departments.find(d => d.departmentID === this.addSubDepartmentID).departments.subDept
            });
            this.addSubDepartmentCon = false;
            this.newDepartment = false;
            this.caseMsg = '';
          } break;
          case "editSubSubDepartment": {
            this.departments.find(d => d.departmentID === this.editSubSubDepartmentID)
              .departments.subDept[this.editSubSubDepartmentKey1].subDept[this.editSubSubDepartmentKey2]
              .deptName = this.newDepartmentObj.deptName;
            db.firestore().collection('departments').doc(this.editSubSubDepartmentID).update({
              subDept: this.departments.find(d => d.departmentID === this.editSubSubDepartmentID).departments.subDept
            });
            this.editSubSubDepartmentCon = false;
            this.newDepartment = false;
            this.caseMsg = '';
          } break;
          default : {
            let newDocumentID = '';
            db.firestore().collection('departments').add({
              deptName: this.newDepartmentObj.deptName
            }).then(function(docRef) {
              newDocumentID = docRef.id;
            }).then(() => {
              this.testObj.departmentID = newDocumentID;
              this.testObj.departments = {...this.newDepartmentObj};
              this.departments.push({...this.testObj});
              this.newDepartmentObj.deptName = '';
              this.newDepartment = false;
            }).catch(error => console.log(error));
            this.caseMsg = '';
          }
        }
      },
      deleteDepartment(departmentID, key) {
        if (confirm('Are you sure?')) {
          this.departments.splice(key, 1);
          db.firestore().collection('departments').doc(departmentID).delete();
        }
      },
      editDepartment(departmentName, departmentID) {
        this.caseMsg = "editDepartment";
        this.editDepartmentID = departmentID;
        this.newDepartment = true;
        this.editDepartmentCon = true;
        this.newDepartmentObj.deptName = departmentName;
      },
      addDepartment(departmentID, departmentName) {
        this.caseMsg = "addDepartment";
        this.addMsg = "/root/" + departmentName;
        this.addDepartmentID = departmentID;
        this.newDepartmentObj.deptName = '';
        this.addDepartmentCon = true;
        this.newDepartment = true;
      },
      deleteSubDepartment(departmentID, key) {
        if (confirm('Are you sure?')) {
          this.departments.find(d => d.departmentID === departmentID).departments.subDept.splice(key, 1);
          db.firestore().collection('departments').doc(departmentID).update({
            subDept: this.departments.find(d => d.departmentID === departmentID).departments.subDept
          });
        }
      },
      editSubDepartment(subDepartmentName, departmentID, key) {
        this.caseMsg = "editSubDepartment";
        this.editSubDepartmentKey = key;
        this.editDepartmentID = departmentID;
        this.newDepartment = true;
        this.newDepartmentObj.deptName = subDepartmentName;
        this.editSubDepartmentCon = true;
      },
      addSubDepartment(departmentID, departmentName, subDepartmentName){
        this.caseMsg = "addSubDepartment";
       this.addSubDepartmentID = departmentID;
       this.addSubDepartmentDeptName = subDepartmentName;
       this.newDepartmentObj.deptName = '';
       this.addSubDepartmentCon = true;
       this.addMsg = "/root/" + departmentName + "/" + subDepartmentName;
       this.newDepartment = true;
      },
      deleteSubSubDepartment(departmentID, key1, key2){
        if (confirm('Are you sure?')) {
          this.departments.find(d => d.departmentID === departmentID).departments.subDept[key1].subDept.splice(key2, 1);
          db.firestore().collection('departments').doc(departmentID).update({
            subDept: this.departments.find(d => d.departmentID === departmentID).departments.subDept
          });
        }
      },
      editSubSubDepartment(departmentName, departmentID, key1 , key2) {
        this.caseMsg = "editSubSubDepartment";
        this.editSubSubDepartmentID = departmentID;
        this.editSubSubDepartmentKey1 = key1;
        this.editSubSubDepartmentKey2 = key2;
        this.newDepartmentObj.deptName = departmentName;
        this.newDepartment = true;
      }
    },
  }
</script>

<style>
  .list-group.list-group-root {
    padding: 0;
    overflow: hidden;
  }
  .list-group.list-group-root .list-group {
    margin-bottom: 0;
  }
  .list-group.list-group-root .list-group-item {
    border-radius: 0;
    border-width: 1px 0 0 0;
  }
  .list-group.list-group-root > .list-group-item:first-child {
    border-top-width: 0;
  }
  .list-group.list-group-root > .list-group > .list-group-item {
    padding-left: 30px;
  }
  .list-group.list-group-root > .list-group > .list-group > .list-group-item {
    padding-left: 45px;
  }
  .list-group-item .glyphicon {
    margin-right: 5px;
  }
</style>