<script>
  // core components
  import UserDropdown from "components/Dropdowns/UserDropdown.svelte";
</script>

<!-- Navbar -->
<nav
  class="absolute top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center p-4"
>
  <div
    class="w-full mx-auto items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4"
  >
    <!-- Brand -->
    <a href="/admin"><img src="/assets/img/eafablogo.webp" alt="" width=300vw style=""></a>
    <h3 class="font-semibold text-lg text-white">
          Administrator Panel
    </h3>
    <!-- User -->
    <ul class="flex-col md:flex-row list-none items-center hidden md:flex w-40 justify-center">
      <UserDropdown />
    </ul>
  </div>
</nav>
<!-- End Navbar -->
