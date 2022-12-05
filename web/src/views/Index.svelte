<script>
  // core components
  import MainForm from "../components/FormSteps/MainForm.svelte";
import IndexNavbar from "../components/Navbars/IndexNavbar.svelte";
 import { questions, sections } from "../formcontents";

  
  $: step = 1;
  
  let responses = new Array(25).fill("").map(() => new Array(3).fill(""));
  let filled = Array(25).fill(false);


  $: {
    for (let i = 0; i < 25; i++) {
      if (responses[i][0] !== "" && responses[i][1] !== "" && responses[i][2] !== "" && responses[i][3] !== "") {
        filled[i] = true;
      }
      else 
        filled[i] = false;
    }
  }

  fetch("//api.digisignonline.com/eafab/employee/" + sessionStorage.getItem("userId")).then((value) => {
    for (let response in value.formResponses.sectionResponses)
    {
      responses[response] = [value.formResponses.sectionResponses[response].questionOne, value.formResponses.sectionResponses[response].questionTwo, value.formResponses.sectionResponses[response].questionThree, value.formResponses.sectionResponses[response].summary]
    } 
  })


  let socket;
  try {
    socket = new WebSocket("ws://api.digisignonline.com/eafab/employee")
  } catch (e) {
    // throw popup
  }

  function updateThroughSocket() {
    socket.send(JSON.stringify({
      userId: sessionStorage.getItem("userId"),
      secretKey: sessionStorage.getItem("secretKey"),
      formResponses: responses.forEach((v, i) => )
    }))
  }

  $: {
    console.log(responses);
  }

</script>

<div>
  <div class="absolute bg-blueGray-100 w-full">
    <IndexNavbar />
    <div class="relative bg-blueGray-800 md:pt-32 pb-32 pt-12 px-4 md:px-10 mx-auto w-full"/>
    <div class="px-4 md:px-10 mx-auto w-full -m-24">
      <div class="flex flex-wrap mt-4">
        <div class="w-full mb-12 px-4">
          <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white text-white">
            <div class="rounded-t mb-0 px-4 py-3 border-0">
              <div class="flex flex-wrap items-center">
                <div class="relative w-full px-4 max-w-full flex-grow flex justify-evenly">
                  {#each Array(25) as _, i}
                  <button class="w-10 h-10 text-black  rounded-full border-2 {filled[i] ? "bg-gray-200" : "bg-white"}" on:click={() => step = i+1}>
                    <p class="{i+1 == step ? "font-bold" : "font-normal"}">{i+1}</p>
                  </button>
                  {/each}
                </div>
              </div>
            </div>
            <div class="flex flex-col items-center">
              <div class="flex flex-col items-center justify-evenly w-4/5 mb-10 mt-5 gap-6 text-black overflow-x-auto">
                <!-- Projects table -->
                  <div class="terms-container w-full bg-gray-100 overflow-auto h-96 border-2">
                    {@html sections[step-1]}
                  </div>
                  <div class="flex flex-col w-1/2 gap-8">
                    {#each Array(3) as _, i}
                        <div class="flex flex-col gap-2">
                            <label for="{step}-{i+1}">{questions[step][i]}</label>
                            <textarea class="h-30 rounded" name="{step}-{i+1}" id="" bind:value={responses[0][i]} on:change={updateThroughSocket}></textarea>
                        </div>
                    {/each}
                    <div class="flex flex-col">
                        <label for="{step}-s">Summary of Section</label>
                        <textarea class="h-30 rounded" name="{step}-s" id="" bind:value={responses[0][3]} on:change={updateThroughSocket}></textarea>
                    </div>
                </div>
              </div>
            </div>
        </div>
      </div>
        <!-- <div class="w-full mb-12 px-4">
          
        </div> -->
      </div>
    </div>
  </div>
</div>