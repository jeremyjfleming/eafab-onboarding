<script>
  // core components
</script>

<!-- Navbar -->
<nav
  class="absolute top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center p-4"
>
  <div
    class="w-full mx-auto items-center flex justify-between md:flex-nowrap md:px-10 px-4"
  >
    <!-- Brand -->
    <img src="/assets/img/eafablogo.webp" alt="" class="md:w-80 w-40">
    <div class="relative w-full text-center">
      <h1 class="font-semibold md:block text-lg hidden text-white mr-4">
          EAFab Safety Assessment
      </h1>
    </div>
    <div class="md:w-1/3 relative text-center">
      <button on:click={() => {
        localStorage.removeItem("token")
        window.location = "/login"
      }} class="w-8 h-4 text-white">
        <i class="fas fa-right-from-bracket text-white md:text-2xl text-xl"></i>      
      </button>
    </div>
  </div>
</nav>
<!-- End Navbar -->
