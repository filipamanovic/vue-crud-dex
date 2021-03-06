import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '../components/Dashboard'
import ViewEmployee from '../components/ViewEmployee'
import EditEmployee from '../components/EditEmployee'
import ManageDepartmentsUpdate from '../components/ManageDepartmentsUpdate';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/:employee_id',
      name: 'view-employee',
      component: ViewEmployee
    },
    {
      path: '/new',
      name: 'new-employee',
      component: EditEmployee
    },
    {
      path: '/edit/:employee_id',
      name: 'edit-employee',
      component: EditEmployee
    },
    {
      path: '/manageDepartmentsUpdate',
      name: 'manage-departments-update',
      component: ManageDepartmentsUpdate
    }
  ]
})