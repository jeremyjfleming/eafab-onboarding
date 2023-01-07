<script>
    export let message;
</script>

<div>
    {#if message}
    <div class="absolute top-0 left-0 h-8 z-20 w-full flex flex-row mt-4 justify-center">
      <div class="rounded border-2 border-red-600 p-2 pb-8 bg-white">
        <h3 class="text-red-600">{message}</h3> 
      </div>
    </div>
    {/if}
</div>