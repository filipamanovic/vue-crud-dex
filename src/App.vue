<template>
  <div id="app">
    <Navbar/>
    <div class="container min-vh-100">
      <router-view/>
    </div>
    <Footer/>
  </div>
</template>

<script>
import Navbar from './components/Navbar'
import Footer from './components/Footer'
export default {
  name: 'App',
  components: {
    Navbar,
    Footer
  }
}
</script>

<style>
</style>
