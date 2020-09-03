<template>
  <div class="list-group list-group-root well col-md-10 mt-4">
    <div class="row mb-2">
      <div class="col-md-4">
        <button class="btn btn-outline-dark btn-block"
                @click="function() {
                  newDepartment = !newDepartment
                  newDepartmentObj.deptName = ''
                  newDepartment? addMsg = '/root': ''
                }">
          {{newDepartment? "Cancel" : "Add new"}}
        </button>
      </div>
      <form class="col-md-8" v-if="newDepartment" @submit.prevent="addNewDepartment">
        <div class="row">
          <div class="col-md-9">
            <input type="text" class="form-control"
                   pattern="[A-z\dđšžćčĐŠŽĆČ\s]{2,20}"
                   title="Only characters and numbers 2 - 20" required
                   v-model="newDepartmentObj.deptName"
                   :placeholder="addMsg"/>
          </div>
          <div class="col-2">
            <button type="submit" class="btn btn-outline-success">OK</button>
          </div>
        </div>
      </form>
    </div>
      <div class="col-md-10">
        <NodeTree v-for="(tree, key) in treeData"
                   :node="tree.departments"
                   :keyValue="key"
                   :departmentID="tree.departmentID"
                   :key="key"></NodeTree>
      </div>
    </div>
</template>

<script>
  import NodeTree from "./NodeTree";

  export default {
    name: 'tree',
    props: {
      treeData: Array,
    },
    components: {
      NodeTree
    },
    data() {
      return {
        newDepartmentObj: {
          deptName: '',
          subDept: []
        },
        newDepartment: false,
        addMsg: '/root',
        actionVar: '',
        value: '',
        key: '',
      }
    },
    methods: {
      addNewDepartment() {
        switch (this.actionVar) {
          case "Edit": {
            this.$emit("editObject", this.value, this.key, this.newDepartmentObj.deptName);
            this.actionVar = '';
          } break;
          case "Create": {
            this.$emit("createObject", this.value, this.key, this.newDepartmentObj);
            this.actionVar = '';
          } break;
          default: {
            this.$emit("fromChild", this.newDepartmentObj);
          }
        }
        this.newDepartment = false;
      },
      calculateAddMsg(key) {
        let msg = "/root";
        let positions = key.toString().split('');
        let tmpObj = this.treeData;
        if (positions.length === 1) {
          msg = msg + "/" + tmpObj[positions[0]].departments.deptName;
        } else {
          tmpObj = tmpObj[positions[0]].departments;
          msg = msg + "/" + tmpObj.deptName;
          for(let x = 1; x < positions.length; x ++) {
            tmpObj = tmpObj.subDept[positions[x]];
            msg = msg + "/" + tmpObj.deptName
          }
        }
        return msg;
      }
    },
    mounted() {
      this.$root.$on('editDepartment', (value, key, deptName) => {
        this.value = value;
        this.key = key;
        this.actionVar = "Edit";
        this.newDepartment = true;
        this.newDepartmentObj.deptName = deptName;
      });
      this.$root.$on('addDepartment', (value, key) => {
        this.value = value;
        this.key = key;
        this.newDepartmentObj.deptName = '';
        this.addMsg = this.calculateAddMsg(key);
        this.actionVar = "Create";
        this.newDepartment = true;
      })
    },
  };
</script>

<style>
  .tree-list ul {
    padding-left: 16px;
    margin: 6px 0;
  }
</style>