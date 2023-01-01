
<script>
    import TableDropdown from "../Dropdowns/TableDropdown.svelte";

    export let firstName = "";
    export let lastName = "";
    export let userId = "";
    export let accessCode = ""
    export let completion = 0;
    export let id = "";
</script>

<tr>
    <td
      class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
    >
      {firstName}
    </td>
    <td
      class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
    >
      {lastName}
    </td>
    <td
      class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
    >
      {userId}
    </td>
    <td
      class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
    >
      {accessCode}
    </td>
    <td
      class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
    >
      <div class="flex items-center">
        <span class="mr-2">{completion}%</span>
        <div class="relative w-full">
          <div
            class="overflow-hidden h-2 text-xs flex rounded bg-red-200"
          >
            <div
              style="width: {completion}%;"
              class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
            ></div>
          </div>
        </div>
      </div>
    </td>
    <td
      class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right"
    >
      <TableDropdown userId="{id}" />
    </td>
  </tr>