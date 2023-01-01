<script>
    import { onMount } from "svelte";
    import { questions } from "../../formcontents";

    let color = "light"
    let authHeader = "Bearer " + localStorage.getItem("token")
    let started = false


    $: employee = {};
    onMount(async () => { 
        try {
            employee = await (await fetch("//api.eafabsafety.com/employee/" + location.pathname.split("/")[location.pathname.split("/").length-1], {
                method: "get",
                headers: {"Authorization": authHeader}
            })).json();
        } catch (e) {
            console.log(e)
        }   
        started = employee.formResponses.hasOwnProperty("sectionResponses")
       
    })

    // employee = {
    //     firstName: "Jeremy",
    //     lastName: "Fleming",
    //     submitted: false,
    //     formResponse: {
    //         sectionResponses: [
    //             {
    //                 questionOne: "sjdsjdsjds",
    //                 questionTwo: "sjdsjdsjds",
    //                 questionThree: "sjdsjdsjds",
    //                 summary: "sjdsjdsjds",
    //             },
    //             {
    //                 questionOne: "sjdsjdsjds",
    //                 questionTwo: "sjdsjdsjds",
    //                 questionThree: "sjdsjdsjds",
    //                 summary: "sjdsjdsjds",
    //             }

    //         ],
    //     date: "203920392"
    //     }
    

</script>


<div
  class="relative flex flex-col min-w-0 break-words w-full mb-10 pb-10 shadow-lg rounded {color === 'light' ? 'bg-white' : 'bg-red-800 text-white'}"
>
  {#if employee}  
    <div class="rounded-t mb-0 px-4 py-3 border-0">
        <div class="flex flex-wrap items-center">
        <div class="relative w-full px-4 max-w-full flex-grow flex-1">
            <h2
            class="font-semibold text-2xl {color === 'light' ? 'text-blueGray-700' : 'text-white'}"
            >
                {employee.firstName} {employee.lastName} {@html (employee.submitted ? "<em>Complete</em>" : "<em>Incomplete</em>")}
            </h2>
        </div>
        </div>
    </div>
    <div class="block w-full overflow-x-auto">
        <!-- Projects table -->
        <div class="px-10 flex flex-col gap-4 mb-10">

            {#if started}
                {#each employee.formResponse.sectionResponses as section, i}
                    <h2 class="text-xl font-bold">Section {i+1}</h2>
                    <h3 class="text-md" >{questions[i][0]}</h3>
                    <p class="text-sm rounded border-2 p-2 h-20 overflow-auto">{section.questionOne}</p>
                    <h3 class="text-md">{questions[i][1]}</h3>
                    <p class="text-sm rounded border-2 p-2 h-20 overflow-auto">{section.questionTwo}</p>
                    <h3 class="text-md">{questions[i][2]}</h3>
                    <p class="text-sm rounded border-2 p-2 h-20 overflow-auto">{section.questionThree}</p>
                    <h3 class="text-md">Summary</h3>
                    <p class="text-sm rounded border-2 p-2 h-20 overflow-auto">{section.summary}</p>
                {/each}

                {#if employee.submitted}
                    <h3>Signature</h3>
                    <img src="data:{employee.formResponse.signatureId}" alt="">
                    <h3>Date Submitted</h3>
                    <p>{employee.formResponse.date}</p>
                {/if}
            {:else}
                <h1>not started</h1>
            {/if}
        </div>
    </div>
    {:else}
        <em>loading</em>
    {/if}
</div>
