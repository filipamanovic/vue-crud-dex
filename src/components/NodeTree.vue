<template>
  <div>
    <div class="row">
      <div class="col-md-6">
        <a :href="'#'+node.deptName.replace(/\s/g, '')+keyValue" class="list-group-item" data-toggle="collapse">
          <i class="glyphicon glyphicon-chevron-right"></i>{{node.deptName}}
        </a>
      </div>
      <div class="com-md-6">
        <i class="fa fa-pencil mr-2" aria-hidden="true"
           @click="addDepartment(departmentID, keyValue)"></i>
        <i class="fa fa-edit mr-2" aria-hidden="true"
           @click="editDepartment(departmentID, keyValue, node.deptName)"></i>
        <i class="fa fa-trash" aria-hidden="true"
           @click="deleteDepartment(departmentID, keyValue)"></i>
      </div>
    </div>
  <div class="list-group collapse ml-3" :id="node.deptName.replace(/\s/g, '')+keyValue"
       v-if="(node.subDept && node.subDept.length > 0)">
    <node v-for="(child, key) in node.subDept" :node="child" :departmentID="departmentID"
          :key="key" :keyValue="keyValue+ '' + key"></node>
  </div>
  </div>
</template>

<script>
  export default {
    name: "node",
    props: ['node', 'keyValue', 'departmentID'],
    methods: {
      deleteDepartment(departmentID, key){
        this.$root.$emit("deleteObject", departmentID, key);
      },
      editDepartment(departmentID, key, deptName){
        this.$root.$emit("editDepartment", departmentID, key, deptName);
      },
      addDepartment(departmentID, key){
        this.$root.$emit("addDepartment", departmentID, key);
      }
    },
    data() {
      return {
      }
    },
  };
</script>