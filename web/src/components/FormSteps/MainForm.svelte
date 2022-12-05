<script>
    export let questions = [];

    export let stepNumber;
</script>
<div class="flex flex-col w-1/2 gap-8">
    {#each Array(3) as _, i}
        <div class="flex flex-col gap-2">
            <label for="{stepNumber}-{i+1}">{questions[i]}</label>
            <textarea class="h-30 rounded" name="{stepNumber}-{i+1}" id=""></textarea>
        </div>
    {/each}
    <div class="flex flex-col">
        <label for="{stepNumber}-s">Summary of Section</label>
        <textarea class="h-30 rounded" name="{stepNumber}-s" id=""></textarea>
    </div>
</div>
 