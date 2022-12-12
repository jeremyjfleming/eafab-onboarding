<script>
  // core components
  import IncompleteTable from "../../components/Cards/IncompleteTable.svelte";
  import IncompleteElement from "../../components/Cards/IncompleteElement.svelte";
  import CompleteElement from "../../components/Cards/CompleteElement.svelte";
  import CompleteTable from "../../components/Cards/CompleteTable.svelte";
  export let location;

  let newUserDialog
  

</script>

<div class="flex flex-wrap mt-4">
  <div class="w-full mb-12 px-4">
    <IncompleteTable>
      <IncompleteElement firstName="Jeremy" lastName="Fleming" userId="flemingj" accessCode="029392" completion=20/>
      <IncompleteElement firstName="Jeremy" lastName="Fleming" userId="flemingj" accessCode="029392" completion=60/>
      <IncompleteElement firstName="Jeremy" lastName="Fleming" userId="flemingj" accessCode="029392" completion=60/>
      <IncompleteElement firstName="Jeremy" lastName="Fleming" userId="flemingj" accessCode="029392" completion=60/>
      <IncompleteElement firstName="Jeremy" lastName="Fleming" userId="flemingj" accessCode="029392" completion=60/>
      <IncompleteElement firstName="Jeremy" lastName="Fleming" userId="flemingj" accessCode="029392" completion=60/>
    </IncompleteTable>
  </div>
  <div class="w-full mb-12 px-4">
    <CompleteTable>
      <CompleteElement firstName="Jeremy" lastName="Fleming"/>
      <CompleteElement firstName="Jeremy" lastName="Fleming"/>
    </CompleteTable>
  </div>
  <dialog bind:this={newUserDialog} class="border mt-10">
    <div class="flex flex-col">
      <div class="flex flex-row justify-between mb-6">
        <h3>Add a new user</h3>
        <button><i class="fas fa-xmark w-4 h-4 text-blueGray-700" on:click={() => {
          newUserDialog.close()
        }}></i></button>
      </div>
      <form action="" class="flex flex-col gap-4">
        <input class="rounded" type="text" name="firstName" placeholder="First Name">
        <input class="rounded" type="text" name="lastName" placeholder="Last Name">
        <button class="shadow-sm hover:shadow-lg rounded text-white bg-blueGray-800 w-16 h-10" type="submit">Submit</button>
      </form>
    </div>
  </dialog>
</div>


<button on:click={(() => newUserDialog.show())} class="fixed bg-blueGray-700 rounded-full text-center w-16 right-0 bottom-0 h-16 mr-3 mb-3 shadow-lg hover:shadow-xl">
  <i class="fa-solid fa-plus text-white mt-auto text-2xl"></i>
</button>