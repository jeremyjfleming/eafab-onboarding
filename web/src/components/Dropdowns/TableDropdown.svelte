<script>
  // library for creating dropdown menu appear on click
  import { createPopper } from "@popperjs/core";
  import clickOutside from "../../clickOutside";

  // core components

  let dropdownPopoverShow = false;

  export let userId = "";
  let btnDropdownRef;
  let popoverDropdownRef;

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
      href="#pablo" on:click={(e) => e.preventDefault()}
      class="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
    >
      Download Response Data
    </a>
    <a
      href="#pablo" on:click={(e) => e.preventDefault()}
      class="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
    >
      Delete User
    </a>
  </div>
</div>
