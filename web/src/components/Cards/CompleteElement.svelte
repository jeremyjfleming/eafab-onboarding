
<script>
    import TableDropdown from "../Dropdowns/TableDropdown.svelte";

    export let firstName = "";
    export let lastName = "";
    export let completeDate = ""
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
      {completeDate}
    </td>
    <td
      class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right"
    >
      <TableDropdown userId={id} isComplete={true}/>
    </td>
  </tr>