<script>
  // core components
  import IncompleteTable from "../../components/Cards/IncompleteTable.svelte";
  import IncompleteElement from "../../components/Cards/IncompleteElement.svelte";
  import CompleteElement from "../../components/Cards/CompleteElement.svelte";
  import CompleteTable from "../../components/Cards/CompleteTable.svelte";
  export let location;

  $: newUser = false;
  

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
</div>

<div class="absolute opacity-30 flex flex-auto flex {newUser ? 'block' : 'hidden'}">
  <form action="" class="bg">
    <input type="text" name="firstName" placeholder="First Name">
    <input type="text" name="lastName" placeholder="Last Name">
    <button type="submit"></button>
  </form>
</div>

<button on:click={(() => newUser = true)} class="fixed bg-blueGray-700 rounded-full text-center w-16 right-0 bottom-0 h-16 mr-3 mb-3 shadow-lg hover:shadow-xl">
  <i class="fas fa-plus text-white mt-auto text-2xl"></i>
</button>