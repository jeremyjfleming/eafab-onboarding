<!-- App.svelte -->
<script>
  import { Router, Route } from "svelte-routing";

  // Admin Layout
  import Login from "./layouts/Login.svelte";
  
  import Admin from "./layouts/Admin.svelte";

  // No Layout Pages
  import Index from "./views/Index.svelte";
  import Landing from "./views/Landing.svelte";
  import Profile from "./views/Profile.svelte";

  export let url = "";
</script>

<Router url="{url}">
  <!-- admin layout -->
  <Route path="admin/login">
    <Login location="admin"/>
  </Route>
  <Route path="admin/*admin" component="{Admin}" />
  <!-- auth layout -->
  <Route path="login">
    <Login location="user"/>
  </Route>
  <!-- no layout pages -->
  <Route path="landing" component="{Landing}" />
  <Route path="profile" component="{Profile}" />
  <Route path="/" component="{Index}" />
</Router>
