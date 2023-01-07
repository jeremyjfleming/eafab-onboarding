<script>
  // library for creating dropdown menu appear on click
  import { createPopper } from "@popperjs/core";
  import clickOutside from "../../clickOutside";
  import { errors, deleteUser } from "../../adminStores"

  // core components

  let dropdownPopoverShow = false;

  export let userId = "";
  export let isComplete = false;
  let btnDropdownRef;
  let popoverDropdownRef;

  async function reopenUser() {
    let response = await fetch("//api.eafabsafety.com/employee/" + userId, {
      method: "put",
      headers: {"Authorization": "Bearer " + localStorage.getItem("token")},
      body: JSON.stringify({ submitted: false })
    })

    if (!response.ok)
      errors.set("Something went wrong. Please try again later.")
    else 
      window.location.reload();
  }


  const toggleDropdown = (event) => {
    event.preventDefault();
    if (dropdownPopoverShow) {
      dropdownPopoverShow = false;
    } else {
      dropdownPopoverShow = true;
      createPopper(btnDropdownRef, popoverDropdownRef, {
        placement: "bottom-start",
      });
    }
  };
</script>

<div>
  <a
    class="text-blueGray-500 py-1 px-3"
    href="#pablo"
    bind:this="{btnDropdownRef}"
    on:click="{toggleDropdown}"
  >
    <i class="fas fa-ellipsis-v"></i>
  </a>
  <div
    bind:this="{popoverDropdownRef}"
    class="bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48 {dropdownPopoverShow ? 'block':'hidden'}"
  >
    <a
      href="/admin/employee/{userId}"
      class="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
    >
      View Response Data
    </a>
    <a
      href="#p" on:click
      class="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
    >
      Download Response Data
    </a>
    {#if isComplete}
      <a
      href="#" on:click|preventDefault={reopenUser}
      class="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
    >
      Reopen User
    </a>
    {/if}
    <a
      href="#pablo" on:click|preventDefault={() => deleteUser.set(userId)}
      class="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
    >
      Delete User
    </a>
  </div>
</div>
