<template>
  <div>
    <tree :tree-data="departments" @fromChild="fromChildReceived" @editObject="editObject"
      @createObject="createObject"></tree>
  </div>
</template>

<script>
  import Tree from "./Tree";
  import db from "../firebase/firebaseInit";

  export default {
    name: 'ManageDepartments',
    data() {
      return {
        departments: [],
        testObj: {
          departmentID: '',
          departments: []
        }
      }
    },
    components: {
      Tree
    },
    created() {
      db.firestore().collection('departments').get().then(qs => qs.forEach(doc => {
        this.testObj.departmentID = doc.id;
        this.testObj.departments = doc.data();
        this.departments.push({...this.testObj});
      }));
    },
    mounted() {
      this.$root.$on('deleteObject', (value, key) => {
        if (confirm('Are you sure?')) {
          let positions = key.toString().split('');
          // console.log(value, positions);
          if (positions.length === 1) {
            this.departments.splice(positions[0], 1);
            db.firestore().collection('departments').doc(value).delete();
          } else {
            let tmpVar = this.departments.find(d => d.departmentID === value).departments;
            for(let x = 1; x < positions.length; x++) {
              if (x === positions.length - 1) {
                tmpVar.subDept.splice(positions[x], 1);
              } else {
                tmpVar = tmpVar.subDept[positions[x]];
              }
            }
            db.firestore().collection('departments').doc(value).update({
              subDept: this.departments.find(d => d.departmentID === value).departments.subDept
            });
          }
        }
      });
    },
    methods: {
      fromChildReceived(val) {
        let newDocumentID = '';
        db.firestore().collection('departments').add({
          deptName: val.deptName,
          subDept: []
        }).then(function (docRef) {
          newDocumentID = docRef.id
        }).then(() => {
          this.testObj.departmentID = newDocumentID;
          this.testObj.departments = {...val};
          this.departments.push({...this.testObj});
          val.deptName = '';
        }).then(() => {
          this.departments.length = 0;
          db.firestore().collection('departments').get().then(qs => qs.forEach(doc => {
            this.testObj.departmentID = doc.id;
            this.testObj.departments = doc.data();
            this.departments.push({...this.testObj});
          }));
        });
      },
      editObject(value, key, deptName) {
        let positions = key.toString().split('');
        if (positions.length === 1) {
          this.departments.find(d => d.departmentID === value).departments.deptName = deptName;
          db.firestore().collection('departments').doc(value).update({deptName: deptName});
        } else {
          let tmpVar = this.departments.find(d => d.departmentID === value).departments;
          for(let x = 1; x < positions.length; x++) {
            if (x === positions.length - 1) {
              tmpVar.subDept[positions[x]].deptName = deptName;
            } else {
              tmpVar = tmpVar.subDept[positions[x]];
            }
          }
          db.firestore().collection('departments').doc(value).update({
            subDept: this.departments.find(d => d.departmentID === value).departments.subDept
          });
        }
      },
      createObject(value, key, deptName) {
        let positions = key.toString().split('');
        if (positions.length === 1) {
          this.departments.find(d => d.departmentID === value).departments.subDept.push({...deptName});

          db.firestore().collection('departments').doc(value).update({
            subDept: this.departments.find(d => d.departmentID === value).departments.subDept
          }).then(() => {
            this.departments.length = 0;
            db.firestore().collection('departments').get().then(qs => qs.forEach(doc => {
              this.testObj.departmentID = doc.id;
              this.testObj.departments = doc.data();
              this.departments.push({...this.testObj});
            }));
          });
        } else {
          let tmpDepartments = this.departments.find(d => d.departmentID === value).departments;
          for (var x = 1; x < positions.length; x++) {
            if (x === positions.length - 1) {
              tmpDepartments.subDept[positions[x]].subDept.push({...deptName})
            } else {
              tmpDepartments = tmpDepartments.subDept[positions[x]];
            }
          }
          db.firestore().collection('departments').doc(value).update({
            subDept: this.departments.find(d => d.departmentID === value).departments.subDept
          }).then(() => {
            this.departments.length = 0;
            db.firestore().collection('departments').get().then(qs => qs.forEach(doc => {
              this.testObj.departmentID = doc.id;
              this.testObj.departments = doc.data();
              this.departments.push({...this.testObj});
            }));
          });
        }
      }
    }
  };
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
