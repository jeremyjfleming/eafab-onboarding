<script>
  // core components
  import IncompleteTable from "../../components/Cards/IncompleteTable.svelte";
  import IncompleteElement from "../../components/Cards/IncompleteElement.svelte";
  import CompleteElement from "../../components/Cards/CompleteElement.svelte";
  import CompleteTable from "../../components/Cards/CompleteTable.svelte";
  import { onMount } from "svelte";
  import { empty } from "svelte/internal";
  export let location;

  let newUserDialog = false
  let authHeader = "Bearer " + localStorage.getItem("token")
  let addUser = {
    firstName: "",
    lastName: ""
  }
  $: completeEmployees = []
  $: incompleteEmployees = []
  let percentages = []

  onMount(async () => {
    try {
      completeEmployees = await (await fetch("//api.eafabsafety.com/employee/complete", {
        method: "get",
        headers: { "Authorization": authHeader}
      })).json(); 
    } catch (e) {}

    try {
      incompleteEmployees = await (await fetch("//api.eafabsafety.com/employee/incomplete", {
        method: "get",
        headers: { "Authorization": authHeader}
      })).json();
    } catch (e) {} 

    for (let i = 0; i < incompleteEmployees.length; i++) {
      let percentageCount = 0
      for (let section in incompleteEmployees[i].formResponses.sectionResponses) {
        for (let question in section) {
          if (section[question] !== "")
            percentageCount++;
        }
        if (incompleteEmployees[i].formResponses.signatureId !== "")
          percentageCount += 4;
      }
      percentages[i] = percentageCount;
  }

  })



</script>

<div class="flex flex-wrap mt-4">
  <div class="fixed {!newUserDialog && "hidden"} top-0 left-0 h-full w-full z-20 flex items-center justify-center overflow-hidden flex-col bg-transparent/50">
    <div class="top-1/2 border bg-white p-8 rounded">
      <div class="flex flex-col">
        <div class="flex flex-row justify-between mb-6">
          <h3>Add a new user</h3>
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <button><i class="fas fa-xmark w-4 h-4 text-blueGray-700" on:click={() => {
            newUserDialog = false
          }}></i></button>
        </div>
        <form class="flex flex-col gap-4">
          <input class="rounded" bind:value={addUser.firstName} type="text" name="firstName" placeholder="First Name">
          <input class="rounded" bind:value={addUser.lastName} type="text" name="lastName" placeholder="Last Name">
          <button class="shadow-sm hover:shadow-lg rounded text-white bg-blueGray-800 w-16 h-10" on:click|preventDefault={() => {
            if (addUser.firstName !== "" && addUser.lastName !== "")
              fetch("//api.eafabsafety.com/employee", {
                method: "POST",
                headers: {"Authorization": authHeader },
                body: new URLSearchParams(addUser)
              }).then((response) => {
                console.log(response)
                if (response.ok)
                  window.location.reload();
              })
            newUserDialog = false;
          }}>Submit</button>
        </form>
      </div>
    </div>
  </div>
  <div class="w-full mb-12 px-4">
    <IncompleteTable>
      {#if incompleteEmployees != []}
        {#each incompleteEmployees as employee, i}
          <IncompleteElement firstName={employee.firstName} lastName={employee.lastName} userId={employee.username} accessCode={employee.accessCode} completion={percentages[i]} id={employee.userId}/>
        {/each}
      {/if}
    </IncompleteTable>
  </div>
  <div class="w-full mb-12 px-4">
    <CompleteTable>
      {#if incompleteEmployees != []}
        {#each completeEmployees as employee}
          <CompleteElement firstName={employee.firstName} lastName={employee.lastName} completeDate={employee.formResponse.date} id={employee.userId}/>
        {/each}
      {/if}
    </CompleteTable>
  </div>
</div>


<button on:click={(() => newUserDialog = true)} class="fixed bg-blueGray-700 rounded-full text-center w-16 right-0 bottom-0 h-16 mr-3 mb-3 shadow-lg hover:shadow-xl">
  <i class="fa-solid fa-plus text-white mt-auto text-2xl"></i>
</button>