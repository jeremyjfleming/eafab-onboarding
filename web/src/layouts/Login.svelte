<script>
  import { Router, Route } from "svelte-routing";

  // components for this layout
  import AuthNavbar from "components/Navbars/AuthNavbar.svelte";
  import FooterSmall from "components/Footers/FooterSmall.svelte";

  // pages for this layout
  import AdminLogin from "views/admin/Login.svelte";
  import UserLogin from "views/Login.svelte";


  const registerBg2 = "../assets/img/AnimatedShape.svg";
  export let location;
  export let auth = "";
</script>

<div>
  <AuthNavbar />
  <main>
    <section class="relative w-full h-full py-40 min-h-screen">
      <div
        class="absolute top-0 w-full h-full bg-blueGray-800 bg-no-repeat bg-full"
        style="background-image: url({registerBg2});"
      ></div>
      {#if location == "admin"}
        <AdminLogin/>
      {:else}
        <UserLogin/>
      {/if}
    </section>
  </main>
</div>
