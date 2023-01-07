<script>
  // core components
import IndexNavbar from "../components/Navbars/IndexNavbar.svelte";
 import { questions } from "../formcontents";
 import SignaturePad from "signature_pad"
  import { onMount } from "svelte";
  import clickOutside from "../clickOutside"
  
  
  $: step = 1;
  
  let responses = new Array(24).fill("").map(() => new Array(4).fill(""));
  let filled = Array(25).fill(false);

  $: sidebar = false;
  let confirmWindow = false;

  let frame
  let authHeader = "Bearer " + localStorage.getItem("token")

  $: {
    for (let i = 0; i < 24; i++) {
      if (responses[i][0] !== "" && responses[i][1] !== "" && responses[i][2] !== "" && responses[i][3] !== "") {
        filled[i] = true;
      }
      else 
      filled[i] = false;
    }
  }
  
  let signatureCanvas;
  let pad;
  let signatureImage = "";
  
  function saveSignature() {
    signatureImage = pad.toDataURL();
  }
  onMount(async () => {
    try {
      let value = await fetch("//api.eafabsafety.com/employee/" + localStorage.getItem("user"), {
        headers: {
          "Authorization": authHeader
        }
      })

      if (!value.ok)
        throw new Error();

      value = await value.json();
      for (let response in value.formResponses.sectionResponses)
      {
          responses[response] = [value.formResponses.sectionResponses[response].questionOne, value.formResponses.sectionResponses[response].questionTwo, value.formResponses.sectionResponses[response].questionThree, value.formResponses.sectionResponses[response].summary]
      } 
    } catch (e) {
      //
    }

    pad = new SignaturePad(signatureCanvas);
  })


  let errors = new Array(24).fill("").map(() => new Array(4).fill(""));
  let padEmpty;


  async function update(submitted = false) {

    let sectionResponses = new Array(24).fill("").map(() => new Object());

    saveSignature()

    for (let section in responses) {
      sectionResponses[section].questionOne = responses[section][0];
      sectionResponses[section].questionTwo = responses[section][1];
      sectionResponses[section].questionThree = responses[section][2];
      sectionResponses[section].summary = responses[section][3];
    }

    let contents
    if (submitted) 
      contents = JSON.stringify({
        submitted: true,
        formResponses: {
          signatureId: signatureImage,
          sectionResponses
        }
      })
    else 
      contents = contents = JSON.stringify({
        formResponses: {
          signatureId: signatureImage,
          sectionResponses
        }
      })

    await fetch("//api.eafabsafety.com/employee/" + localStorage.getItem("user"), {
      method: "put",
      headers: { "Authorization": authHeader, "Content-Type": "application/json"},
      body: contents
    })
  }

  function checkErrorsOnAllSteps() {

    // update error array to match section and field. the first error we find, set the step to that section. return the status of the errors. 
    let error = false;
    let firstStep = false;
    for (let section in responses)
    {
      for (let field in responses[section]) {
        if (responses[section][field] == "")
        {
          if (!firstStep)
          {
            step = parseInt(section)+1
            firstStep = true
          }
          error = true;
          errors[section][field] = "This field cannot be empty"
        }
      }
    }

    // check for signature empty
    if (pad.isEmpty())
    {
      error = true;
      padEmpty = true;
    }
    return error;
  }
  let opacity = false;

  // $: {
  //   console.log(pad)
  //   console.log(responses);
  //   console.log(errors);
  
  // }

</script>

