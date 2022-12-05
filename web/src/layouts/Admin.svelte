<script>
  import { Router, Route } from "svelte-routing";

  // components for this layout
  import AdminNavbar from "components/Navbars/AdminNavbar.svelte";


  // pages for this layout
  import Index from "views/admin/Index.svelte";

  export let location;
  export let admin = "";
</script>

<div>
  <div class="absolute bg-blueGray-100 w-full">
    <AdminNavbar />
    <!-- Header -->
    <div class="relative bg-blueGray-800 md:pt-32 pb-32 pt-12 px-4 md:px-10 mx-auto w-full"/>
    <div class="px-4 md:px-10 mx-auto w-full -m-24">
      <Router url="admin">
        <Route path="/" component="{Index}" />
      </Router>
    </div>
  </div>
</div>
