<!--<template>-->
  <!--<div>-->
    <!--<select class="form-control" required @change="departmentSelected">-->
      <!--&lt;!&ndash;<option value="-1">Choose..</option>&ndash;&gt;-->
      <!--<option v-for="(dept, key) in allDepartments" :key="key"-->
              <!--:value="dept.deptName">-->
        <!--{{dept.deptName}}-->
      <!--</option>-->
    <!--</select>-->
    <!--<div v-if="hasChildCon" class="mt-2">-->
      <!--<DepartmentSelect :all-departments="subDepartments"/>-->
    <!--</div>-->
  <!--</div>-->
<!--</template>-->

<!--<script>-->
  <!--export default {-->
    <!--name: "DepartmentSelect",-->
    <!--props: ["allDepartments"],-->
    <!--data() {-->
      <!--return {-->
        <!--hasChildCon: false,-->
        <!--subDepartments: [-->
          <!--{subDepartmentsNames: []}-->
        <!--]-->
      <!--}-->
    <!--},-->
    <!--created() {-->
      <!--// console.log(this.allDepartments);-->
    <!--},-->
    <!--methods: {-->
      <!--departmentSelected(event) {-->
        <!--// console.log(event.target.selectedIndex - 1);-->
        <!--if (this.allDepartments[event.target.selectedIndex].subDept.length > 0) {-->
          <!--let test = this.allDepartments[event.target.selectedIndex].subDept;-->
          <!--this.subDepartments.push(...{test});-->
          <!--this.hasChildCon = true-->
        <!--}-->
      <!--}-->
    <!--}-->
  <!--}-->
<!--</script>-->

<!--<style scoped>-->

<!--</style>-->