<div class="font-semibold">
  <div class="fixed bg-transparent/50 z-20 w-full h-full top-0 left-0 overflow-hidden flex flex-col justify-center items-center {!confirmWindow && "hidden" }">
    <div class="border text-center bg-white top-1/2 p-8 rounded">
      <h3>You will not be able to modify your responses after submitting.</h3><br>
        <h3>Are you sure you want to submit?</h3>
      <div class="flex flex-row justify-evenly my-6">
        <button class="rounded border-2 border-blueGray-800 w-16 h-10" on:click={() => {
          confirmWindow = false;
        }}>Cancel</button>
        <button class="shadow-sm hover:shadow-lg transition-shadow ease-in rounded text-white bg-blueGray-800 w-16 h-10" on:click={() => {
          update(true)
          // window.location = "/login"
          // localStorage.clear("token")
        }}>Submit</button>
      </div>
    </div>
  </div>
  <div class="absolute bg-blueGray-100 w-full">
    <!-- <button class="absolute md:hidden top-52 z-20 w-6 left-nearleft bg-blueGray-800 rounded-r-lg"><i class="fas fa-chevrons-left text-white"></i></button> -->
    <div class="hidden w-1/3 w-0 w-1/5 w-10 pl-6 w-auto"></div>
    <div use:clickOutside on:click_outside={() => sidebar = false} class="flex fixed overflow-auto gap-2 flex-col left-0 top-0 w-{sidebar ? "10" : "0"} overflow-x-hidden transition-[width] z-20 ease-in-out h-full bg-white">
    <div class="mt-14"></div>
      {#each Array(25) as _, i}
        <button class=" bg-transparent text-black p-4 text-sm hover:text-blueGray-500 transition-colors ease-in rounded-full border-2 {step == i+1 ? "font-bold" : ""} {filled[i] ? "bg-gray-200" : "bg-white"}" on:click={() => { 
          step = i+1;
        }}>{i+1}</button>
      {/each}
    </div>
    <IndexNavbar />
    <div class="relative bg-blueGray-800{ opacity ? "/90" : ""} md:pt-32 pb-32 pt-12 px-4 md:px-10 mx-auto w-full"/>
    <div class="px-4 md:px-10 mx-auto w-full -m-24">
      <div class="flex flex-wrap mt-4">
        <div class="w-full mb-12 px-4">
          <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white text-white">
            <div class="rounded-t mb-0 px-4 py-3 border-0">
              <div class="flex flex-wrap items-center">
                <div class="relative w-full px-4 max-w-full flex-grow justify-evenly xl:flex hidden">
                  {#each Array(25) as _, i}
                  <button class="w-10 h-10 text-black rounded-full border-2 {filled[i] ? "bg-gray-200" : "bg-white"}" on:click={() => step = i+1}
                  >
                    <p class="{i+1 == step ? "font-bold" : "font-normal"}">{i+1}</p>
                  </button>
                  {/each}
                </div>
                <div class="xl:hidden flex flex-row w-full align-center items-center justify-between">
                  <button class="h-10 w-10 text-black" on:click={() => {
                    // if (sidebar)
                    //   sidebar = false;
                    sidebar = true;
                  }}><i class="fas fa-bars"></i></button>
                  <h3 class="md:hidden w-fit text-black self-end my-2">EAFab Safety Assessment</h3>
                  <div class="w-4"></div>

                </div>
              </div>
            </div>
            <div class="flex flex-col items-center mx-4">
              {#if step == 1}
                <em class="text-sm font-normal text-center text-black">Directions: Read each section and complete each corresponding question. When you have answered all questions and completed your signature, click submit.</em>
                <em class="text-sm font-normal text-center text-black">You will not be able to access this form again once you have submitted it.</em>
              {/if}
              <div class="flex md:flex-{step == 25 ? "col" : "row"} flex-col items-center justify-evenly w-full md:w-4/5 mb-10 mt-5 gap-6 text-black overflow-x-auto">
                <!-- Projects table -->
                  {#if step !== 25}
                    <iframe class="terms-container w-full md:h-300 hidden md:block select-none bg-gray-100 overflow-auto border-2" src="/assets/programpages/program_step{step}.pdf#toolbar=0&navpanes=0&scrollbar=0" title="terms"/>
                       <!-- {@html sections[step-1]} -->
                    
                    <a class="text-sm md:hidden text-blueGray-700 hover:text-blueGray-500" target="blank" href="/assets/program.pdf" download>Click to download the full document.</a>
                  {:else}
                    <h3 class="text-center">Affirm you agree to the terms presented by completing your signature</h3>
                  {/if}
                  <div class="{step == 25 ? "block" : "hidden"}">
                    <div class="flex flex-row">
                      <canvas class=" border {padEmpty ? "border-red-600" : ""} " height="175" width="400" on:click={() => {
                        if (!pad.isEmpty())
                        padEmpty = false;
                      }} bind:this={signatureCanvas} />
                      <button class="absolute h-4 w-4 self-end mb-4" on:click={pad.clear()}><i class="fas fa-xmark"></i></button>
                    </div>
                    <small class="{padEmpty ? "block" : "hidden"} text-red-600 mx-auto">Please complete your signature.</small>
                  </div>
                  <div class="flex flex-col md:w-1/2 w-3/4 gap-8">
                    {#if step !== 25}
                    <div class="flex flex-row justify-center">
                      <h1 class="text-xl">Section {step}</h1>
                    </div>
                      {#each Array(3) as _, i}
                          <div class="flex flex-col gap-2">
                              <label for="{step}-{i+1}">{questions[step-1][i]}</label>
                              <textarea class="h-30 rounded {errors[step-1][i] !== "" ? "border-red-600" : ""} resize-none" name="{step}-{i+1}" id="" bind:value={responses[step-1][i]} on:change={() => {
                                errors[step-1][i] = "";
                                update();
                              }}></textarea>
                              <small class="text-red-600 {errors[step-1][i] !== "" ? "block" : "hidden"}">{errors[step-1][i]}</small>
                          </div>
                      {/each}
                      <div class="flex flex-col">
                          <label for="{step}-s">Summary of Section</label>
                          <textarea class="h-30 rounded {errors[step-1][3] !== "" ? "border-red-600" : ""} resize-none" name="{step}-s" id="" bind:value={responses[step-1][3]} on:change={() => {
                            errors[step-1][3] = "";
                            update();
                          }}></textarea>
                          <small class="text-red-600 {errors[step-1][3] !== "" ? "block" : "hidden"}">{errors[step-1][3]}</small>
                      </div>
                    {/if}
                      <div class="flex flex-row justify-between mb-6">
                        {#if step != 1}
                        <button class="rounded border-2 border-blueGray-800 w-16 h-10" on:click={() => step--}>Back</button>
                        {/if}
    
                        {#if step != 25}
                        <button class="shadow-sm hover:shadow-lg transition-shadow ease-in rounded ml-auto text-white bg-blueGray-800 w-16 h-10" on:click={() => step++}>Next</button>
                        {:else}
                        <button class="shadow-sm hover:shadow-lg transition-shadow ease-in rounded text-white bg-blueGray-800 w-16 h-10" on:click={() => {
                          update()
                          if (!checkErrorsOnAllSteps()) {
                            confirmWindow = true;
                            opacity = true;
                          }
                          // confirmWindow.show();
                          // opacity = true;

                        }}>Submit</button>
                        {/if}

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
