<script>
  import { Router, Route } from "svelte-routing";

  // components for this layout
  import AdminNavbar from "components/Navbars/AdminNavbar.svelte";
  import ErrorPopup from "../components/ErrorPopup.svelte";

  import { errors, deleteUser } from "../adminStores"
  import { deleteUser as deleteUserReq } from "../requests";
  
  // pages for this layout
  import Index from "views/admin/Index.svelte";
  import Employee from "../views/admin/Employee.svelte";

  $: deletePopup = false
  let deleteUserId = ""

  
  let errorsArr = []
  
  errors.subscribe((value) => {
    errorsArr = [...errorsArr, value];
    setTimeout(() => errorsArr.length > 1 ? errorsArr.shift() : errorsArr = [], 3000)
  })

  deleteUser.subscribe((value) => {
    deletePopup = true;
    deleteUserId = value;
  })



  
</script>


<div>
  <div class="absolute bg-blueGray-100 w-full hidden md:block">
    {#each errorsArr as error}
    {#if error.length > 0}
    <ErrorPopup message={error}/>
    {/if}  
    {/each}
    <div class="fixed bg-transparent/50 z-20 w-full h-full top-0 left-0 overflow-hidden flex flex-col justify-center items-center {!deletePopup && "hidden" }">
      <div class="border text-center bg-white top-1/2 p-8 rounded">
        <h3>Are you sure you want to delete this user?</h3><br>
          <h3>This action is irreversable.</h3>
        <div class="flex flex-row justify-evenly my-6">
          <button class="rounded border-2 border-blueGray-800 w-16 h-10" on:click={() => {
            deletePopup = false;
          }}>Cancel</button>
          <button class="shadow-sm hover:shadow-lg transition-shadow ease-in rounded text-white bg-blueGray-800 w-16 h-10" on:click={() => {
            deleteUserReq(deleteUserId)
          }}>Delete</button>
        </div>
      </div>
    </div>
    <AdminNavbar />
    <!-- Header -->
    <div class="relative bg-blueGray-800 md:pt-32 pb-32 pt-12 px-4 md:px-10 mx-auto w-full"/>
    <div class="px-4 md:px-10 mx-auto w-full -m-24">
      <Router url="admin">
        <Route path="/" component="{Index}" />
        <Route path="employee/:id" let:params>
          <Employee employeeId={params.id}/>
        </Route>
        <Route path="employee/" commponent={Employee}/>
      </Router>
    </div>
  </div>
</div>
<p class="block md:hidden">not optimized for mobile devices</p>