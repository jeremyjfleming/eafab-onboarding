<script>
    import { Router, Route } from "svelte-routing";
  
    // components for this layout
    import AuthNavbar from "components/Navbars/AuthNavbar.svelte";
  
    // pages for this layout
    import AdminLogin from "views/admin/Login.svelte";
    import UserLogin from "views/Login.svelte";
  
  
    const registerBg2 = "../assets/img/AnimatedShape.svg";
    const registerBg1 = "../assets/img/AnimatedShapeAdmin.svg";
  
    export let location;
  </script>
  
  <div>
    <AuthNavbar />
    <main>
      <section class="relative w-full h-full py-40 min-h-screen">
        
        {#if location == "admin"}
        <div
          class="absolute top-0 w-full min-h-screen h-full bg-blueGray-800 bg-no-repeat bg-cover bg-fixed"
          style="background-image: url({registerBg1});"
        ></div>
          <AdminLogin/>
        {:else}
        <div
          class="absolute top-0 w-full min-h-screen h-full bg-blueGray-800 bg-no-repeat bg-cover bg-fixed"
          style="background-image: url({registerBg2});"
        ></div>
          <UserLogin/>
        {/if}
      </section>
    </main>
  </div>
  
  