<!-- App.svelte -->
<script>
  import { Router, Route } from "svelte-routing";

  // Admin Layout
  import Login from "./layouts/Login.svelte";
  
  import Admin from "./layouts/Admin.svelte";

  // No Layout Pages
  import Index from "./views/Index.svelte";
  import { validate_dynamic_element } from "svelte/internal";

  export let url = "";

  let checkAuth = async (type) => { 
    if (!localStorage.getItem("token")) {
      return false;
    }
    let value = await fetch("//api.eafabsafety.com/auth/" + type + "/status", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    });

    if (!value.ok) {
      localStorage.clear("token") // this means the token we have is no longer valid
      return false;
    }
    return true;
    
  }

  if (window.location.pathname.split('/')[1] == "admin") {
    checkAuth("admin").then((value) => {
      if (value && window.location.pathname == "/admin/login")
        window.location = "/admin"
      })
    checkAuth("admin").then((value) => {
      if (!value && window.location.pathname !== "/admin/login")
        window.location = "/admin/login"
      }) 
  } else {
    checkAuth("user").then((value) => {
      if (value && window.location.pathname == "/login")
        window.location = "/"
    })
    checkAuth("user").then((value) => {
      if (!value && window.location.pathname !== "/login")
        window.location = "/login"
    })
  }


</script>

<Router url="{url}">
  <!-- admin layout -->
  <Route path="admin/login">
    <Login location="admin"/>
  </Route>
  <Route path="admin/*admin">
    <Admin/>    
  </Route>
  <!-- auth layout -->
  <Route path="login">
      <Login/>
  </Route>
  <!-- no layout pages -->
  <Route path="/">
      <Index/>
  </Route>
</Router>
